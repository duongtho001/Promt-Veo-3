import React from 'react';

const VideoCameraIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    aria-hidden="true"
    >
    <path d="M4.5 4.5a3 3 0 00-3 3v9a3 3 0 003 3h8.25a3 3 0 003-3v-9a3 3 0 00-3-3H4.5zM19.94 9.75l-2.69-1.614a1.5 1.5 0 00-2.25 1.215v6.3a1.5 1.5 0 002.25 1.215l2.7-1.615a1.5 1.5 0 000-2.43z" />
  </svg>
);

export default VideoCameraIcon;