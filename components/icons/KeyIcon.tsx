import React from 'react';

const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.79-.263 1.123l-2.25 3.375c-.386.577-.962 1.026-1.616 1.252a.75.75 0 00-.573.721v3.75a.75.75 0 00.75.75h9a.75.75 0 00.75-.75v-3.75a.75.75 0 00-.573-.721c-.654-.226-1.23-.675-1.616-1.252l-2.25-3.375a1.5 1.5 0 01-.263-1.123A6.75 6.75 0 0015.75 1.5zm-3 6a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z"
      clipRule="evenodd"
    />
  </svg>
);

export default KeyIcon;
