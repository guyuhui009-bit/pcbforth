import { useState, useEffect } from "react";

/**
 * Count-up animation hook with RAF memory-leak fix.
 * Uses cancelAnimationFrame on cleanup to prevent stale callbacks.
 */
export function useCountUp(target: number, duration = 2000, start = false): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let rafId: number;
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, start]);

  return count;
}
