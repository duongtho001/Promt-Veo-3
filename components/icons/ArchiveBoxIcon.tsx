import React from 'react';

const ArchiveBoxIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M2.25 2.25a.75.75 0 00-.75.75v12a.75.75 0 00.75.75h3.75a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75H3V3.75A.75.75 0 013.75 3h16.5a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.5H3.75a.75.75 0 00-.75.75v10.5h3a.75.75 0 00.75.75v.75a.75.75 0 00.75.75h6a.75.75 0 00.75-.75v-.75a.75.75 0 00.75-.75h3.75a.75.75 0 00.75-.75v-12a.75.75 0 00-.75-.75H2.25z"
      clipRule="evenodd"
    />
    <path
      d="M3 16.5a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75zM8.25 18.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z"
    />
  </svg>
);

export default ArchiveBoxIcon;
