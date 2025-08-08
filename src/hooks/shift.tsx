import { useEffect, useState } from 'react';

export function useShiftKey() {
  const [isHoldingShift, setIsHoldingShift] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => setIsHoldingShift(e.shiftKey);
    window.addEventListener('keydown', handleKey);
    window.addEventListener('keyup', handleKey);
    return () => {
      window.removeEventListener('keydown', handleKey);
      window.removeEventListener('keyup', handleKey);
    };
  }, []);

  return isHoldingShift;
}
