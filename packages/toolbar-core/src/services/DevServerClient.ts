export interface DevServerProjectResponse {
  _lastSyncedFromSource: number;
  availableVariations: Record<string, Variation[]>;
  flagsState: Record<string, FlagState>;
  overrides: Record<string, Override>;
  sourceEnvironmentKey: string;
}

export interface Variation {
  _id: string;
  name: string;
  value: any;
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
  private projectKey: string | null = null;

  constructor(baseUrl: string, projectKey?: string) {
    this.baseUrl = baseUrl;
    this.projectKey = projectKey || null;
  }

  setProjectKey(projectKey: string): void {
    this.projectKey = projectKey;
  }

  getProjectKey(): string | null {
    return this.projectKey;
  }

  async getProjectData(): Promise<DevServerProjectResponse> {
    if (!this.projectKey) {
      throw new Error('No project key set. Call setProjectKey() first.');
    }

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
    if (!this.projectKey) {
      throw new Error('No project key set. Call setProjectKey() first.');
    }

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
    if (!this.projectKey) {
      throw new Error('No project key set. Call setProjectKey() first.');
    }

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

  async getAvailableProjects(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/dev/projects`);

      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Failed to connect to dev server at ${this.baseUrl}. Is ldcli dev-server running?`);
      }
      throw error;
    }
  }
}
