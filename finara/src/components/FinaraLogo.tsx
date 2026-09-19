import React from 'react';
import { FinaraLogoIcon } from './FramerIcons';

interface FinaraLogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const FinaraLogo: React.FC<FinaraLogoProps> = ({ className = '', iconOnly = false }) => {
  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Exact 1:1 Finara Geometric Vector Icon */}
      <div className="flex-shrink-0 text-current">
        <FinaraLogoIcon className="w-[22px] h-[25px]" />
      </div>
      
      {!iconOnly && (
        <span className="text-[20px] font-bold tracking-tight leading-none text-current font-geist">
          Finara
        </span>
      )}
    </div>
  );
};
