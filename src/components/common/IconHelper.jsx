import React from 'react';
import * as Icons from 'lucide-react';

export const IconHelper = ({ name, emoji, className = 'w-5 h-5', ...props }) => {
  if (emoji) {
    return <span className={`inline-flex items-center justify-center leading-none select-none ${className}`} {...props}>{emoji}</span>;
  }
  const IconComponent = Icons[name] || Icons.CircleDollarSign;
  return <IconComponent className={className} {...props} />;
};

export default IconHelper;
