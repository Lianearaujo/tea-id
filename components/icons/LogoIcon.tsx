
import React from 'react';

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 120 105"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="TEA ID Logo"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="currentColor"
      d="M30,15 C40,5,50,15,60,15 H100 V55 C110,65,100,75,100,85 V95 H60 C50,105,40,95,30,95 V55 C20,45,30,35,30,25 V15 Z M47,40 H57 V80 H47 V40 Z M67,40 H82 C92,40 97,47.5 97,55 C97,62.5 92,70 82,70 H67 V40 Z M77,50 V60 H82 C87,60 87,50 82,50 H77 Z"
    />
  </svg>
);

export default LogoIcon;
