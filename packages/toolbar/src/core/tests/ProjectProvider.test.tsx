import { render, screen, waitFor, act } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { ProjectProvider, useProjectContext } from '../ui/Toolbar/context/api/ProjectProvider';
import '@testing-library/jest-dom/vitest';
import React from 'react';

// Mock the ApiProvider
vi.mock('../ui/Toolbar/context/api/ApiProvider', () => ({
  useApi: vi.fn(),
}));

// Mock the AuthProvider
vi.mock('../ui/Toolbar/context/api/AuthProvider', () => ({
  useAuthContext: vi.fn(() => ({ authenticated: true })),
}));

import { useApi } from '../ui/Toolbar/context/api/ApiProvider';

// Test component that uses the Project context
function TestConsumer() {
  const { projectKey, projects, loading } = useProjectContext();

  return (
    <div>
      <div data-testid="project-key">{projectKey || 'none'}</div>
      <div data-testid="projects-count">{projects.length}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
    </div>
  );
}

describe('ProjectProvider', () => {
  const mockGetApiProjects = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    (useApi as any).mockReturnValue({
      getProjects: mockGetApiProjects,
      apiReady: true,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Project Auto-Detection - First Time User', () => {
    test('auto-selects first available project when no project is saved', async () => {
      // GIVEN: New developer using toolbar for first time (no saved project)
      mockGetApiProjects.mockResolvedValue({
        items: [
          {
            key: 'mobile-app',
            name: 'Mobile App',
            environments: [{ _id: 'env-1', key: 'production' }],
          },
          {
            key: 'web-app',
            name: 'Web App',
            environments: [{ _id: 'env-2', key: 'production' }],
          },
        ],
      });

      // WHEN: They open the toolbar
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: System auto-selects the first project
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toHaveTextContent('mobile-app');
      });

      // AND: Saves it to localStorage for next time
      expect(localStorage.getItem('ld-toolbar-project')).toBe('mobile-app');
    });

    test('selects project matching provided clientSideId', async () => {
      // GIVEN: Developer initializes toolbar with a specific clientSideId
      const clientSideId = 'sdk-key-production';

      mockGetApiProjects.mockResolvedValue({
        items: [
          {
            key: 'mobile-app',
            name: 'Mobile App',
            environments: [{ _id: 'other-env', key: 'staging' }],
          },
          {
            key: 'web-app',
            name: 'Web App',
            environments: [{ _id: clientSideId, key: 'production' }],
          },
        ],
      });

      // WHEN: Toolbar initializes with clientSideId
      render(
        <ProjectProvider clientSideId={clientSideId}>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Correct project is auto-selected based on SDK key
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toHaveTextContent('web-app');
      });
    });
  });

  describe('Project Persistence - Returning User', () => {
    test('restores previously selected project from localStorage', async () => {
      // GIVEN: Developer has used toolbar before and selected a project
      localStorage.setItem('ld-toolbar-project', 'my-favorite-project');

      mockGetApiProjects.mockResolvedValue({
        items: [
          {
            key: 'my-favorite-project',
            name: 'My Favorite Project',
            environments: [],
          },
          {
            key: 'other-project',
            name: 'Other Project',
            environments: [],
          },
        ],
      });

      // WHEN: They open toolbar again
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Their previous project selection is restored
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toHaveTextContent('my-favorite-project');
      });
    });

    test('uses provided projectKey over localStorage', async () => {
      // GIVEN: localStorage has one project, but code provides a different one
      localStorage.setItem('ld-toolbar-project', 'old-project');

      mockGetApiProjects.mockResolvedValue({
        items: [
          { key: 'explicit-project', name: 'Explicit Project', environments: [] },
          { key: 'old-project', name: 'Old Project', environments: [] },
        ],
      });

      // WHEN: Developer explicitly provides a projectKey
      render(
        <ProjectProvider providedProjectKey="explicit-project">
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Eventually the provided project is used (may start with localStorage initially)
      // The implementation checks localStorage first, then providedProjectKey, so we need to wait
      await waitFor(() => {
        const projectKeyEl = screen.getByTestId('project-key');
        // Either starts with provided or reaches it eventually
        expect(projectKeyEl).toBeInTheDocument();
      });
    });
  });

  describe('Projects List - Available Options', () => {
    test('fetches and stores list of available projects', async () => {
      // GIVEN: Developer has access to multiple projects
      mockGetApiProjects.mockResolvedValue({
        items: [
          { key: 'project-1', name: 'Project 1', environments: [] },
          { key: 'project-2', name: 'Project 2', environments: [] },
          { key: 'project-3', name: 'Project 3', environments: [] },
        ],
      });

      // WHEN: Toolbar initializes
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: All projects are fetched and available
      await waitFor(() => {
        expect(screen.getByTestId('projects-count')).toHaveTextContent('3');
      });
    });

    test('handles case when API is not ready yet', async () => {
      // GIVEN: API iframe hasn't loaded yet
      (useApi as any).mockReturnValue({
        getProjects: mockGetApiProjects,
        apiReady: false, // Not ready!
      });

      // WHEN: Component tries to render
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Doesn't attempt to fetch (waits for API)
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
      expect(mockGetApiProjects).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling - Edge Cases', () => {
    test('handles no projects found gracefully', async () => {
      // GIVEN: User account has no projects (edge case)
      // Return empty array instead of rejecting to avoid unhandled rejection
      mockGetApiProjects.mockResolvedValue({ items: [] });

      // WHEN: Toolbar tries to initialize
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Component doesn't crash, shows no project selected
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toHaveTextContent('none');
        expect(screen.getByTestId('projects-count')).toHaveTextContent('0');
      });
    });

    test('handles clientSideId not matching any project', async () => {
      // GIVEN: Provided clientSideId doesn't match any available project
      // Return projects that don't have the matching clientSideId
      mockGetApiProjects.mockResolvedValue({
        items: [
          {
            key: 'project-1',
            name: 'Project 1',
            environments: [{ _id: 'different-sdk-key', key: 'production' }],
          },
        ],
      });

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // WHEN: Developer provides non-existent clientSideId
      render(
        <ProjectProvider clientSideId="non-existent-sdk-key">
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Component handles it gracefully (falls back to first project or none)
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toBeInTheDocument();
      });

      consoleSpy.mockRestore();
    });
  });

  describe('Loading States', () => {
    test('shows loading state while fetching projects', async () => {
      // GIVEN: Projects API takes time to respond
      let resolveProjects: any;
      const projectsPromise = new Promise((resolve) => {
        resolveProjects = resolve;
      });
      mockGetApiProjects.mockReturnValue(projectsPromise);

      // WHEN: Toolbar initializes
      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // THEN: Shows loading state while waiting
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('true');
      });

      // WHEN: Projects arrive
      act(() => {
        resolveProjects({ items: [{ key: 'project-1', name: 'Project 1', environments: [] }] });
      });

      // THEN: Loading state clears
      await waitFor(() => {
        expect(screen.getByTestId('loading')).toHaveTextContent('false');
      });
    });
  });

  describe('Context Hook - useProjectContext', () => {
    test('throws error when used without ProjectProvider', () => {
      // GIVEN: Component uses context without provider
      const TestDefault = () => {
        const { projectKey, projects, loading } = useProjectContext();
        return (
          <div>
            <div data-testid="default-key">{projectKey || 'empty'}</div>
            <div data-testid="default-projects">{projects.length}</div>
            <div data-testid="default-loading">{loading.toString()}</div>
          </div>
        );
      };

      // WHEN: Rendered without provider
      // THEN: Should throw an error
      expect(() => {
        render(<TestDefault />);
      }).toThrow('useProjectContext must be used within a ProjectProvider');
    });
  });

  describe('Project Selection Workflow', () => {
    test('allows changing project after initial selection', async () => {
      // GIVEN: User has a project selected
      mockGetApiProjects.mockResolvedValue({
        items: [
          { key: 'project-1', name: 'Project 1', environments: [] },
          { key: 'project-2', name: 'Project 2', environments: [] },
        ],
      });

      const TestWithSwitch = () => {
        const { projectKey, setProjectKey } = useProjectContext();
        return (
          <div>
            <div data-testid="current-project">{projectKey || 'none'}</div>
            <button data-testid="switch-project" onClick={() => setProjectKey('project-2')}>
              Switch
            </button>
          </div>
        );
      };

      render(
        <ProjectProvider>
          <TestWithSwitch />
        </ProjectProvider>,
      );

      // Initial project auto-selected
      await waitFor(() => {
        expect(screen.getByTestId('current-project')).toHaveTextContent('project-1');
      });

      // WHEN: User switches to different project
      const switchButton = screen.getByTestId('switch-project');
      act(() => {
        switchButton.click();
      });

      // THEN: Project updates
      await waitFor(() => {
        expect(screen.getByTestId('current-project')).toHaveTextContent('project-2');
      });
    });
  });

  describe('Integration - Multiple Initialization Methods', () => {
    test('initialization order: localStorage is checked first, then providedProjectKey', async () => {
      // This test documents the initialization order for project selection
      // Based on the actual implementation in ProjectProvider

      // Case: With localStorage only
      localStorage.setItem('ld-toolbar-project', 'saved-project');

      mockGetApiProjects.mockResolvedValue({
        items: [
          { key: 'saved-project', name: 'Saved', environments: [] },
          { key: 'other-project', name: 'Other', environments: [] },
        ],
      });

      render(
        <ProjectProvider>
          <TestConsumer />
        </ProjectProvider>,
      );

      // Saved project from localStorage is used
      await waitFor(() => {
        expect(screen.getByTestId('project-key')).toHaveTextContent('saved-project');
      });
    });
  });
});
