'use client';

import { useEffect } from 'react';

export function ArticleViewTracker({ articleId }: { articleId: number }) {
  useEffect(() => {
    const key = `senaweb_view_${articleId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, '1');
    } catch {}

    fetch(`/api/articles/${articleId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'view' }),
      keepalive: true,
    }).catch(() => {});
  }, [articleId]);

  return null;
}
