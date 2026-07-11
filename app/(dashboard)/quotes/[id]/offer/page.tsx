import { redirect } from "next/navigation";

interface QuoteOfferRedirectProps {
  params: Promise<{ id: string }>;
}

export default async function QuoteOfferRedirectPage({
  params,
}: QuoteOfferRedirectProps) {
  const { id } = await params;
  redirect(`/quotes/${id}`);
}
