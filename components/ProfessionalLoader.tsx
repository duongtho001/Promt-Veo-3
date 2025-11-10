import React from 'react';

interface ProfessionalLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'modal';
  className?: string;
  'aria-label'?: string;
}

const ProfessionalLoader: React.FC<ProfessionalLoaderProps> = ({ 
  size = 'md', 
  className = '',
  'aria-label': ariaLabel = 'Loading...' 
}) => {
  const sizes = {
    sm: { container: 'h-6', bar1: 'h-4 w-1.5', bar2: 'h-6 w-1.5', space: 'space-x-1', color: 'bg-cyan-400' },
    md: { container: 'h-8', bar1: 'h-6 w-2', bar2: 'h-8 w-2', space: 'space-x-1', color: 'bg-cyan-400' },
    lg: { container: 'h-16', bar1: 'h-12 w-4', bar2: 'h-16 w-4', space: 'space-x-2', color: 'bg-[#5BEAFF]' },
    modal: { container: 'h-12', bar1: 'h-9 w-3', bar2: 'h-12 w-3', space: 'space-x-1.5', color: 'bg-cyan-400' },
  };
  const selectedSize = sizes[size || 'md'];

  return (
    <div className={`flex items-end justify-center ${selectedSize.container} ${selectedSize.space} ${className}`} aria-label={ariaLabel}>
      <div className={`${selectedSize.bar1} ${selectedSize.color} rounded-sm animate-scale-y-pulse`} style={{ animationDelay: '0s' }}></div>
      <div className={`${selectedSize.bar2} ${selectedSize.color} rounded-sm animate-scale-y-pulse`} style={{ animationDelay: '0.2s' }}></div>
      <div className={`${selectedSize.bar1} ${selectedSize.color} rounded-sm animate-scale-y-pulse`} style={{ animationDelay: '0.4s' }}></div>
    </div>
  );
};

export default ProfessionalLoader;