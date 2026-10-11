import React from 'react';

/**
 * Realistic solid/filled icons matching reference images (Image 4 & 5).
 * - RealisticWallet: Solid wallet with curved top flap and cutout snap button (Image 5).
 * - RealisticCoins: 3D perspective stacked coins (Image 4).
 * - RealisticBank: Solid classic bank building with pediment, pillars, and steps.
 * - RealisticMobile: Solid smartphone with screen outline and home dot (bKash/Nagad).
 * - RealisticLayers: 3D isometric layers stack (All Accounts / Portfolio).
 */

export const RealisticWallet = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top bill / flap fold sticking out */}
    <path
      d="M5.5 7.2L8.2 3.8C8.6 3.3 9.3 3 10 3H16.5C17.3 3 18 3.7 18 4.5V7.2H5.5Z"
      opacity="0.95"
    />
    {/* Main wallet body with snap button cutout */}
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3.5 7.2C2.7 7.2 2 7.9 2 8.7V18C2 19.4 3.1 20.5 4.5 20.5H19.5C20.9 20.5 22 19.4 22 18V8.7C22 7.9 21.3 7.2 20.5 7.2H3.5ZM17 14.5C17 15.33 16.33 16 15.5 16C14.67 16 14 15.33 14 14.5C14 13.67 14.67 13 15.5 13C16.33 13 17 13.67 17 14.5Z"
    />
  </svg>
);

export const RealisticCoins = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Top coin */}
    <ellipse cx="8.5" cy="5.5" rx="5.5" ry="2.2" />
    {/* Coin 2 in stack */}
    <path d="M3 5.5V8.5C3 9.7 5.5 10.7 8.5 10.7C11.5 10.7 14 9.7 14 8.5V5.5C14 6.7 11.5 7.7 8.5 7.7C5.5 7.7 3 6.7 3 5.5Z" />
    {/* Coin 3 in stack */}
    <path d="M3 9V12C3 13.2 5.5 14.2 8.5 14.2C11.5 14.2 14 13.2 14 12V9C14 10.2 11.5 11.2 8.5 11.2C5.5 11.2 3 10.2 3 9Z" />
    {/* Coin 4 in stack (bottom) */}
    <path d="M3 12.5V15.5C3 16.7 5.5 17.7 8.5 17.7C11.5 17.7 14 16.7 14 15.5V12.5C14 13.7 11.5 14.7 8.5 14.7C5.5 14.7 3 13.7 3 12.5Z" />

    {/* Secondary overlapping right coin stack */}
    <ellipse cx="16" cy="11.5" rx="5" ry="2.1" opacity="0.9" />
    <path
      d="M11 11.5V14.5C11 15.65 13.2 16.6 16 16.6C18.8 16.6 21 15.65 21 14.5V11.5C21 12.65 18.8 13.6 16 13.6C13.2 13.6 11 12.65 11 11.5Z"
      opacity="0.9"
    />
    <path
      d="M11 15V18C11 19.15 13.2 20.1 16 20.1C18.8 20.1 21 19.15 21 18V15C21 16.15 18.8 17.1 16 17.1C13.2 17.1 11 16.15 11 15Z"
      opacity="0.9"
    />
  </svg>
);

export const RealisticBank = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Triangular pediment roof */}
    <path d="M12 2L2 7H22L12 2Z" />
    {/* Architrave / beam */}
    <rect x="3" y="7.5" width="18" height="1.5" rx="0.4" />
    {/* Pillars */}
    <rect x="4.5" y="10" width="2.5" height="7" rx="0.4" />
    <rect x="9" y="10" width="2.5" height="7" rx="0.4" />
    <rect x="13.5" y="10" width="2.5" height="7" rx="0.4" />
    <rect x="18" y="10" width="2.5" height="7" rx="0.4" />
    {/* Stepped stylobate base */}
    <rect x="3" y="17.8" width="18" height="1.6" rx="0.4" />
    <rect x="1.5" y="20" width="21" height="1.8" rx="0.4" />
  </svg>
);

export const RealisticMobile = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M6 2.5C4.62 2.5 3.5 3.62 3.5 5V19C3.5 20.38 4.62 21.5 6 21.5H18C19.38 21.5 20.5 20.38 20.5 19V5C20.5 3.62 19.38 2.5 18 2.5H6ZM6.5 5.5C6.5 4.95 6.95 4.5 7.5 4.5H16.5C17.05 4.5 17.5 4.95 17.5 5.5V15.5C17.5 16.05 17.05 16.5 16.5 16.5H7.5C6.95 16.5 6.5 16.05 6.5 15.5V5.5ZM12 19.5C12.69 19.5 13.25 18.94 13.25 18.25C13.25 17.56 12.69 17 12 17C11.31 17 10.75 17.56 10.75 18.25C10.75 18.94 11.31 19.5 12 19.5Z"
    />
  </svg>
);

export const RealisticLayers = ({ className = 'w-5 h-5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 7L12 12L22 7L12 2Z" />
    <path d="M2 12L12 17L22 12L20 10.8L12 14.8L4 10.8L2 12Z" />
    <path d="M2 17L12 22L22 17L20 15.8L12 19.8L4 15.8L2 17Z" />
  </svg>
);

export default {
  RealisticWallet,
  RealisticCoins,
  RealisticBank,
  RealisticMobile,
  RealisticLayers,
};
