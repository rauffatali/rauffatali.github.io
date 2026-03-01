import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-scroll';
import { NavItem } from '../../types';

const navItems: NavItem[] = [
  { title: 'Home', path: 'home' },
  { title: 'About', path: 'about' },
  { title: 'Projects', path: 'projects' },
  { title: 'Contact', path: 'contact' }
];

// Fixed offset for scroll-to and spy calculations (avoids jitter from dynamic navbar height)
const SCROLL_OFFSET = -15;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const navbarRef = useRef<HTMLDivElement>(null);
  // Track whether the user has scrolled at all (prevents false-positives on load)
  const hasScrolled = useRef<boolean>(false);

  // Determine the currently visible section based on scroll position
  const detectActiveSection = useCallback(() => {
    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Bottom-of-page: force the last section active (only after user has scrolled)
    if (hasScrolled.current) {
      const isAtBottom = Math.ceil(scrollTop + windowHeight) >= documentHeight - 5;
      if (isAtBottom) {
        return navItems[navItems.length - 1].path;
      }
    }

    // Walk sections bottom-to-top; the first one whose top is above the detection line wins
    const detectionLine = scrollTop + Math.abs(SCROLL_OFFSET) + 20; // a little below the navbar
    for (let i = navItems.length - 1; i >= 0; i--) {
      const el = document.getElementById(navItems[i].path);
      if (el && el.offsetTop <= detectionLine) {
        return navItems[i].path;
      }
    }

    return 'home';
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Mark that the user has actually scrolled
      if (scrollTop > 10) {
        hasScrolled.current = true;
      }

      // Progress bar
      const adjustedDocHeight = documentHeight - windowHeight;
      const progress = adjustedDocHeight > 0
        ? Math.min((scrollTop / adjustedDocHeight) * 100, 100)
        : 0;

      setScrollProgress(progress);
      setScrolled(scrollTop > 50);

      // Active section detection
      setActiveSection(detectActiveSection());
    };

    // Initial calculation (scrollTop is 0. detectActiveSection will return 'home')
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [detectActiveSection]);

  // When user clicks a nav link, immediately set active (avoids waiting for scroll to finish)
  const handleNavClick = (section: string) => {
    setActiveSection(section);
    hasScrolled.current = true;
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 z-[101]">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${scrollProgress}%`, backgroundColor: 'var(--accent)' }}
        />
      </div>

      <nav ref={navbarRef} className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        <div className={`mx-auto transition-all duration-500 ${scrolled ? 'w-[92%] md:w-[89%] lg:w-[80%] mt-4' : 'w-full px-6'
          }`}>
          <div className={`mx-auto rounded-2xl transition-all duration-500 ${scrolled ? 'theme-bg-surface backdrop-blur-md shadow-lg px-6' : 'bg-transparent px-3'
            }`} style={scrolled ? { backgroundColor: 'var(--bg-surface)' } : undefined}>
            {/* Desktop Navigation */}
            <div className="hidden md:flex justify-between items-center h-16">
              {/* Logo */}
              <Link
                to="home"
                smooth={true}
                duration={500}
                offset={0}
                onClick={() => handleNavClick('home')}
                className="text-2xl font-bold relative group cursor-pointer px-3"
              >
                <span className="theme-text-primary group-hover:text-transparent transition-all duration-300 bg-clip-text group-hover:bg-gradient-to-r" style={{ backgroundImage: 'linear-gradient(to right, var(--accent), var(--accent-hover))' }}>
                  RF
                </span>
              </Link>

              {/* Navigation Items */}
              <div className="flex items-center space-x-2">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    smooth={true}
                    offset={item.path === 'home' ? 0 : SCROLL_OFFSET}
                    duration={500}
                    onClick={() => handleNavClick(item.path)}
                    className={`
                      relative px-5 py-2 cursor-pointer
                      ${activeSection === item.path
                        ? 'theme-text-primary rounded-lg'
                        : 'theme-text-secondary hover:theme-text-primary rounded-lg transition-colors duration-300'
                      }
                    `}
                    style={activeSection === item.path ? { backgroundColor: 'var(--accent-light)' } : undefined}
                  >
                    <span className="relative z-10 text-sm">
                      {item.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex justify-between items-center h-16">
              <Link
                to="home"
                smooth={true}
                duration={500}
                offset={0}
                onClick={() => handleNavClick('home')}
                className="text-2xl font-bold cursor-pointer theme-text-primary"
              >
                RF
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative w-10 h-10 focus:outline-none cursor-pointer theme-text-primary"
              >
                <div className="absolute w-6 transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2">
                  <span className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isOpen ? 'rotate-45 delay-200' : '-translate-y-2'
                    }`} style={{ backgroundColor: 'var(--text-primary)' }} />
                  <span className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isOpen ? 'opacity-0' : 'opacity-100'
                    }`} style={{ backgroundColor: 'var(--text-primary)' }} />
                  <span className={`absolute h-0.5 w-6 transform transition duration-300 ease-in-out ${isOpen ? '-rotate-45 delay-200' : 'translate-y-2'
                    }`} style={{ backgroundColor: 'var(--text-primary)' }} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}>
            <div className="backdrop-blur-md shadow-lg" style={{ backgroundColor: 'var(--bg-surface)' }}>
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  smooth={true}
                  offset={item.path === 'home' ? 0 : SCROLL_OFFSET}
                  duration={500}
                  className={`block px-6 py-3 text-sm transition-all duration-300 cursor-pointer ${activeSection === item.path
                    ? 'theme-text-primary'
                    : 'theme-text-secondary hover:theme-text-primary'
                    }`}
                  style={activeSection === item.path ? { backgroundColor: 'var(--accent-light)' } : undefined}
                  onClick={() => {
                    setIsOpen(false);
                    handleNavClick(item.path);
                  }}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;