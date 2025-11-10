import React from 'react';
import type { TranslationKeys } from '../translations';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface LoaderProps {
  t: TranslationKeys;
  progress?: { current: number; total: number };
  isComplete?: boolean;
  statusMessage?: string;
}

const Loader: React.FC<LoaderProps> = ({ t, progress, isComplete, statusMessage }) => {
  if (isComplete) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-400" />
        <p className="text-green-400 text-lg font-medium">{t.generationComplete}</p>
      </div>
    );
  }

  if (progress && progress.total > 0) {
    const percentage = Math.round((progress.current / progress.total) * 100);
    const radius = 56; // SVG circle radius
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center space-y-4 py-4">
        <div className="relative inline-flex items-center justify-center">
          <svg className="w-40 h-40">
            {/* Background Circle */}
            <circle
              className="text-gray-700/50"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
            {/* Progress Circle */}
            <circle
              className="text-[#5BEAFF]"
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
              transform="rotate(-90 80 80)"
              style={{ transition: 'stroke-dashoffset 0.35s linear' }}
            />
          </svg>
          <span className="absolute text-4xl font-bold text-cyan-300 font-mono tracking-tighter">{`${percentage}%`}</span>
        </div>
        
        {statusMessage && (
          <p className="text-center text-cyan-300 text-lg font-medium animate-pulse h-7">
            {statusMessage}
          </p>
        )}
        <span className="text-md font-semibold inline-block text-cyan-400 h-6">
          {t.generatingScene(progress.current, progress.total)}
        </span>
      </div>
    );
  }
  
  // Fallback to original spinner for non-progress tasks
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-[#5BEAFF]"></div>
      <p className="text-[#5BEAFF] text-lg font-medium">{t.loaderText}</p>
    </div>
  );
};

export default Loader;
