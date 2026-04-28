'use client';
import { useEffect, useRef } from 'react';

export function useWakeLock(active: boolean): void {
  const sentinelRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    if (!active) return;
    if (typeof navigator === 'undefined') return;

    // wakeLock is not available in all browsers; guard via optional chaining
    const wl = (navigator as Navigator & { wakeLock?: WakeLock }).wakeLock;
    if (!wl) return;

    let cancelled = false;

    wl.request('screen')
      .then((sentinel) => {
        if (cancelled) {
          sentinel.release().catch(() => {});
          return;
        }
        sentinelRef.current = sentinel;
      })
      .catch(() => {
        // Request can fail (eg. document not visible). Silently ignore.
      });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && active && !sentinelRef.current) {
        wl.request('screen')
          .then((s) => { sentinelRef.current = s; })
          .catch(() => {});
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      sentinelRef.current?.release().catch(() => {});
      sentinelRef.current = null;
    };
  }, [active]);
}
