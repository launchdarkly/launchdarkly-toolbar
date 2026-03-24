import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';

import {
  IFrameProvider,
  useIFrameContext,
  MAX_IFRAME_RETRIES,
  IFRAME_READY_TIMEOUT_MS,
} from '../ui/Toolbar/context/api/IFrameProvider';

function TestConsumer() {
  const { iframeKey, iframeErrorCount, hasExhaustedRetries, onIFrameError, signalIFrameReady } = useIFrameContext();

  return (
    <div>
      <div data-testid="iframe-key">{iframeKey}</div>
      <div data-testid="error-count">{iframeErrorCount}</div>
      <div data-testid="exhausted">{hasExhaustedRetries ? 'true' : 'false'}</div>
      <button data-testid="trigger-error" onClick={onIFrameError}>
        Trigger Error
      </button>
      <button data-testid="signal-ready" onClick={signalIFrameReady}>
        Signal Ready
      </button>
    </div>
  );
}

function renderWithProvider() {
  return render(
    <IFrameProvider authUrl="https://integrations.launchdarkly.com">
      <TestConsumer />
    </IFrameProvider>,
  );
}

describe('IFrameProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Initial State', () => {
    test('starts with zero errors and no exhausted retries', () => {
      renderWithProvider();

      expect(screen.getByTestId('iframe-key')).toHaveTextContent('0');
      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
      expect(screen.getByTestId('exhausted')).toHaveTextContent('false');
    });
  });

  describe('Retry Behavior', () => {
    test('increments error count on each iframe error', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('trigger-error').click();
      });

      expect(screen.getByTestId('error-count')).toHaveTextContent('1');
      expect(screen.getByTestId('exhausted')).toHaveTextContent('false');
    });

    test('increments iframeKey after retry delay to force remount', async () => {
      renderWithProvider();

      expect(screen.getByTestId('iframe-key')).toHaveTextContent('0');

      act(() => {
        screen.getByTestId('trigger-error').click();
      });

      // Key should not change immediately (waiting for backoff delay)
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('0');

      // First retry delay is 1000ms (BASE_DELAY_MS * 2^0)
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(screen.getByTestId('iframe-key')).toHaveTextContent('1');
    });

    test('uses exponential backoff for retry delays', async () => {
      renderWithProvider();

      // First error: delay = 1000ms * 2^0 = 1000ms
      act(() => {
        screen.getByTestId('trigger-error').click();
      });
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('1');

      // Second error: delay = 1000ms * 2^1 = 2000ms
      act(() => {
        screen.getByTestId('trigger-error').click();
      });
      act(() => {
        vi.advanceTimersByTime(1999);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('1');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('2');

      // Third error: delay = 1000ms * 2^2 = 4000ms
      act(() => {
        screen.getByTestId('trigger-error').click();
      });
      act(() => {
        vi.advanceTimersByTime(3999);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('2');
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('3');
    });

    test('logs a warning on each retry attempt', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderWithProvider();

      act(() => {
        screen.getByTestId('trigger-error').click();
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('attempt 1/5'));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      act(() => {
        screen.getByTestId('trigger-error').click();
      });

      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('attempt 2/5'));

      warnSpy.mockRestore();
    });
  });

  describe('Exhausted Retries', () => {
    test('marks retries as exhausted after MAX_IFRAME_RETRIES errors', () => {
      renderWithProvider();

      for (let i = 0; i < MAX_IFRAME_RETRIES; i++) {
        act(() => {
          screen.getByTestId('trigger-error').click();
        });
        if (i < MAX_IFRAME_RETRIES - 1) {
          act(() => {
            vi.advanceTimersByTime(1000 * Math.pow(2, i));
          });
        }
      }

      expect(screen.getByTestId('error-count')).toHaveTextContent(String(MAX_IFRAME_RETRIES));
      expect(screen.getByTestId('exhausted')).toHaveTextContent('true');
    });

    test('does not schedule further retries after exhaustion', () => {
      renderWithProvider();

      for (let i = 0; i < MAX_IFRAME_RETRIES; i++) {
        act(() => {
          screen.getByTestId('trigger-error').click();
        });
        if (i < MAX_IFRAME_RETRIES - 1) {
          act(() => {
            vi.advanceTimersByTime(1000 * Math.pow(2, i));
          });
        }
      }

      const keyAfterExhaustion = screen.getByTestId('iframe-key').textContent;

      // Advance timers well beyond any possible backoff
      act(() => {
        vi.advanceTimersByTime(100000);
      });

      expect(screen.getByTestId('iframe-key')).toHaveTextContent(keyAfterExhaustion!);
    });

    test('logs an error when retries are exhausted', () => {
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderWithProvider();

      for (let i = 0; i < MAX_IFRAME_RETRIES; i++) {
        act(() => {
          screen.getByTestId('trigger-error').click();
        });
        if (i < MAX_IFRAME_RETRIES - 1) {
          act(() => {
            vi.advanceTimersByTime(1000 * Math.pow(2, i));
          });
        }
      }

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(`failed to load after ${MAX_IFRAME_RETRIES} attempts`),
      );

      errorSpy.mockRestore();
      warnSpy.mockRestore();
    });
  });

  describe('Communication Timeout', () => {
    test('triggers onIFrameError when iframe does not respond within timeout', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderWithProvider();

      expect(screen.getByTestId('error-count')).toHaveTextContent('0');

      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS);
      });

      expect(screen.getByTestId('error-count')).toHaveTextContent('1');
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('did not respond within'));

      warnSpy.mockRestore();
    });

    test('does not trigger error if signalIFrameReady is called before timeout', () => {
      renderWithProvider();

      act(() => {
        screen.getByTestId('signal-ready').click();
      });

      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS + 1000);
      });

      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
    });

    test('restarts timeout when iframeKey changes after a retry', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderWithProvider();

      // First timeout fires at IFRAME_READY_TIMEOUT_MS
      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS);
      });
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      // Retry delay fires, iframeKey increments, new timeout starts
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByTestId('iframe-key')).toHaveTextContent('1');

      // Second timeout fires at IFRAME_READY_TIMEOUT_MS after the retry
      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS);
      });
      expect(screen.getByTestId('error-count')).toHaveTextContent('2');

      warnSpy.mockRestore();
    });

    test('signalIFrameReady after a retry prevents the new timeout from firing', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      renderWithProvider();

      // First timeout fires
      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS);
      });
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      // Retry delay fires, iframeKey increments
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // This time the iframe responds
      act(() => {
        screen.getByTestId('signal-ready').click();
      });

      // Timeout should not fire
      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS + 1000);
      });
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      warnSpy.mockRestore();
    });

    test('does not start timeout when retries are already exhausted', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithProvider();

      // Exhaust all retries via manual errors
      for (let i = 0; i < MAX_IFRAME_RETRIES; i++) {
        act(() => {
          screen.getByTestId('trigger-error').click();
        });
        if (i < MAX_IFRAME_RETRIES - 1) {
          act(() => {
            vi.advanceTimersByTime(1000 * Math.pow(2, i));
          });
        }
      }

      expect(screen.getByTestId('exhausted')).toHaveTextContent('true');
      const errorCountAfterExhaustion = screen.getByTestId('error-count').textContent;

      // No further timeout should fire
      act(() => {
        vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS * 10);
      });

      expect(screen.getByTestId('error-count')).toHaveTextContent(errorCountAfterExhaustion!);

      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });

    test('timeout-driven retries eventually exhaust all attempts', () => {
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      renderWithProvider();

      // Let each timeout fire and then wait for the retry delay + next timeout
      for (let i = 0; i < MAX_IFRAME_RETRIES; i++) {
        // Timeout fires
        act(() => {
          vi.advanceTimersByTime(IFRAME_READY_TIMEOUT_MS);
        });

        if (i < MAX_IFRAME_RETRIES - 1) {
          // Retry backoff delay fires, iframeKey increments
          act(() => {
            vi.advanceTimersByTime(1000 * Math.pow(2, i));
          });
        }
      }

      expect(screen.getByTestId('exhausted')).toHaveTextContent('true');
      expect(screen.getByTestId('error-count')).toHaveTextContent(String(MAX_IFRAME_RETRIES));

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining(`failed to load after ${MAX_IFRAME_RETRIES} attempts`),
      );

      warnSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe('useIFrameContext Hook', () => {
    test('throws error when used outside provider', () => {
      const BadComponent = () => {
        useIFrameContext();
        return <div>Bad</div>;
      };

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<BadComponent />);
      }).toThrow('useIFrameContext must be used within an IFrameProvider');

      consoleSpy.mockRestore();
    });

    test('provides the correct authUrl as iframeSrc', () => {
      const SrcConsumer = () => {
        const { iframeSrc } = useIFrameContext();
        return <div data-testid="src">{iframeSrc}</div>;
      };

      render(
        <IFrameProvider authUrl="https://custom-auth.example.com">
          <SrcConsumer />
        </IFrameProvider>,
      );

      expect(screen.getByTestId('src')).toHaveTextContent('https://custom-auth.example.com');
    });
  });
});
