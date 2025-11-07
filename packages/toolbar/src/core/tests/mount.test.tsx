import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import mount from '../mount';
import type { InitializationConfig } from '../../types';

describe('mount', () => {
  let rootNode: HTMLElement;
  let mockConfig: InitializationConfig;

  beforeEach(() => {
    // Create a fresh root node for each test
    rootNode = document.createElement('div');
    document.body.appendChild(rootNode);

    // Mock config
    mockConfig = {
      baseUrl: 'https://app.launchdarkly.com',
      projectKey: 'test-project',
      position: 'top-right',
    };
  });

  afterEach(() => {
    // Clean up DOM
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('Basic Mounting', () => {
    test('creates toolbar host element with correct id', () => {
      mount(rootNode, mockConfig);

      const toolbarHost = document.getElementById('ld-toolbar');
      expect(toolbarHost).not.toBeNull();
      expect(toolbarHost?.tagName).toBe('DIV');
    });

    test('creates shadow root for style isolation', () => {
      mount(rootNode, mockConfig);

      const toolbarHost = document.getElementById('ld-toolbar');
      expect(toolbarHost?.shadowRoot).not.toBeNull();
      expect(toolbarHost?.shadowRoot?.mode).toBe('open');
    });

    test('creates react mount point inside shadow root', () => {
      mount(rootNode, mockConfig);

      const toolbarHost = document.getElementById('ld-toolbar');
      const reactMount = toolbarHost?.shadowRoot?.getElementById('ld-toolbar-react-mount');

      expect(reactMount).not.toBeNull();
      expect(reactMount?.dataset.name).toBe('react-mount');
    });

    test('prevents multiple mounts with same DOM id', () => {
      const cleanup1 = mount(rootNode, mockConfig);
      const cleanup2 = mount(rootNode, mockConfig);

      const toolbars = document.querySelectorAll('#ld-toolbar');
      expect(toolbars.length).toBe(1);

      cleanup1();
      cleanup2();
    });

    test('applies correct styles to host element', () => {
      mount(rootNode, mockConfig);

      const toolbarHost = document.getElementById('ld-toolbar') as HTMLElement;
      expect(toolbarHost.style.position).toBe('absolute');
      expect(toolbarHost.style.zIndex).toBe('2147400100');
      expect(toolbarHost.style.inset).toBe('0'); // Browsers normalize '0px' to '0'
    });
  });

  describe('Style Isolation', () => {
    test('copies existing LaunchPad styles to shadow root', () => {
      // Add some LaunchPad styles to document.head
      const styleEl = document.createElement('style');
      styleEl.textContent = '.test { --lp-color-primary: blue; }';
      document.head.appendChild(styleEl);

      mount(rootNode, mockConfig);

      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowStyles = toolbarHost?.shadowRoot?.querySelector('style');

      expect(shadowStyles).not.toBeNull();
      expect(shadowStyles?.textContent).toContain('--lp-');

      styleEl.remove();
    });

    test('intercepts new toolbar styles and moves to shadow root', async () => {
      const cleanup = mount(rootNode, mockConfig);

      // Simulate toolbar injecting a style
      const newStyle = document.createElement('style');
      newStyle.textContent = '.button_abc123 { color: red; }';
      document.head.appendChild(newStyle);

      // Wait for MutationObserver to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowStyles = Array.from(toolbarHost?.shadowRoot?.querySelectorAll('style') || []);
      const hasButtonStyle = shadowStyles.some((style) => style.textContent?.includes('button_abc123'));

      expect(hasButtonStyle).toBe(true);

      // Verify style was removed from document.head
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((style) => style.textContent?.includes('button_abc123'));
      expect(stillInHead).toBe(false);

      cleanup();
    });

    test('detects LaunchPad styles with --lp- prefix', async () => {
      const cleanup = mount(rootNode, mockConfig);

      const newStyle = document.createElement('style');
      newStyle.textContent = ':root { --lp-spacing: 8px; }';
      document.head.appendChild(newStyle);

      // Wait for MutationObserver to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowStyles = Array.from(toolbarHost?.shadowRoot?.querySelectorAll('style') || []);
      const hasLpStyle = shadowStyles.some((style) => style.textContent?.includes('--lp-spacing'));

      expect(hasLpStyle).toBe(true);

      cleanup();
    });

    test('does not intercept host app styles without LaunchPad', async () => {
      const cleanup = mount(rootNode, mockConfig);

      const hostAppStyle = document.createElement('style');
      hostAppStyle.textContent = '.my-app-class { color: blue; }';
      document.head.appendChild(hostAppStyle);

      // Wait for MutationObserver to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should still be in document.head
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((style) => style.textContent?.includes('my-app-class'));
      expect(stillInHead).toBe(true);

      cleanup();
      hostAppStyle.remove();
    });

    test('handles duplicate styles gracefully', async () => {
      // Add existing style to head first
      const existingStyle = document.createElement('style');
      existingStyle.textContent = '.existing { --lp-color: blue; }';
      document.head.appendChild(existingStyle);

      const cleanup = mount(rootNode, mockConfig);

      // Try adding the same style again (simulating toolbar re-injecting)
      const duplicateStyle = document.createElement('style');
      duplicateStyle.textContent = '.existing { --lp-color: blue; }';
      document.head.appendChild(duplicateStyle);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should handle gracefully without errors
      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowStyles = Array.from(toolbarHost?.shadowRoot?.querySelectorAll('style') || []);

      // Should have styles but no errors thrown
      expect(shadowStyles.length).toBeGreaterThan(0);

      existingStyle.remove();
      cleanup();
    });
  });

  describe('Cleanup', () => {
    test('cleanup function removes toolbar from DOM', () => {
      const cleanup = mount(rootNode, mockConfig);

      expect(document.getElementById('ld-toolbar')).not.toBeNull();

      cleanup();

      expect(document.getElementById('ld-toolbar')).toBeNull();
    });

    test('cleanup function can be called multiple times safely', () => {
      const cleanup = mount(rootNode, mockConfig);

      cleanup();
      expect(() => cleanup()).not.toThrow();
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('handles missing document.head gracefully without throwing', () => {
      const originalHead = document.head;
      let didThrow = false;

      try {
        // @ts-ignore - testing edge case
        Object.defineProperty(document, 'head', {
          get: () => null,
          configurable: true,
        });

        mount(rootNode, mockConfig);
      } catch {
        didThrow = true;
      } finally {
        // Restore
        Object.defineProperty(document, 'head', {
          get: () => originalHead,
          configurable: true,
        });
      }

      // Should not throw even with null document.head
      expect(didThrow).toBe(false);
    });

    test('handles style removal error gracefully', async () => {
      const cleanup = mount(rootNode, mockConfig);

      const newStyle = document.createElement('style');
      newStyle.textContent = '.test_abc123 { color: red; }';
      document.head.appendChild(newStyle);

      // Spy on console.warn to verify error handling
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Make remove throw an error
      const originalRemove = newStyle.remove;
      newStyle.remove = vi.fn(() => {
        throw new Error('Cannot remove');
      });

      // Wait for MutationObserver to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify console.warn was called with error message
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[LaunchDarkly Toolbar] Failed to remove style element'),
        expect.any(Error),
      );

      // Restore and cleanup
      warnSpy.mockRestore();
      newStyle.remove = originalRemove;
      newStyle.remove();
      cleanup();
    });
  });
});
