/**
 * Throttles a function to execute at most once per specified delay.
 * Ensures the function is called at regular intervals, useful for
 * performance optimization of frequently triggered events like mousemove.
 *
 * @param func - The function to throttle
 * @param delay - The delay in milliseconds between function calls
 * @returns A throttled version of the function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, delay: number): (...args: Parameters<T>) => void {
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return function throttled(...args: Parameters<T>) {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallTime;

    if (timeSinceLastCall >= delay) {
      // Enough time has passed, execute immediately
      lastCallTime = now;
      func(...args);
    } else {
      // Schedule execution for the remaining time
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        func(...args);
        timeoutId = null;
      }, delay - timeSinceLastCall);
    }
  };
}
