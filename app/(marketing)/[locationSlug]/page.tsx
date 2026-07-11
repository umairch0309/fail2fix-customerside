import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocationPage } from "@/components/marketing/location-page";
import { SITE_URL } from "@/lib/marketing/constants";
import {
  getLocationPage,
  LOCATION_PAGES,
} from "@/lib/marketing/locations";

const LOCATION_PREFIX = "mot-repairs-";

interface PageProps {
  params: Promise<{ locationSlug: string }>;
}

function parseAreaSlug(locationSlug: string): string | null {
  if (!locationSlug.startsWith(LOCATION_PREFIX)) {
    return null;
  }

  return locationSlug.slice(LOCATION_PREFIX.length);
}

export async function generateStaticParams() {
  return LOCATION_PAGES.map(({ slug }) => ({
    locationSlug: `${LOCATION_PREFIX}${slug}`,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locationSlug } = await params;
  const area = parseAreaSlug(locationSlug);
  const page = area ? getLocationPage(area) : undefined;

  if (!page) {
    return {};
  }

  const url = `${SITE_URL}/${locationSlug}`;

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url,
      type: "website",
    },
  };
}

export default async function MotRepairsLocationPage({ params }: PageProps) {
  const { locationSlug } = await params;
  const area = parseAreaSlug(locationSlug);
  const page = area ? getLocationPage(area) : undefined;

  if (!page) {
    notFound();
  }

  return <LocationPage page={page} />;
}
