import { buildHomepageSchema } from "@/lib/marketing/schema";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function HomepageJsonLd() {
  return <JsonLd data={buildHomepageSchema()} />;
}
