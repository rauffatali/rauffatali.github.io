import React, { Suspense, lazy } from 'react';
import Navbar from './components/layout/Navbar';
import ThemeSelector from './components/common/ThemeSelector';
import './App.css';

// Lazy load the Hero component which contains Three.js
const Hero = lazy(() => import('./components/sections/Hero'));
const About = lazy(() => import('./components/sections/About'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Contact = lazy(() => import('./components/sections/Contact'));

const App: React.FC = () => {
  return (
    <div className="App">
      <Navbar />
      <ThemeSelector />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Hero />
        <About />
        <Projects />
        <Contact />
      </Suspense>
    </div>
  );
};

export default App;
