import React from 'react';
import { Link } from 'react-scroll';
import EyeWorld from '../three/EyeWorld';

const Hero: React.FC = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden theme-bg-main theme-text-primary">
      {/* Eye-World 3D Background */}
      <div className="absolute inset-0 z-0">
        <EyeWorld className="w-full h-full" />
      </div>

      {/* Content */}
      <div className="z-10 text-center px-6 max-w-4xl mx-auto py-20 hero-copy-shell">
        <div className="mb-6 inline-block">
          <span className="px-4 py-1 rounded-full text-sm theme-accent-bg-light theme-accent" style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
            Ph.D. in Computer Vision
          </span>
        </div>
        <h1 className="hero-heading text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent theme-accent">
          Welcome to My World of Computer Vision
        </h1>
        <p className="hero-subtext text-xl md:text-2xl mb-8 theme-text-secondary">
          I'm <span className="font-semibold theme-text-primary">Rauf Fatali</span>, building 
          AI-driven solutions to solve real-world problems through computer vision and deep learning.
        </p>
        <div className="space-x-4">
          <Link
            to="projects"
            spy={true}
            smooth={true}
            className="hero-btn-primary inline-block px-6 py-3 font-bold rounded-lg transition transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: 'var(--accent)', color: 'var(--text-on-accent)' }}
          >
            Explore My Work
          </Link>
          <Link
            to="contact"
            spy={true}
            smooth={true}
            className="hero-btn-secondary inline-block px-6 py-3 font-bold rounded-lg transition border transform hover:scale-105 cursor-pointer"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' }}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
