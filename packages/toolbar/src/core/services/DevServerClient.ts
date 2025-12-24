import { ApiVariation } from '../ui/Toolbar/types/ldApi';

export interface DevServerProjectResponse {
  _lastSyncedFromSource: number;
  availableVariations: Record<string, ApiVariation[]>;
  flagsState: Record<string, FlagState>;
  overrides: Record<string, Override>;
  sourceEnvironmentKey: string;
  context?: any;
}

export interface FlagState {
  value: any;
  version: number;
}

export interface Override {
  value: any;
  version: number;
}

export class DevServerClient {
  private baseUrl: string;
  private projectKey: string;

  constructor(baseUrl: string, projectKey: string) {
    this.baseUrl = baseUrl;
    this.projectKey = projectKey;
  }

  async getProjectData(): Promise<DevServerProjectResponse> {
    const url = `${this.baseUrl}/dev/projects/${this.projectKey}?expand=overrides&expand=availableVariations`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Dev server error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Failed to connect to dev server at ${this.baseUrl}. Is ldcli dev-server running?`);
      }
      throw error;
    }
  }

  async setOverride(flagKey: string, value: any): Promise<{ override: boolean; value: any }> {
    const url = `${this.baseUrl}/dev/projects/${this.projectKey}/overrides/${flagKey}`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(value),
      });

      if (!response.ok) {
        throw new Error(`Failed to set override: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Failed to connect to dev server at ${this.baseUrl}`);
      }
      throw error;
    }
  }

  async clearOverride(flagKey: string): Promise<void> {
    const url = `${this.baseUrl}/dev/projects/${this.projectKey}/overrides/${flagKey}`;

    try {
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Failed to clear override: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Failed to connect to dev server at ${this.baseUrl}`);
      }
      throw error;
    }
  }

  async updateProjectContext(context: any): Promise<DevServerProjectResponse> {
    const url = `${this.baseUrl}/dev/projects/${this.projectKey}`;

    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ context }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update project context: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Failed to connect to dev server at ${this.baseUrl}`);
      }
      throw error;
    }
  }
}
