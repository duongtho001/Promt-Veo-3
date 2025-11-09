import React from 'react';

const UploadIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M11.47 2.47a.75.75 0 011.06 0l4.5 4.5a.75.75 0 01-1.06 1.06l-3.22-3.22V16.5a.75.75 0 01-1.5 0V4.81L8.03 8.03a.75.75 0 01-1.06-1.06l4.5-4.5zM3 19.5a3 3 0 003 3h12a3 3 0 003-3v-5.25a.75.75 0 011.5 0v5.25a4.5 4.5 0 01-4.5 4.5H6a4.5 4.5 0 01-4.5-4.5v-5.25a.75.75 0 011.5 0v5.25z"
      clipRule="evenodd"
    />
  </svg>
);

export default UploadIcon;