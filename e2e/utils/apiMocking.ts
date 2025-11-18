import type { Page } from '@playwright/test';

/**
 * Intercepts and delays postMessage API responses from the iframe
 * This simulates slow API responses while allowing authentication to succeed
 */
export async function delayApiResponses(page: Page, delayMs: number) {
  await page.addInitScript((delay) => {
    // Intercept window.addEventListener for 'message' events
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (this: any, type: any, listener: any, options: any) {
      if (type === 'message') {
        // Wrap the listener to delay API responses
        const wrappedListener = function (this: any, event: any) {
          const data = event.data;
          console.log('[Test] Received message:', data);
          // Only delay API response messages, not authentication
          if (
            data &&
            data.type &&
            (data.type.includes('response') || data.type.includes('error')) &&
            !data.type.includes('authenticated')
          ) {
            console.log('[Test] Delaying API response:', data.type, `by ${delay}ms`);
            setTimeout(() => {
              (listener as any).call(this, event);
            }, delay);
          } else {
            // Let authentication and other messages through immediately
            (listener as any).call(this, event);
          }
        };
        return originalAddEventListener.call(this, type, wrappedListener as any, options);
      }
      return originalAddEventListener.call(this, type, listener, options);
    } as any;
  }, delayMs);
}

/**
 * Blocks API responses from the iframe while allowing authentication
 */
export async function blockApiResponses(page: Page) {
  await page.addInitScript(() => {
    // Intercept window.addEventListener for 'message' events
    const originalAddEventListener = window.addEventListener;
    window.addEventListener = function (this: any, type: any, listener: any, options: any) {
      if (type === 'message') {
        // Wrap the listener to block API responses
        const wrappedListener = function (this: any, event: any) {
          const data = event.data;

          // Block API response messages, but not authentication
          if (
            data &&
            data.type &&
            (data.type.includes('response') || data.type.includes('error')) &&
            !data.type.includes('authenticated')
          ) {
            console.log('[Test] Blocked API response:', data.type);
            return; // Don't call the listener
          }
          // Let authentication and other messages through
          (listener as any).call(this, event);
        };
        return originalAddEventListener.call(this, type, wrappedListener as any, options);
      }
      return originalAddEventListener.call(this, type, listener, options);
    } as any;
  });
}

/**
 * Waits for the toolbar to be authenticated and ready
 */
export async function waitForToolbarReady(page: Page) {
  await page.waitForSelector('[data-testid="launchdarkly-toolbar"]');
  await page.waitForFunction(
    () => {
      const loginScreen = document.querySelector('[data-testid="login-screen"]');
      return !loginScreen;
    },
    { timeout: 10000 },
  );
}
