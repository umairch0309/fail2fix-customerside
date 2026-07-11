import React from "react";

interface ScrolliconProps {
  size?: number;
  color?: string;
}

const Scrollicon: React.FC<ScrolliconProps> = ({ size = 28, color = "black" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M27 27L13.5 54H0V40.5L27 27Z" fill={color} />
      <path d="M33.75 54H20.25L27 27L33.75 54Z" fill={color} />
      <path d="M54 40.5V54H40.5L27 27L54 40.5Z" fill={color} />
      <path d="M27 27L13.5 0H0V13.5L27 27Z" fill={color} />
      <path d="M33.75 0H20.25L27 27L33.75 0Z" fill={color} />
      <path d="M54 20.25V33.75L27 27L54 20.25Z" fill={color} />
      <path d="M0 20.25V33.75L27 27L0 20.25Z" fill={color} />
      <path d="M54 13.5V0H40.5L27 27L54 13.5Z" fill={color} />
    </svg>
  );
};

export default Scrollicon;
