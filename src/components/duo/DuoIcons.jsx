import React from 'react';

// Official Duolingo Owl Style Vector SVG Icon
export function DuoOwlIcon({ size = 36, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Body */}
      <rect x="6" y="8" width="36" height="34" rx="17" fill="#58CC02" />
      {/* Shadow Bottom */}
      <path d="M6 32C6 38.6274 11.3726 44 18 44H30C36.6274 44 42 38.6274 42 32C42 30 42 27 42 27C35 30 13 30 6 27V32Z" fill="#46A302" />
      {/* Eyes background (White) */}
      <circle cx="17" cy="21" r="7.5" fill="#FFFFFF" />
      <circle cx="31" cy="21" r="7.5" fill="#FFFFFF" />
      {/* Pupils (Black / Eel) */}
      <circle cx="18.5" cy="21" r="3.8" fill="#4B4B4B" />
      <circle cx="29.5" cy="21" r="3.8" fill="#4B4B4B" />
      {/* Pupil sparkles */}
      <circle cx="17.5" cy="19.5" r="1.2" fill="#FFFFFF" />
      <circle cx="28.5" cy="19.5" r="1.2" fill="#FFFFFF" />
      {/* Beak (Orange) */}
      <polygon points="24,23 20,29 28,29" fill="#FF9600" />
      <polygon points="24,25 21,29 27,29" fill="#E07F00" />
      {/* Feet */}
      <rect x="14" y="42" width="6" height="4" rx="2" fill="#FF9600" />
      <rect x="28" y="42" width="6" height="4" rx="2" fill="#FF9600" />
    </svg>
  );
}

// 3D Fire / Flame SVG
export function DuoFlameIcon({ size = 22, color = '#FF9600', shadowColor = '#D67E00', className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M12 2C10 6 7 8 7 13C7 16.866 10.134 20 14 20C17.866 20 21 16.866 21 13C21 8.5 17 5 16 3C15 6 13 7 12 2Z"
        fill={color}
      />
      <path
        d="M12 11C11 13 9.5 14 9.5 16.5C9.5 18.433 11.067 20 13 20C14.933 20 16.5 18.433 16.5 16.5C16.5 14 14.5 12.5 14 11.5C13.5 13 12.5 13.5 12 11Z"
        fill="#FFC800"
      />
    </svg>
  );
}

// 3D Trophy SVG
export function DuoTrophyIcon({ size = 24, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M7 4H17V10C17 12.7614 14.7614 15 12 15C9.23858 15 7 12.7614 7 10V4Z" fill="#FFC800" />
      <path d="M7 6H4C3.44772 6 3 6.44772 3 7C3 9.5 5 11.5 7 11.5V6Z" fill="#D7A900" />
      <path d="M17 6H20C20.5523 6 21 6.44772 21 7C21 9.5 19 11.5 17 11.5V6Z" fill="#D7A900" />
      <path d="M10 15H14V18H10V15Z" fill="#D7A900" />
      <rect x="8" y="18" width="8" height="3" rx="1.5" fill="#4B4B4B" />
    </svg>
  );
}

// Celebration / Party Popper SVG
export function DuoPartyIcon({ size = 32, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4 20L10 6L18 14L4 20Z" fill="#FF4B4B" />
      <path d="M6 18L10 6L14 10L6 18Z" fill="#FF9600" />
      <circle cx="16" cy="5" r="2" fill="#58CC02" />
      <circle cx="20" cy="9" r="1.5" fill="#1CB0F6" />
      <circle cx="19" cy="4" r="1" fill="#FFC800" />
      <circle cx="13" cy="3" r="1" fill="#CE82FF" />
      <path d="M15 7L18 9" stroke="#FFC800" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Concept Icons (Backtracking, Combi, Permut, Matrix)
export function DuoBacktrackIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}

export function DuoDiceIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1" fill="currentColor" />
    </svg>
  );
}

export function DuoShuffleIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
      <line x1="4" y1="4" x2="9" y2="9" />
    </svg>
  );
}

export function DuoMatrixIcon({ size = 20, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="3" y1="15" x2="21" y2="15" />
      <line x1="9" y1="3" x2="9" y2="21" />
      <line x1="15" y1="3" x2="15" y2="21" />
    </svg>
  );
}
