import { JsonLd } from "@/components/marketing/json-ld";
import { LocationPageClient } from "@/components/marketing/location-page-client";
import { buildLocationPageSchema } from "@/lib/marketing/location-schema";
import type { LocationPageData } from "@/lib/marketing/locations/types";

interface LocationPageProps {
  page: LocationPageData;
}

export function LocationPage({ page }: LocationPageProps) {
  const schema = buildLocationPageSchema(page);

  return (
    <>
      {schema.map((data, index) => (
        <JsonLd key={index} data={data} />
      ))}
      <LocationPageClient page={page} />
    </>
  );
}
