'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Aggressive client-side route prefetching.
 * Public navigation is dynamic, so Next.js may otherwise wait for the server
 * response after a click. We prefetch internal links while the browser is idle
 * and immediately when the user points/touches a link.
 */
export function NavigationPrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const prefetched = new Set<string>();
    let timerId: ReturnType<typeof setTimeout> | undefined;
    let observer: MutationObserver | undefined;

    const normalize = (href: string) => {
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return null;
        if (url.hash && url.pathname === window.location.pathname) return null;
        if (
          url.pathname.startsWith('/api/') ||
          url.pathname.startsWith('/senacms/') ||
          url.pathname === '/senacms' ||
          url.pathname === '/login'
        ) return null;
        return `${url.pathname}${url.search}`;
      } catch {
        return null;
      }
    };

    const prefetch = (href: string) => {
      const path = normalize(href);
      if (!path || prefetched.has(path) || path === window.location.pathname) return;
      prefetched.add(path);
      router.prefetch(path);
    };

    const scan = () => {
      document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
        const href = anchor.getAttribute('href');
        if (href) prefetch(href);
      });
    };

    const scheduleScan = () => {
      if (timerId !== undefined) clearTimeout(timerId);
      timerId = setTimeout(scan, 250);
    };

    const handlePointer = (event: Event) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (href) prefetch(href);
    };

    document.addEventListener('pointerover', handlePointer, { passive: true });
    document.addEventListener('touchstart', handlePointer, { passive: true });
    document.addEventListener('pointerdown', handlePointer, { passive: true });

    scheduleScan();

    observer = new MutationObserver(() => scheduleScan());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('pointerover', handlePointer);
      document.removeEventListener('touchstart', handlePointer);
      document.removeEventListener('pointerdown', handlePointer);
      observer?.disconnect();
      if (timerId !== undefined) {
        clearTimeout(timerId);
      }
    };
  }, [router]);

  return null;
}
