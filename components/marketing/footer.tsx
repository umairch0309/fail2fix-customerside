import Link from "next/link";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { PhoneLink } from "@/components/marketing/phone-link";
import {
  PHONE_DISPLAY,
  PHONE_HOURS,
} from "@/lib/marketing/constants";
import { getLocationUrl, LOCATION_PAGES } from "@/lib/marketing/locations";

const marketingLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/services", label: "Services" },
  { href: "/howitworks", label: "How It Works" },
  { href: "/contact", label: "Contact" },
  { href: "/blogs", label: "Blogs" },
];

const Footer = () => {
  return (
    <footer className="bg-navy pt-10 pb-6 text-cream/70 sm:pt-14 sm:pb-8">
      <div className="landing-container">
        <div className="grid gap-8 border-b border-cream/12 pb-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="sm:col-span-2 lg:col-span-1">
            <BrandLogo light size="footer" />
            <p className="mt-3.5 max-w-[280px] text-[0.85rem] sm:text-[0.88rem]">
              The UK&apos;s #1 managed MOT repair service — collection, repair
              management, and return. No hassle.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-inter text-[0.8rem] tracking-[0.06em] text-cream uppercase sm:mb-3.5 sm:text-[0.82rem]">
              Contact
            </h4>
            <ul className="space-y-2 text-[0.88rem] sm:text-[0.9rem]">
              <li>
                <PhoneLink source="footer" className="hover:text-cream">
                  {PHONE_DISPLAY}
                </PhoneLink>
              </li>
              <li className="text-cream/60">{PHONE_HOURS}</li>
              <li>
                <a
                  href="mailto:support@fail2fix.co.uk"
                  className="break-all hover:text-cream sm:break-normal"
                >
                  support@fail2fix.co.uk
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-inter text-[0.8rem] tracking-[0.06em] text-cream uppercase sm:mb-3.5 sm:text-[0.82rem]">
              Legal
            </h4>
            <ul className="space-y-2 text-[0.88rem] sm:text-[0.9rem]">
              <li>
                <Link href="/privacypolicy" className="hover:text-cream">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/termsofservice" className="hover:text-cream">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookiepolicy" className="hover:text-cream">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-inter text-[0.8rem] tracking-[0.06em] text-cream uppercase sm:mb-3.5 sm:text-[0.82rem]">
              MOT Repairs
            </h4>
            <ul className="space-y-2 text-[0.88rem] sm:text-[0.9rem]">
              {LOCATION_PAGES.map((location) => (
                <li key={location.slug}>
                  <Link
                    href={getLocationUrl(location.slug)}
                    className="hover:text-cream"
                  >
                    {location.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="mb-3 font-inter text-[0.8rem] tracking-[0.06em] text-cream uppercase sm:mb-3.5 sm:text-[0.82rem]">
              Pages
            </h4>
            <ul className="space-y-2 text-[0.88rem] sm:text-[0.9rem]">
              {marketingLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="transition-colors duration-200 hover:text-amber"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-2 pt-5 text-center text-[0.78rem] sm:flex-row sm:pt-6 sm:text-left sm:text-[0.82rem]">
          <span>© 2026 Fail2Fix. All rights reserved.</span>
          <span>Made for drivers, not dealerships.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
