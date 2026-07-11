import { ReactNode } from "react";

/**
 * Hook Types for Student App
 */

/**
 * Options for useDrag hook
 */
export interface UseDragOptions {
  onDragStart?: (e: MouseEvent) => void;
  onDragMove?: (e: MouseEvent, deltaX: number, deltaY: number) => void;
  onDragEnd?: (e: MouseEvent) => void;
  disabled?: boolean;
}

/**
 * Options for usePageHeader hook
 */
export interface UsePageHeaderOptions {
  title?: string;
  actions?: ReactNode;
  showNotifications?: boolean;
  showApplyButton?: boolean;
}
