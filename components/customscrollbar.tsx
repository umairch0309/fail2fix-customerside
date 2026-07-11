"use client";
import React, { useEffect, useState, useCallback, useRef } from "react";

interface CustomScrollbarProps {
  scrollElement: HTMLElement | null;
  className?: string;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({
  scrollElement,
  className = "",
}) => {
  const [thumbSize, setThumbSize] = useState(0);
  const [thumbPosition, setThumbPosition] = useState(0);
  const [showScrollbar, setShowScrollbar] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startDragX = useRef(0);
  const startScrollLeft = useRef(0);

  const updateScrollbar = useCallback(() => {
    if (!scrollElement) return;

    const { scrollWidth, clientWidth, scrollLeft } = scrollElement;
    const scrollable = scrollWidth > clientWidth;

    setShowScrollbar(scrollable);

    if (scrollable) {
      const thumbWidth = Math.max((clientWidth / scrollWidth) * 100, 5);
      const scrollPercentage = scrollLeft / (scrollWidth - clientWidth);
      const maxThumbPosition = 100 - thumbWidth;

      setThumbSize(thumbWidth);
      setThumbPosition(scrollPercentage * maxThumbPosition);
    }
  }, [scrollElement]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!scrollElement || !trackRef.current) return;

      setIsDragging(true);
      startDragX.current = e.clientX;
      startScrollLeft.current = scrollElement.scrollLeft;

      e.preventDefault();
    },
    [scrollElement],
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !scrollElement || !trackRef.current) return;

      const deltaX = e.clientX - startDragX.current;
      const trackWidth = trackRef.current.offsetWidth;
      const scrollWidth = scrollElement.scrollWidth;
      const clientWidth = scrollElement.clientWidth;

      const scrollDelta = (deltaX / trackWidth) * scrollWidth;
      const newScrollLeft = Math.max(
        0,
        Math.min(
          scrollWidth - clientWidth,
          startScrollLeft.current + scrollDelta,
        ),
      );

      scrollElement.scrollLeft = newScrollLeft;
    },
    [isDragging, scrollElement],
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTrackClick = useCallback(
    (e: React.MouseEvent) => {
      if (
        !scrollElement ||
        !trackRef.current ||
        e.target === e.currentTarget.querySelector(".scrollbar-thumb")
      )
        return;

      const trackRect = trackRef.current.getBoundingClientRect();
      const clickX = e.clientX - trackRect.left;
      const trackWidth = trackRect.width;
      const scrollWidth = scrollElement.scrollWidth;
      const clientWidth = scrollElement.clientWidth;

      const scrollPercentage = clickX / trackWidth;
      const newScrollLeft = scrollPercentage * (scrollWidth - clientWidth);

      scrollElement.scrollLeft = Math.max(
        0,
        Math.min(scrollWidth - clientWidth, newScrollLeft),
      );
    },
    [scrollElement],
  );

  useEffect(() => {
    if (!scrollElement) return;

    const handleScroll = () => updateScrollbar();
    const handleResize = () => updateScrollbar();

    scrollElement.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    updateScrollbar();

    return () => {
      scrollElement.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [scrollElement, updateScrollbar]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!showScrollbar) return null;

  return (
    <div
      className={`absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-[250px] h-1 z-100 ${className}`}
    >
      <div
        ref={trackRef}
        className="relative w-full h-full bg-gray-300 rounded-full cursor-pointer"
        onClick={handleTrackClick}
      >
        <div
          className={`scrollbar-thumb absolute h-full bg-gray-700/40 rounded-full transition-colors hover:bg-gray-600/80 cursor-grab ${
            isDragging ? "cursor-grabbing bg-gray-600/90" : ""
          }`}
          style={{
            width: `${thumbSize}%`,
            left: `${thumbPosition}%`,
          }}
          onMouseDown={handleMouseDown}
        />
      </div>
    </div>
  );
};

export default CustomScrollbar;
