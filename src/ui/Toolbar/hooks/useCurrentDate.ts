import { useState, useEffect } from 'react';

/**
 * Hook that provides the current date and updates it at a specified interval
 * Useful for displaying relative timestamps that update in real-time
 */
export function useCurrentDate(updateInterval: number = 1000): Date {
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return currentDate;
}
