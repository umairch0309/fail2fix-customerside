import type { Metadata } from "next";
import localFont from "next/font/local";
import { Fraunces, JetBrains_Mono } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";
import "./globals.css";

const GA_TRACKING_ID = "AW-17942814872";

const interDisplay = localFont({
  src: [
    {
      path: "./fonts/interdisplay/InterDisplay-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-Italic.woff",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-MediumItalic.woff",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-SemiBold.woff",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-SemiBoldItalic.woff",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/interdisplay/InterDisplay-BoldItalic.woff",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-inter-display",
  display: "swap",
  preload: true,
});

const polysanstrial = localFont({
  src: [
    {
      path: "../public/fonts/polysans-trial/polysanstrial-slim.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/polysans-trial/polysansitalictrial-slimitalic.otf",
      weight: "300",
      style: "italic",
    },
    {
      path: "../public/fonts/polysans-trial/polysanstrial-neutral.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/polysans-trial/polysansitalictrial-neutralitalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/polysans-trial/polysanstrial-median.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/polysans-trial/polysansitalictrial-medianitalic.otf",
      weight: "600",
      style: "italic",
    },
    {
      path: "../public/fonts/polysans-trial/polysanstrial-bulky.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/polysans-trial/polysansitalictrial-bulkyitalic.otf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-polysanstrial",
  display: "swap",
  preload: true,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fail2fix.co.uk"),
  title: {
    default: "Fail2Fix — UK's Managed MOT Repair Service",
    template: "%s | Fail2Fix",
  },
  description:
    "Failed your MOT? Fail2Fix collects your vehicle, manages the repair, and returns it complete. Call 020 4541 4102.",
  keywords: [
    "MOT repairs",
    "managed MOT repair",
    "MOT failure",
    "MOT collection and delivery",
    "car repairs",
    "MOT retest",
    "Payment Assist MOT repair",
  ],
  icons: {
    icon: "/images/fail2fix-logo.png",
    apple: "/images/fail2fix-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${interDisplay.variable} ${polysanstrial.variable} ${fraunces.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `}
        </Script>
      </head>
      <body className="antialiased">
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
