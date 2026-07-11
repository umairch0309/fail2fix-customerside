"use client";
import React, { useState } from "react";

import CustomScrollbar from "./customscrollbar";
import { useDragScroll } from "../hooks/useDrag";

interface DragScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  scrollSpeed?: number;
  gap?: string;
  draggingGap?: string;
  showScrollbar?: boolean;
  scrollbarClassName?: string;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

const DragScrollContainer: React.FC<DragScrollContainerProps> = ({
  children,
  className = "",
  scrollSpeed = 1,
  gap = "gap-4",
  draggingGap = "gap-6",
  showScrollbar = true,
  scrollbarClassName = "",
  onDragStart,
  onDragEnd,
}) => {
  const { dragRef, setScrollElement, isDragging } = useDragScroll(scrollSpeed);
  const [scrollElement, setScrollElementState] = useState<HTMLElement | null>(
    null
  );

  React.useEffect(() => {
    if (isDragging && onDragStart) {
      onDragStart();
    } else if (!isDragging && onDragEnd) {
      onDragEnd();
    }
  }, [isDragging, onDragStart, onDragEnd]);

  return (
    <div className="relative">
      <div
        ref={(el) => {
          dragRef.current = el;
          setScrollElement(el);
          setScrollElementState(el);
        }}
        className={`flex ${
          isDragging ? draggingGap : gap
        } overflow-x-auto overflow-y-hidden  transition-all ease-in-out duration-700 ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        } ${className}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {children}
      </div>
      {showScrollbar && (
        <CustomScrollbar
          scrollElement={scrollElement}
          className={scrollbarClassName}
        />
      )}
      <style jsx>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DragScrollContainer;
