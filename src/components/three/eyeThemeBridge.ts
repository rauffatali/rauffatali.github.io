import { useEffect, useState } from 'react';
import * as THREE from 'three';

export interface EyeThemeSnapshot {
  accentColor: THREE.Color;
  bgColor: THREE.Color;
  isDarkMode: boolean;
}

const FALLBACK_ACCENT = 'hsl(220, 80%, 50%)';
const FALLBACK_BG = 'hsl(240, 10%, 5%)';

const resolveDarkMode = (root: HTMLElement): boolean => {
  const mode = (root.getAttribute('data-mode') || '').trim().toLowerCase();
  if (mode === 'light') {
    return false;
  }
  if (mode === 'dark') {
    return true;
  }

  const dataTheme = (root.getAttribute('data-theme') || '').trim().toLowerCase();
  if (dataTheme.includes('light')) {
    return false;
  }
  if (dataTheme.includes('dark')) {
    return true;
  }

  return true;
};

const parseHslString = (value: string): THREE.Color | null => {
  const normalized = value.trim().toLowerCase();
  if (!normalized.startsWith('hsl(')) {
    return null;
  }

  // Supports both comma and space separated HSL, with optional alpha part.
  const numericParts = normalized.replace(/[(),/]/g, ' ').match(/[+-]?\d*\.?\d+/g);
  if (!numericParts || numericParts.length < 3) {
    return null;
  }

  const hue = ((Number(numericParts[0]) % 360) + 360) % 360;
  const saturation = THREE.MathUtils.clamp(Number(numericParts[1]) / 100, 0, 1);
  const lightness = THREE.MathUtils.clamp(Number(numericParts[2]) / 100, 0, 1);

  return new THREE.Color().setHSL(hue / 360, saturation, lightness);
};

export const parseCssColorToThree = (
  rawColor: string,
  fallbackColor: string
): THREE.Color => {
  const candidate = rawColor.trim().length > 0 ? rawColor.trim() : fallbackColor;
  const parsedHsl = parseHslString(candidate);
  if (parsedHsl) {
    return parsedHsl;
  }

  const parsedColor = new THREE.Color();
  try {
    parsedColor.setStyle(candidate);
    return parsedColor;
  } catch {
    return new THREE.Color().setStyle(fallbackColor);
  }
};

const readThemeSnapshot = (): EyeThemeSnapshot => {
  const root = document.documentElement;
  const style = window.getComputedStyle(root);
  const accentRaw = style.getPropertyValue('--accent');
  const bgRaw = style.getPropertyValue('--bg-main');

  return {
    accentColor: parseCssColorToThree(accentRaw, FALLBACK_ACCENT),
    bgColor: parseCssColorToThree(bgRaw, FALLBACK_BG),
    isDarkMode: resolveDarkMode(root),
  };
};

export const useEyeThemeBridge = (): EyeThemeSnapshot => {
  const [themeSnapshot, setThemeSnapshot] = useState<EyeThemeSnapshot>(() => readThemeSnapshot());

  useEffect(() => {
    const root = document.documentElement;
    const update = (): void => {
      setThemeSnapshot(readThemeSnapshot());
    };

    update();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'attributes') {
          continue;
        }
        if (
          mutation.attributeName === 'class' ||
          mutation.attributeName === 'data-mode' ||
          mutation.attributeName === 'data-theme'
        ) {
          update();
          break;
        }
      }
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ['class', 'data-mode', 'data-theme', 'style'],
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return themeSnapshot;
};
