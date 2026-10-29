import { useEffect, useState } from 'react';

/** The current time, refreshed every `interval` ms so time-based UI keeps updating while nothing else changes. */
export function useNow(interval: number) {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(id);
  }, [interval]);

  return now;
}
