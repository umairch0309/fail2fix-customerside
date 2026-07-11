"use client";

import { useState } from "react";
import { motion } from "motion/react";

interface ThreeDotsProps {
  className?: string;
  onClick?: () => void;
}

export default function ThreeDots({ className = "", onClick }: ThreeDotsProps) {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    onClick?.();
    setTimeout(() => setIsClicked(false), 800);
  };

  const dotVariants = {
    idle: { scale: 1, y: 0 },
    clicked: { scale: [1, 1.2, 1], y: [0, -4, 0] },
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { scale: 1.1 },
    tap: { scale: 0.95 },
  };

  return (
    <motion.button
      onClick={handleClick}
      className={className}
      variants={buttonVariants}
      initial="idle"
      whileHover="hover"
      whileTap="tap"
      transition={{ duration: 0.2 }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <motion.circle
          cx="4"
          cy="10"
          r="1.5"
          fill="currentColor"
          variants={dotVariants}
          animate={isClicked ? "clicked" : "idle"}
          transition={{ delay: 0 }}
        />
        <motion.circle
          cx="10"
          cy="10"
          r="1.5"
          fill="currentColor"
          variants={dotVariants}
          animate={isClicked ? "clicked" : "idle"}
          transition={{ delay: 0.1 }}
        />
        <motion.circle
          cx="16"
          cy="10"
          r="1.5"
          fill="currentColor"
          variants={dotVariants}
          animate={isClicked ? "clicked" : "idle"}
          transition={{ delay: 0.2 }}
        />
      </svg>
    </motion.button>
  );
}
