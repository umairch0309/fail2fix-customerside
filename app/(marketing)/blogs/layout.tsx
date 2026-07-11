import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MOT Guides & Blog | Fail2Fix",
  description:
    "Practical advice on MOT failures, repairs, and getting back on the road — from the Fail2Fix team.",
};

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
