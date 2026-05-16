import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';

export function ThemeToggleButton() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn-outline"
      style={{
        position: 'fixed',
        top: '28px',
        right: '32px',
        zIndex: 9999,
        padding: '10px',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--surface-color)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        border: '1px solid var(--border-color)',
        color: 'var(--text-primary)'
      }}
      title="Switch Theme"
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
