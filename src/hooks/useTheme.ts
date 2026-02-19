import { useState, useEffect } from 'react';

type ThemeMode = 'light' | 'dark';

export const useTheme = (): ThemeMode => {
  const [mode, setMode] = useState<ThemeMode>('dark');

  useEffect(() => {
    // Get initial theme
    const root = document.documentElement;
    const currentMode = root.getAttribute('data-mode') as ThemeMode;
    if (currentMode) {
      setMode(currentMode);
    }

    // Create observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'data-mode') {
          const newMode = (mutation.target as HTMLElement).getAttribute('data-mode') as ThemeMode;
          if (newMode) {
            setMode(newMode);
          }
        }
      });
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['data-mode'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return mode;
};
