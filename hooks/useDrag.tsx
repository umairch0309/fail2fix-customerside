import { useRef, useEffect, useCallback, useState } from "react";
import type { UseDragOptions } from "../types/hooks";

export const useDrag = (options: UseDragOptions = {}) => {
  const { onDragStart, onDragMove, onDragEnd, disabled = false } = options;

  const [isDragging, setIsDragging] = useState(false);
  const startPosition = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement | null>(null);

  const handleMouseDown = useCallback(
    (e: MouseEvent) => {
      if (disabled) return;

      setIsDragging(true);
      startPosition.current = { x: e.clientX, y: e.clientY };

      onDragStart?.(e);

      e.preventDefault();
    },
    [disabled, onDragStart]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || disabled) return;

      const deltaX = e.clientX - startPosition.current.x;
      const deltaY = e.clientY - startPosition.current.y;

      onDragMove?.(e, deltaX, deltaY);
    },
    [disabled, onDragMove, isDragging]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      setIsDragging(false);
      onDragEnd?.(e);
    },
    [onDragEnd, isDragging]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    element.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseUp);

    return () => {
      element.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp, disabled]);

  return {
    ref: elementRef,
    isDragging: isDragging,
  };
};

export const useDragScroll = (scrollSpeed: number = 1) => {
  const scrollElementRef = useRef<HTMLElement | null>(null);
  const lastPositionRef = useRef({ x: 0, y: 0 });

  const { ref, isDragging } = useDrag({
    onDragStart: (e) => {
      lastPositionRef.current = { x: e.clientX, y: e.clientY };
    },
    onDragMove: (e) => {
      if (scrollElementRef.current) {
        const deltaX = lastPositionRef.current.x - e.clientX;
        const deltaY = lastPositionRef.current.y - e.clientY;

        scrollElementRef.current.scrollLeft += deltaX * scrollSpeed;
        scrollElementRef.current.scrollTop += deltaY * scrollSpeed;

        lastPositionRef.current = { x: e.clientX, y: e.clientY };
      }
    },
    onDragEnd: () => {
      // No need to manage separate isDragging state
    },
  });

  const setScrollElement = useCallback((element: HTMLElement | null) => {
    scrollElementRef.current = element;
  }, []);

  return {
    dragRef: ref,
    setScrollElement,
    isDragging: isDragging,
  };
};
