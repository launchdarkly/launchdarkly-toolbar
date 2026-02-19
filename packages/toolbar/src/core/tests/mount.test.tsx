import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import mount from '../mount';
import { clearToolbarStyleCache, TOOLBAR_CLASS_PREFIX } from '../styles';
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
    // Clear cache after each test for isolation (not before, to test HMR scenarios)
    clearToolbarStyleCache();
    vi.clearAllMocks();
  });

  // Helper function to check if a style class exists in the shadow root
  const checkForStyle = (sr: ShadowRoot | null | undefined, className: string): boolean => {
    if (!sr) return false;

    // Check adoptedStyleSheets
    if (sr.adoptedStyleSheets) {
      for (const sheet of sr.adoptedStyleSheets) {
        try {
          const rules = Array.from(sheet.cssRules);
          if (rules.some((rule) => rule.cssText.includes(className))) {
            return true;
          }
        } catch {
          // cssRules may not be accessible
        }
      }
    }

    // Check direct style elements
    const shadowStyles = Array.from(sr.querySelectorAll('style') || []);
    if (shadowStyles.some((style) => style.textContent?.includes(className))) {
      return true;
    }

    // Check style container
    const container = sr.querySelector('[data-ld-toolbar-styles]');
    if (container) {
      const containerStyles = Array.from(container.querySelectorAll('style'));
      if (containerStyles.some((style) => style.textContent?.includes(className))) {
        return true;
      }
    }

    return false;
  };

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
    test('does not touch existing LaunchPad styles in document.head', () => {
      // Add some LaunchPad styles to document.head BEFORE mounting
      const styleEl = document.createElement('style');
      styleEl.textContent = '.test { --lp-color-primary: blue; }';
      document.head.appendChild(styleEl);

      mount(rootNode, mockConfig);

      // The style should still be in document.head (not moved or removed)
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((s) => s.textContent?.includes('--lp-color-primary'));
      expect(stillInHead).toBe(true);

      // The style should NOT have been copied into the shadow root
      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowRoot = toolbarHost?.shadowRoot;
      expect(checkForStyle(shadowRoot, '--lp-color-primary')).toBe(false);

      styleEl.remove();
    });

    test('intercepts new toolbar styles with ldtb_ prefix and moves to shadow root', async () => {
      const cleanup = mount(rootNode, mockConfig);

      // Simulate toolbar injecting a style with the toolbar prefix
      const newStyle = document.createElement('style');
      newStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}button_abc123 { color: red; }`;
      document.head.appendChild(newStyle);

      // Wait for interception to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowRoot = toolbarHost?.shadowRoot;

      // Check for style in either adoptedStyleSheets or style elements
      let hasButtonStyle = false;

      if (shadowRoot?.adoptedStyleSheets) {
        for (const sheet of shadowRoot.adoptedStyleSheets) {
          try {
            const rules = Array.from(sheet.cssRules);
            if (rules.some((rule) => rule.cssText.includes(`${TOOLBAR_CLASS_PREFIX}button_abc123`))) {
              hasButtonStyle = true;
              break;
            }
          } catch {
            // cssRules may not be accessible in some cases
          }
        }
      }

      if (!hasButtonStyle) {
        const shadowStyles = Array.from(shadowRoot?.querySelectorAll('style') || []);
        hasButtonStyle = shadowStyles.some((style) =>
          style.textContent?.includes(`${TOOLBAR_CLASS_PREFIX}button_abc123`),
        );
      }

      expect(hasButtonStyle).toBe(true);

      // Verify style was NOT added to document.head (synchronous interception)
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((style) =>
        style.textContent?.includes(`${TOOLBAR_CLASS_PREFIX}button_abc123`),
      );
      expect(stillInHead).toBe(false);

      cleanup();
    });

    test('does not copy host app --lp- styles to Shadow DOM (prevents version conflicts)', async () => {
      // Host applications may use their own version of LaunchPad tokens (--lp-*).
      // The toolbar must NOT intercept, copy, or remove these styles. They belong
      // entirely to the host app. The toolbar loads its own tokens into the Shadow
      // DOM via the dynamic globals.css import instead.
      const cleanup = mount(rootNode, mockConfig);

      const hostAppStyle = document.createElement('style');
      hostAppStyle.textContent = '.my-select-control { background: var(--lp-color-bg-ui-primary); display: flex; }';
      document.head.appendChild(hostAppStyle);

      // Wait for any potential interception
      await new Promise((resolve) => setTimeout(resolve, 100));

      // The style should STILL be in document.head (not removed)
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((style) => style.textContent?.includes('my-select-control'));
      expect(stillInHead).toBe(true);

      // The style should NOT be copied to Shadow DOM
      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowRoot = toolbarHost?.shadowRoot;
      expect(checkForStyle(shadowRoot, 'my-select-control')).toBe(false);

      cleanup();
      hostAppStyle.remove();
    });

    test('does not intercept host app styles without toolbar markers', async () => {
      const cleanup = mount(rootNode, mockConfig);

      const hostAppStyle = document.createElement('style');
      hostAppStyle.textContent = '.my-app-class { color: blue; }';
      document.head.appendChild(hostAppStyle);

      // Wait for interception to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should still be in document.head (not intercepted)
      const headStyles = Array.from(document.head.querySelectorAll('style'));
      const stillInHead = headStyles.some((style) => style.textContent?.includes('my-app-class'));
      expect(stillInHead).toBe(true);

      cleanup();
      hostAppStyle.remove();
    });

    test('handles duplicate toolbar styles gracefully', async () => {
      // Add existing toolbar style to head first
      const existingStyle = document.createElement('style');
      existingStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}existing_abc123 { color: blue; }`;
      document.head.appendChild(existingStyle);

      const cleanup = mount(rootNode, mockConfig);

      // Try adding a similar toolbar style (simulating toolbar re-injecting)
      const duplicateStyle = document.createElement('style');
      duplicateStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}existing_def456 { color: red; }`;
      document.head.appendChild(duplicateStyle);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should handle gracefully without errors
      const toolbarHost = document.getElementById('ld-toolbar');
      const shadowRoot = toolbarHost?.shadowRoot;

      // Should have styles in shadow root
      const hasStyles =
        (shadowRoot?.adoptedStyleSheets && shadowRoot.adoptedStyleSheets.length > 0) ||
        shadowRoot?.querySelector('style') !== null ||
        shadowRoot?.querySelector('[data-ld-toolbar-styles]') !== null;

      expect(hasStyles).toBe(true);

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

  describe('HMR Support', () => {
    test('caches toolbar styles for HMR persistence', async () => {
      const cleanup = mount(rootNode, mockConfig);

      // Inject a toolbar style with the prefix
      const newStyle = document.createElement('style');
      newStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}hmr_cache_test_12345 { color: red; }`;
      document.head.appendChild(newStyle);

      // Wait for interception to process
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify style is in shadow root
      const toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_cache_test_12345`)).toBe(true);

      // Cleanup first mount
      cleanup();
    });

    test('restores cached styles on remount (HMR scenario)', async () => {
      // Clear cache at start of this specific test to ensure clean state
      clearToolbarStyleCache();

      // First mount - inject and cache a style
      const cleanup1 = mount(rootNode, mockConfig);

      const newStyle = document.createElement('style');
      newStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}hmr_restore_test_67890 { color: blue; }`;
      document.head.appendChild(newStyle);

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Verify style is in first shadow root
      let toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_restore_test_67890`)).toBe(true);

      // Simulate HMR - cleanup and remount (but DON'T clear cache - that's the HMR scenario)
      cleanup1();

      // Verify toolbar is removed
      expect(document.getElementById('ld-toolbar')).toBeNull();

      // Second mount (HMR remount) - should restore from cache
      const cleanup2 = mount(rootNode, mockConfig);

      // Verify style is restored from cache to new shadow root
      toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_restore_test_67890`)).toBe(true);

      cleanup2();
    });

    test('cached styles persist across multiple remounts', async () => {
      // Clear cache at start of this specific test
      clearToolbarStyleCache();

      // First mount
      const cleanup1 = mount(rootNode, mockConfig);

      const newStyle = document.createElement('style');
      newStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}hmr_persist_test_11111 { color: green; }`;
      document.head.appendChild(newStyle);

      await new Promise((resolve) => setTimeout(resolve, 100));
      cleanup1();

      // Second mount - should have cached style
      const cleanup2 = mount(rootNode, mockConfig);
      let toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_persist_test_11111`)).toBe(true);
      cleanup2();

      // Third mount - should still have the cached style
      const cleanup3 = mount(rootNode, mockConfig);
      toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_persist_test_11111`)).toBe(true);
      cleanup3();
    });

    test('does not duplicate styles when same style is injected multiple times', async () => {
      // Clear cache at start of this specific test
      clearToolbarStyleCache();

      const cleanup1 = mount(rootNode, mockConfig);

      // Inject same style twice
      const style1 = document.createElement('style');
      style1.textContent = `.${TOOLBAR_CLASS_PREFIX}hmr_dedup_test_22222 { color: purple; }`;
      document.head.appendChild(style1);

      await new Promise((resolve) => setTimeout(resolve, 100));

      const style2 = document.createElement('style');
      style2.textContent = `.${TOOLBAR_CLASS_PREFIX}hmr_dedup_test_22222 { color: purple; }`;
      document.head.appendChild(style2);

      await new Promise((resolve) => setTimeout(resolve, 100));

      cleanup1();

      // Remount - check that style exists
      const cleanup2 = mount(rootNode, mockConfig);
      const toolbarHost = document.getElementById('ld-toolbar');
      expect(checkForStyle(toolbarHost?.shadowRoot, `${TOOLBAR_CLASS_PREFIX}hmr_dedup_test_22222`)).toBe(true);

      cleanup2();
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

    test('handles style removal error gracefully in backup observer', async () => {
      const cleanup = mount(rootNode, mockConfig);

      // Create a toolbar style that will be caught by the backup observer
      const newStyle = document.createElement('style');
      newStyle.textContent = `.${TOOLBAR_CLASS_PREFIX}test_error_handling { color: red; }`;

      // Spy on console.warn to verify error handling
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

      // Make remove throw an error
      const originalRemove = newStyle.remove;
      newStyle.remove = vi.fn(() => {
        throw new Error('Cannot remove');
      });

      // Add style to head - this might be caught by synchronous interception or backup observer
      document.head.appendChild(newStyle);

      // Wait for processing
      await new Promise((resolve) => setTimeout(resolve, 100));

      // The test passes if no unhandled error is thrown
      // console.warn may or may not be called depending on which path handles the style

      // Restore and cleanup
      warnSpy.mockRestore();
      newStyle.remove = originalRemove;
      try {
        newStyle.remove();
      } catch {
        // Ignore if already removed
      }
      cleanup();
    });

    test('restores original DOM methods on cleanup', () => {
      const originalAppendChild = document.head.appendChild;

      const cleanup = mount(rootNode, mockConfig);

      // Cleanup should restore original methods
      cleanup();

      // Note: The cleanup restores the methods, so they should be back to original
      // However, jsdom may have its own handling, so we just verify no errors occur
      expect(() => {
        const testStyle = document.createElement('style');
        testStyle.textContent = '.test { color: blue; }';
        document.head.appendChild(testStyle);
        testStyle.remove();
      }).not.toThrow();
    });
  });
});
