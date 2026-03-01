import React, { useState, useEffect, useRef } from 'react';
import { animateScroll as scroll } from 'react-scroll';

type ThemeMode = 'light' | 'dark';
type AccentColor = 'neutral' | 'blue' | 'red' | 'green';

const accentColors: {
  id: AccentColor;
  name: string;
  color: string;
  light: string;
  dark: string;
}[] = [
    {
      id: 'neutral',
      name: 'Neutral',
      color: '#525252',
      light: '#f5f5f5',
      dark: '#262626',
    },
    {
      id: 'blue',
      name: 'Blue',
      color: '#3b82f6',
      light: '#dbeafe',
      dark: '#1e3a8a',
    },
    {
      id: 'green',
      name: 'Emerald',
      color: '#10b981',
      light: '#d1fae5',
      dark: '#064e3b',
    },
    {
      id: 'red',
      name: 'Rose',
      color: '#f43f5e',
      light: '#ffe4e6',
      dark: '#881337',
    },
  ];

const ThemeSelector: React.FC = () => {
  const [mode, setMode] = useState<ThemeMode>(
    () => (localStorage.getItem('theme-mode') as ThemeMode) || 'dark'
  );
  const [accent, setAccent] = useState<AccentColor>(
    () => (localStorage.getItem('theme-accent') as AccentColor) || 'neutral'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [inHero, setInHero] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Track scroll position to morph between theme switcher ↔ arrow
  useEffect(() => {
    const handleScroll = () => {
      const threshold = window.innerHeight * 0.5;
      const isInHero = window.scrollY < threshold;
      setInHero(isInHero);
      // Close the accent dropdown when leaving hero
      if (!isInHero) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme switcher: detect click zones (left=light, center=colors, right=dark)
  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!inHero) return;
    setHasInteracted(true);

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (clickX < width / 3) {
      setMode('light');
      setIsOpen(false);
    } else if (clickX > (width * 2) / 3) {
      setMode('dark');
      setIsOpen(false);
    } else {
      setIsOpen(!isOpen);
    }
  };

  // Arrow click: scroll to top
  const handleArrowClick = () => {
    scroll.scrollToTop({ duration: 600, smooth: 'easeInOutQuart' });
  };

  // Apply theme to document root
  useEffect(() => {
    const root = document.documentElement;
    const accentData = accentColors.find(c => c.id === accent);
    if (!accentData) return;

    const allAccents = ['neutral', 'blue', 'red', 'green'];
    for (const cls of allAccents) {
      if (cls === accent) {
        if (!root.classList.contains(cls)) root.classList.add(cls);
      } else {
        root.classList.remove(cls);
      }
    }

    if (root.getAttribute('data-mode') !== mode) {
      root.setAttribute('data-mode', mode);
    }

    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-accent', accent);
  }, [mode, accent]);

  const currentAccent = accentColors.find(c => c.id === accent);

  /* ─── animation tokens ─── */
  const morph = '0.5s cubic-bezier(0.4, 0, 0.2, 1)';

  return (
    <div ref={containerRef} className="fixed bottom-6 right-6 z-50">

      {/* ━━━ Accent Color Dropdown (only in hero) ━━━ */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 ${inHero && isOpen
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div
          className="theme-bg-elevated backdrop-blur-xl rounded-2xl p-3 theme-shadow-lg border theme-border max-w-[200px]"
          style={{ backgroundColor: 'var(--bg-elevated)' }}
        >
          <p className="text-xs text-[var(--text-muted)] mb-2 px-1 text-center uppercase tracking-wider whitespace-nowrap">
            Accent Color
          </p>
          <div className="flex gap-1 justify-center flex-wrap">
            {accentColors.map((color) => (
              <button
                key={color.id}
                onClick={() => {
                  setAccent(color.id);
                  setIsOpen(false);
                }}
                className={`w-10 h-10 rounded-xl transition-all duration-200 hover:scale-110 ${accent === color.id ? 'ring-2 ring-white ring-offset-2' : ''
                  }`}
                style={{
                  backgroundColor: mode === 'dark' ? color.dark : color.light,
                  boxShadow:
                    accent === color.id
                      ? `0 0 20px ${color.color}60`
                      : 'none',
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ━━━ Morphing Container ━━━ */}
      <div
        className="relative rounded-full cursor-pointer"
        style={{
          width: inHero ? '7rem' : '3rem',
          height: inHero ? '3.5rem' : '3rem',
          backgroundColor:
            mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)',
          border: `1.5px solid var(--border-color)`,
          boxShadow: inHero
            ? `0 4px 25px ${currentAccent?.color}30`
            : `0 4px 20px rgba(0,0,0,0.18)`,
          transition: `width ${morph}, height ${morph}, box-shadow 0.3s ease`,
          overflow: 'hidden',
        }}
        onClick={inHero ? handleSliderClick : handleArrowClick}
      >
        {/* ── Theme-switcher layer ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: inHero ? 1 : 0,
            transform: inHero ? 'scale(1)' : 'scale(0.6)',
            transition: `opacity 0.3s ease ${inHero ? '0.2s' : '0s'}, transform 0.4s ease ${inHero ? '0.15s' : '0s'}`,
            pointerEvents: inHero ? 'auto' : 'none',
          }}
        >
          {/* Track gradient */}
          <div className="absolute inset-1 rounded-full overflow-hidden">
            <div
              className="w-full h-full opacity-25"
              style={{
                background: `linear-gradient(to right, ${currentAccent?.light}, ${currentAccent?.color}, ${currentAccent?.dark})`,
              }}
            />
          </div>

          {/* Sun icon (left zone) */}
          <div className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10">
            <svg
              className={`w-5 h-5 transition-all duration-300 ${mode === 'light'
                  ? 'text-yellow-500 scale-110'
                  : 'text-gray-500'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Moon icon (right zone) */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10">
            <svg
              className={`w-5 h-5 transition-all duration-300 ${mode === 'dark'
                  ? 'text-yellow-400 scale-110'
                  : 'text-gray-500'
                }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          </div>

          {/* Center knob (color selector) */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full transition-all duration-300 z-20 flex items-center justify-center ${isOpen
                ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-transparent'
                : ''
              }`}
            style={{
              left: isOpen
                ? 'calc(50% - 20px)'
                : mode === 'dark'
                  ? 'calc(100% - 44px)'
                  : '2px',
              backgroundColor:
                mode === 'dark' ? currentAccent?.dark : currentAccent?.light,
              boxShadow: `0 0 20px ${currentAccent?.color}60`,
            }}
          >
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ backgroundColor: currentAccent?.color }}
            >
              <svg
                className={`w-3 h-3 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          {/* Tooltip for first-time visitors */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="flex w-full">
              <div className="flex-1" />
              <div
                className={`w-10 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-60'
                  }`}
              >
                {!hasInteracted && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                    <span
                      className="text-[10px] px-2 py-1 rounded-full animate-pulse border"
                      style={{
                        color: 'var(--text-muted)',
                        backgroundColor: 'var(--bg-elevated)',
                        borderColor: 'var(--border-color)',
                      }}
                    >
                      Click for colors!
                    </span>
                  </div>
                )}
              </div>
              <div className="flex-1" />
            </div>
          </div>
        </div>

        {/* ── Arrow layer (back-to-top) ── */}
        <div
          className="group"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: inHero ? 0 : 1,
            transform: inHero ? 'scale(0.4) rotate(90deg)' : 'scale(1) rotate(0deg)',
            transition: `opacity 0.3s ease ${inHero ? '0s' : '0.2s'}, transform 0.4s ease ${inHero ? '0s' : '0.15s'}`,
            pointerEvents: inHero ? 'none' : 'auto',
          }}
        >
          {/* Accent glow ring */}
          <span
            className="absolute inset-0 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300"
            style={{ boxShadow: `0 0 18px var(--accent)` }}
          />
          <svg
            className="w-5 h-5"
            style={{ color: 'var(--accent)' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
