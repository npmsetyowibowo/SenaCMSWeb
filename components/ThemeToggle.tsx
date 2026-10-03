'use client';

import { useEffect } from 'react';

export function ThemeToggle() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
    try {
      localStorage.removeItem('sena_theme');
    } catch {}
  }, []);

  return null;
}
