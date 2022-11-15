import React from 'react';

/* eslint-disable-next-line */
export interface SpinnerProps {
  size: 'small' | 'medium' | 'large';
  variant: 'light' | 'dark';
  className?: string;
}

export const Spinner = (props: SpinnerProps) => {
  let sizeClassName = '';
  switch (props.size) {
    case 'small':
      sizeClassName = 'h-5 w-5';
      break;
    case 'medium':
      sizeClassName = 'h-8 w-8';
      break;
    case 'large':
      sizeClassName = 'h-12 w-12';
      break;
  }

  let variantClassName = '';
  switch (props.variant) {
    case 'light':
      variantClassName = 'text-white';
      break;
    case 'dark':
      variantClassName = 'text-black';
      break;
  }

  return (
    <svg
      className={`animate-spin ${variantClassName} ${sizeClassName} ${
        props.className || ''
      }`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx={12}
        cy={12}
        r={10}
        stroke="currentColor"
        strokeWidth={4}
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

Spinner.defaultProps = {
  variant: 'light',
  size: 'medium',
};
