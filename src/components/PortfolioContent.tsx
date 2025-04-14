import { useEffect, useState } from 'react';
import '../styles/PortfolioContent.css';

export const PortfolioContent = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDark(true);
      document.body.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  };

  return (
    <div className="portfolio-content">
      <h1>Hello There</h1>
      <h2>My name is <span className="highlight">Mees Post</span></h2>
      <p>
        I create things on the web, with all users in mind.
      </p>
      <button onClick={toggleTheme}>
        Switch to {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}; 