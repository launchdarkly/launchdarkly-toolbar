import { useState, useEffect } from 'react';

export function useKeyPressed(targetKey: string): boolean {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = (event: KeyboardEvent) => {
      if (event.key === targetKey) {
        setKeyPressed(false);
      }
    };

    // Reset key state when focus is lost or page becomes hidden
    const resetKeyState = () => {
      setKeyPressed(false);
    };

    // Handle various focus and visibility scenarios
    const visibilityChangeHandler = () => {
      if (document.hidden) {
        resetKeyState();
      }
    };

    // Add event listeners
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    window.addEventListener('blur', resetKeyState);
    window.addEventListener('focusout', resetKeyState);
    document.addEventListener('visibilitychange', visibilityChangeHandler);

    // Also reset on page focus to ensure clean state
    window.addEventListener('focus', resetKeyState);

    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
      window.removeEventListener('blur', resetKeyState);
      window.removeEventListener('focusout', resetKeyState);
      document.removeEventListener('visibilitychange', visibilityChangeHandler);
      window.removeEventListener('focus', resetKeyState);
    };
  }, [targetKey]);

  return keyPressed;
}
