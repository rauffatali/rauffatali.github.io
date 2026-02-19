import React, { useState, useEffect, useRef } from 'react';

type ThemeMode = 'light' | 'dark';
type AccentColor = 'neutral' | 'blue' | 'red' | 'green';

// Theme configuration - uses CSS variables from theme-hsl.css
// The accent colors here are for the UI elements of the selector itself
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
  const sliderRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show tooltip on first visit only - dropdown doesn't auto-open anymore
  useEffect(() => {
    // Just track first visit, no auto-open
  }, [hasInteracted]);

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setHasInteracted(true);
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    // Left 1/3 = Light mode
    // Middle 1/3 = Open color picker  
    // Right 1/3 = Dark mode

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

  // Apply theme to document root using CSS classes and data attributes
  useEffect(() => {
    const root = document.documentElement;
    const accentData = accentColors.find(c => c.id === accent);
    if (!accentData) return;

    // Only swap classes that actually changed (avoids single-frame blank)
    const allAccents = ['neutral', 'blue', 'red', 'green'];
    for (const cls of allAccents) {
      if (cls === accent) {
        if (!root.classList.contains(cls)) root.classList.add(cls);
      } else {
        root.classList.remove(cls);
      }
    }

    // Set data-mode attribute for CSS selectors
    if (root.getAttribute('data-mode') !== mode) {
      root.setAttribute('data-mode', mode);
    }

    // Persist to localStorage for instant recall on next visit
    localStorage.setItem('theme-mode', mode);
    localStorage.setItem('theme-accent', accent);
  }, [mode, accent]);

  const currentAccent = accentColors.find(c => c.id === accent);

  return (
    <div ref={sliderRef} className="fixed bottom-6 right-6 z-50">
      {/* Color Picker Dropdown - appears above the button */}
      <div
        className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
      >
        <div
          className="theme-bg-elevated backdrop-blur-xl rounded-2xl p-3 theme-shadow-lg border theme-border max-w-[200px]"
          style={{ backgroundColor: 'var(--bg-elevated)' }}
        >
          <p className="text-xs text-[var(--text-muted)] mb-2 px-1 text-center uppercase tracking-wider whitespace-nowrap">Accent Color</p>
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
                  boxShadow: accent === color.id ? `0 0 20px ${color.color}60` : 'none'
                }}
                title={color.name}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Single Button with Slider */}
      <div
        className="relative w-28 h-14 rounded-full cursor-pointer transition-all duration-300 overflow-visible"
        style={{
          backgroundColor: mode === 'dark' ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)',
          border: '2px solid var(--border-color)',
          boxShadow: `0 4px 25px ${currentAccent?.color}30`
        }}
        onClick={handleSliderClick}
      >
        {/* Track background */}
        <div className="absolute inset-1 rounded-full overflow-hidden">
          <div
            className="w-full h-full opacity-25"
            style={{
              background: `linear-gradient(to right, ${currentAccent?.light}, ${currentAccent?.color}, ${currentAccent?.dark})`
            }}
          />
        </div>

        {/* Left Zone - Light */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10">
          <svg className={`w-5 h-5 transition-all duration-300 ${mode === 'light' ? 'text-yellow-500 scale-110' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706 1 0.707a1 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Right Zone - Dark */}
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center z-10">
          <svg className={`w-5 h-5 transition-all duration-300 ${mode === 'dark' ? 'text-yellow-400 scale-110' : 'text-gray-500'}`} fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        </div>

        {/* Center Knob - Color selector (clickable) */}
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-10 h-10 rounded-full transition-all duration-300 z-20 flex items-center justify-center ${isOpen ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''
            }`}
          style={{
            left: isOpen ? 'calc(50% - 20px)' : mode === 'dark' ? 'calc(100% - 44px)' : '2px',
            backgroundColor: mode === 'dark' ? currentAccent?.dark : currentAccent?.light,
            boxShadow: `0 0 20px ${currentAccent?.color}60`
          }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: currentAccent?.color }}
          >
            {/* Dropdown arrow indicator */}
            <svg
              className={`w-3 h-3 text-white transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Zone Labels */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex w-full">
            <div className="flex-1" />
            {/* Middle zone indicator - pulses to draw attention */}
            <div className={`w-10 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-60'}`}>
              {!hasInteracted && (
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                  <span
                    className="text-[10px] px-2 py-1 rounded-full animate-pulse border"
                    style={{
                      color: 'var(--text-muted)',
                      backgroundColor: 'var(--bg-elevated)',
                      borderColor: 'var(--border-color)'
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
    </div>
  );
};

export default ThemeSelector;
