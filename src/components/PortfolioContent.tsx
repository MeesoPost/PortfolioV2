// src/components/PortfolioContent.tsx
import { useEffect, useState, useCallback } from 'react';
import '../styles/PortfolioContent.css';

export const PortfolioContent = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');
  const [prefersDark, setPrefersDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' || 'auto';
    setTheme(savedTheme);

    // Check system preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setPrefersDark(mediaQuery.matches);

    // Apply theme
    applyTheme(savedTheme, mediaQuery.matches);

    // Listen for system theme changes
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersDark(e.matches);
      if (theme === 'auto') {
        applyTheme('auto', e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = useCallback((selectedTheme: string, systemPrefersDark: boolean) => {
    const root = document.documentElement;
    
    if (selectedTheme === 'auto') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', selectedTheme);
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const isDark = selectedTheme === 'dark' || (selectedTheme === 'auto' && systemPrefersDark);
      metaThemeColor.setAttribute('content', isDark ? '#1f0823' : '#fffcff');
    }
  }, []);

  const cycleTheme = useCallback(() => {
    const themes: ('light' | 'dark' | 'auto')[] = ['light', 'dark', 'auto'];
    const currentIndex = themes.indexOf(theme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    applyTheme(nextTheme, prefersDark);

    // Announce theme change for screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Theme changed to ${nextTheme === 'auto' ? 'system' : nextTheme} mode`;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }, [theme, prefersDark, applyTheme]);

  const getThemeIcon = () => {
    if (theme === 'auto') return '🌓';
    if (theme === 'dark') return '🌙';
    return '☀️';
  };

  const getThemeLabel = () => {
    if (theme === 'auto') return 'System';
    return theme.charAt(0).toUpperCase() + theme.slice(1);
  };

  return (
    <div className="portfolio-content">
      <header className="portfolio-header">
        <nav className="skip-links" aria-label="Skip links">
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <a href="#contact" className="skip-link">Skip to contact</a>
        </nav>
        
        <div className="theme-switcher-container">
          <button
            onClick={cycleTheme}
            className="theme-switcher"
            aria-label={`Current theme: ${getThemeLabel()}. Click to change theme`}
            aria-live="polite"
            data-theme-state={theme}
          >
            <span className="theme-icon" aria-hidden="true">{getThemeIcon()}</span>
            <span className="theme-label">{getThemeLabel()}</span>
          </button>
        </div>
      </header>

      <main id="main-content" className="portfolio-main container">
        <section className="hero-section flow-space">
          <h1 className="hero-title text-balance">
            <span className="greeting">Hello There</span>
            <span className="wave" role="img" aria-label="waving hand">👋</span>
          </h1>
          
          <h2 className="hero-subtitle">
            My name is <span className="highlight gradient-text">Mees Post</span>
          </h2>
          
          <p className="hero-description text-pretty">
            I create <span className="emphasis">inclusive</span> and <span className="emphasis">accessible</span> web experiences, 
            with all users in mind. Leveraging modern CSS and web standards to build 
            performant, beautiful interfaces.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary" aria-label="View my projects">
              View Projects
              <span className="btn-arrow" aria-hidden="true">→</span>
            </button>
            <button className="btn btn-secondary" aria-label="Download resume">
              Download Resume
              <span className="btn-icon" aria-hidden="true">📄</span>
            </button>
          </div>
        </section>

        <section className="features-section" aria-labelledby="features-title">
          <h2 id="features-title" className="sr-only">Portfolio Features</h2>
          <div className="feature-grid">
            <article className="feature-card scroll-fade-in">
              <h3>🎨 Modern CSS</h3>
              <p>Using oklch(), light-dark(), @property, and container queries for cutting-edge styling.</p>
            </article>
            <article className="feature-card scroll-fade-in">
              <h3>♿ WCAG 2.1 AAA</h3>
              <p>Exceeding accessibility standards with proper contrast ratios and keyboard navigation.</p>
            </article>
            <article className="feature-card scroll-fade-in">
              <h3>⚡ Performance First</h3>
              <p>Optimized with CSS containment, will-change, and content-visibility for smooth experiences.</p>
            </article>
            <article className="feature-card scroll-fade-in">
              <h3>📱 Responsive Design</h3>
              <p>Fluid typography and spacing using container queries and modern CSS units.</p>
            </article>
          </div>
        </section>

        <section id="contact" className="contact-section" aria-labelledby="contact-title">
          <h2 id="contact-title">Get in Touch</h2>
          <p className="text-balance">
            Ready to build something amazing together? Let's connect!
          </p>
        </section>
      </main>
    </div>
  );
};