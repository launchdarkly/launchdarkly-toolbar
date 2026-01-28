#!/usr/bin/env tsx
import { spawn, ChildProcess, exec } from 'child_process';
import { existsSync } from 'fs';
import { setTimeout } from 'timers/promises';
import { createServer } from 'net';
import { pathToFileURL } from 'url';

// ANSI color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
} as const;

interface ServiceConfig {
  name: string;
  command: string;
  args: string[];
  cwd?: string;
  env?: Record<string, string>;
  port?: number;
  healthCheck?: () => Promise<boolean>;
  startupDelay?: number;
  emoji: string;
}

class DevEnvironment {
  private processes: Map<string, ChildProcess> = new Map();
  private isShuttingDown = false;

  constructor() {
    // Handle graceful shutdown
    process.on('SIGINT', () => this.shutdown());
    process.on('SIGTERM', () => this.shutdown());
    process.on('uncaughtException', (error) => {
      this.log('error', `Uncaught exception: ${error.message}`);
      this.shutdown();
    });
  }

  private log(level: 'info' | 'success' | 'warning' | 'error', message: string, emoji = '') {
    const timestamp = new Date().toLocaleTimeString();
    const colorMap = {
      info: colors.blue,
      success: colors.green,
      warning: colors.yellow,
      error: colors.red,
    };

    console.log(`${colorMap[level]}${emoji} [${timestamp}] ${message}${colors.reset}`);
  }

  private async checkPort(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = createServer();

      server.listen(port, () => {
        server.once('close', () => resolve(true));
        server.close();
      });

      server.on('error', () => resolve(false));
    });
  }

  private async killProcessOnPort(port: number): Promise<void> {
    try {
      const command = process.platform === 'win32' ? `netstat -ano | findstr :${port}` : `lsof -ti:${port}`;

      return new Promise((resolve) => {
        exec(command, (error: any, stdout: string) => {
          if (error) {
            resolve(); // Port might not be in use
            return;
          }

          if (process.platform === 'win32') {
            // Windows implementation
            const lines = stdout.split('\n');
            const pids = lines
              .filter((line) => line.includes('LISTENING'))
              .map((line) => line.trim().split(/\s+/).pop())
              .filter(Boolean);

            pids.forEach((pid) => {
              exec(`taskkill /PID ${pid} /F`, () => {});
            });
          } else {
            // Unix-like systems
            const pids = stdout.trim().split('\n').filter(Boolean);
            pids.forEach((pid) => {
              exec(`kill -9 ${pid}`, () => {});
            });
          }

          global.setTimeout(resolve, 1000);
        });
      });
    } catch (error) {
      this.log('warning', `Failed to kill process on port ${port}: ${error}`);
    }
  }

  private async startService(config: ServiceConfig): Promise<void> {
    this.log('info', `Starting ${config.name}...`, config.emoji);

    // Check and free up port if needed
    if (config.port) {
      const isPortFree = await this.checkPort(config.port);
      if (!isPortFree) {
        this.log('warning', `Port ${config.port} is in use, attempting to free it...`, '⚠️');
        await this.killProcessOnPort(config.port);
        await setTimeout(2000); // Wait for port to be freed
      }
    }

    const childProcess = spawn(config.command, config.args, {
      cwd: config.cwd || process.cwd(),
      env: { ...process.env, ...config.env },
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true,
    });

    this.processes.set(config.name, childProcess);

    // Handle process output
    childProcess.stdout?.on('data', (data) => {
      const output = data.toString().trim();
      if (output) {
        console.log(`${colors.cyan}[${config.name}]${colors.reset} ${output}`);
      }
    });

    childProcess.stderr?.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('ExperimentalWarning')) {
        console.log(`${colors.yellow}[${config.name}]${colors.reset} ${output}`);
      }
    });

    childProcess.on('error', (error) => {
      this.log('error', `${config.name} error: ${error.message}`, '❌');
    });

    childProcess.on('exit', (code, signal) => {
      if (!this.isShuttingDown) {
        this.log('warning', `${config.name} exited with code ${code} (signal: ${signal})`, '⚠️');
      }
      this.processes.delete(config.name);
    });

    // Wait for startup delay
    if (config.startupDelay) {
      await setTimeout(config.startupDelay);
    }

    // Run health check if provided
    if (config.healthCheck) {
      const maxRetries = 10;
      let retries = 0;

      while (retries < maxRetries) {
        try {
          const isHealthy = await config.healthCheck();
          if (isHealthy) {
            this.log('success', `${config.name} is healthy`, '✅');
            break;
          }
        } catch {
          // Health check failed, continue retrying
        }

        retries++;
        await setTimeout(1000);

        if (retries === maxRetries) {
          this.log('warning', `${config.name} health check failed after ${maxRetries} attempts`, '⚠️');
        }
      }
    }
  }

  private async healthCheckHttp(url: string): Promise<boolean> {
    try {
      const response = await fetch(url);
      return response.ok;
    } catch {
      return false;
    }
  }

  async start(): Promise<void> {
    this.log('info', 'Starting LaunchDarkly Toolbar unified development environment...', '🚀');

    // Validate environment
    if (!existsSync('package.json') || !existsSync('packages/toolbar')) {
      this.log('error', 'Please run this script from the project root directory', '❌');
      process.exit(1);
    }

    // Install dependencies
    this.log('info', 'Installing dependencies...', '📦');
    await this.startService({
      name: 'install',
      command: 'pnpm',
      args: ['install'],
      emoji: '📦',
    });

    // Wait for install to complete
    await new Promise<void>((resolve) => {
      const installProcess = this.processes.get('install');
      if (installProcess) {
        installProcess.on('exit', () => resolve());
      } else {
        resolve();
      }
    });

    // Define services configuration
    const services: ServiceConfig[] = [
      {
        name: 'toolbar-watcher',
        command: 'pnpm',
        args: ['--filter', '@launchdarkly/toolbar', 'dev:cdn'],
        emoji: '🔧',
        startupDelay: 3000,
        healthCheck: () => Promise.resolve(existsSync('packages/toolbar/cdn/toolbar.min.js')),
      },
      {
        name: 'mock-server',
        command: 'pnpm',
        args: ['--filter', 'mock-server', 'start'],
        env: { PORT: '5764' },
        port: 5764,
        emoji: '🎭',
        startupDelay: 2000,
        healthCheck: () => this.healthCheckHttp('http://localhost:5764/hot-reload'),
      },
      {
        name: 'demo-app',
        command: 'pnpm',
        args: ['--filter', 'launchdarkly-toolbar-demo', 'dev'],
        port: 5173,
        emoji: '🎨',
        startupDelay: 1000,
        healthCheck: () => this.healthCheckHttp('http://localhost:5173'),
      },
    ];

    // Start services sequentially
    for (const service of services) {
      await this.startService(service);
    }

    this.log('success', 'All services started successfully!', '✅');
    this.printStatus();
    this.printInstructions();

    // Keep the process alive
    await new Promise(() => {}); // Wait indefinitely
  }

  private printStatus(): void {
    console.log('');
    this.log('info', 'Services running:', '📋');
    console.log(`  🔧 Toolbar watcher: rslib watch mode rebuilds toolbar.min.js on source changes`);
    console.log(`  🎭 Mock server: http://localhost:5764 (serves toolbar with hot reload)`);
    console.log(`  🎨 Demo app: http://localhost:5173`);
    console.log('');
  }

  private printInstructions(): void {
    this.log('success', 'Ready for development!', '🎉');
    console.log(`  • Make changes to toolbar code in ${colors.yellow}packages/toolbar/src/${colors.reset}`);
    console.log(`  • Toolbar will rebuild automatically`);
    console.log(`  • Demo app will reload when toolbar changes`);
    console.log(`  • Use Ctrl+C to stop all services`);
    console.log('');
    this.log('info', 'Development workflow:', '💡');
    console.log(`  1. Edit toolbar source files`);
    console.log(`  2. rslib watcher rebuilds toolbar.min.js`);
    console.log(`  3. Mock server detects change`);
    console.log(`  4. Demo app reloads automatically`);
    console.log('');
  }

  private async shutdown(): Promise<void> {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;

    this.log('info', 'Shutting down all services...', '🛑');

    // Kill all processes
    const killPromises = Array.from(this.processes.entries()).map(([name, childProcess]) => {
      return new Promise<void>((resolve) => {
        if (childProcess.killed) {
          resolve();
          return;
        }

        childProcess.once('exit', () => {
          this.log('info', `${name} stopped`, '🛑');
          resolve();
        });

        // Try graceful shutdown first
        childProcess.kill('SIGTERM');

        // Force kill after 5 seconds
        global.setTimeout(() => {
          if (!childProcess.killed) {
            childProcess.kill('SIGKILL');
          }
        }, 5000);
      });
    });

    await Promise.all(killPromises);
    this.log('success', 'All services stopped', '✅');
    process.exit(0);
  }
}

// Start the development environment
// Check if this file is being run directly (not imported)
if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const devEnv = new DevEnvironment();
  devEnv.start().catch((error) => {
    console.error(`${colors.red}❌ Failed to start development environment: ${error.message}${colors.reset}`);
    process.exit(1);
  });
}
