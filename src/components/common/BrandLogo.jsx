import React from 'react';
import logo1 from '../../assets/logo1.png';
import logo2 from '../../assets/logo2.png';

/**
 * BrandLogo component
 * - variant="icon": displays logo2.png (used for Title, Navbar brand icon, Browser Tab)
 * - variant="full": displays logo1.png (used for Login screen, Modals, Sidebar, and all other places)
 */
export const BrandLogo = ({
  size = 'md',
  variant = 'full',
  className = '',
  alt = 'Finora - Manage money smarter',
}) => {
  // 1. Icon-only mode (logo2.png) - For Title / Navbar / Favicon
  if (variant === 'icon') {
    const iconDim =
      size === 'sm'
        ? 'w-7 h-7 rounded-lg'
        : size === 'lg'
        ? 'w-11 h-11 rounded-xl'
        : size === 'xl'
        ? 'w-14 h-14 rounded-2xl'
        : 'w-9 h-9 rounded-xl';

    return (
      <div className={`flex items-center justify-center select-none ${className}`}>
        <img
          src={logo2}
          alt={alt}
          className={`${iconDim} object-contain transition-transform hover:scale-105 shadow-2xs`}
        />
      </div>
    );
  }

  // 2. Full brand lockup (logo1.png: Icon + "Finora" + "Manage money smarter") - For all other places
  const fullDim =
    size === 'sm'
      ? 'h-8 max-w-[150px]'
      : size === 'lg'
      ? 'h-12 max-w-[220px]'
      : size === 'xl'
      ? 'h-16 max-w-[280px]'
      : 'h-10 max-w-[180px]';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logo1}
        alt={alt}
        className={`${fullDim} w-auto object-contain transition-transform`}
      />
    </div>
  );
};

export default BrandLogo;
