import React from 'react';

// Exact Finara Logo Icon extracted from reference site
export const FinaraLogoIcon: React.FC<{ className?: string }> = ({ className = "w-[22px] h-[25px]" }) => (
  <svg viewBox="0 0 22.081 25.234" className={className} fill="currentColor" aria-hidden="true">
    <g>
      <path d="M 12.462 2.871 L 14.12 0 L 18.819 2.714 L 17.162 5.584 C 16.871 6.087 17.307 6.699 17.877 6.589 L 21.053 5.976 L 22.081 11.305 L 18.905 11.917 C 13.768 12.908 9.847 7.401 12.462 2.871 Z" />
      <path d="M 9.618 22.363 L 7.961 25.234 L 3.261 22.521 L 4.919 19.65 C 5.21 19.147 4.774 18.535 4.203 18.645 L 1.028 19.257 L 0 13.929 L 3.176 13.317 C 8.312 12.326 12.233 17.832 9.618 22.363 Z" />
      <path d="M 9.617 2.871 L 7.96 0 L 3.26 2.714 L 4.918 5.584 C 5.208 6.087 4.773 6.699 4.202 6.589 L 1.026 5.976 L 0 11.305 L 3.175 11.917 C 8.312 12.908 12.234 7.401 9.618 2.871 Z" />
      <path d="M 12.463 22.363 L 14.12 25.234 L 18.819 22.521 L 17.162 19.65 C 16.871 19.147 17.306 18.535 17.878 18.645 L 21.053 19.257 L 22.08 13.929 L 18.905 13.317 C 13.768 12.326 9.847 17.832 12.462 22.363 Z" />
    </g>
  </svg>
);

// Chevron / Arrow Down Icon for dropdowns & accordion
export const ChevronDownIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 7 4" className={className} fill="currentColor" aria-hidden="true">
    <path d="M 3.182 2.475 L 5.657 0 L 6.363 0.707 L 3.182 3.889 L 0 0.707 L 0.707 0 Z" />
  </svg>
);

// Arrow Up Right Icon for CTA buttons
export const ArrowUpRightIcon: React.FC<{ className?: string }> = ({ className = "w-3.5 h-3.5" }) => (
  <svg viewBox="0 0 14 14" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="m1.5 8 7-7M9 5.5l-3 3" />
  </svg>
);
