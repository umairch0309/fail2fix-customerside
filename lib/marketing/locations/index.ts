import { LOCATION_PAGES } from "./pages";
import type { LocationPageData } from "./types";

export const LOCATION_PAGE_MAP: Record<string, LocationPageData> =
  Object.fromEntries(LOCATION_PAGES.map((page) => [page.slug, page]));

export function getLocationPage(slug: string): LocationPageData | undefined {
  return LOCATION_PAGE_MAP[slug];
}

export function getLocationUrl(slug: string): string {
  return `/mot-repairs-${slug}`;
}

export function hasLocationPage(slug: string): boolean {
  return slug in LOCATION_PAGE_MAP;
}

export * from "./pages";
export * from "./shared";
export * from "./types";
