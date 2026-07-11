"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Phone } from "lucide-react";
import { BrandLogo } from "@/components/marketing/brand-logo";
import { PhoneLink } from "@/components/marketing/phone-link";
import { useQuoteEntry } from "@/components/marketing/quote-entry-context";
import { useSession, signOut } from "@/lib/auth-client";
import {
  PHONE_DISPLAY,
  PHONE_HOURS,
} from "@/lib/marketing/constants";
import { Button } from "../ui/button";

const Navbar = () => {
  const router = useRouter();
  const { openQuoteModal } = useQuoteEntry();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!session?.user;

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut({
      fetchOptions: {
        onSuccess: () => router.push("/"),
      },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-cream">
      <nav className="landing-container flex items-center justify-between gap-2 py-3.5 sm:gap-3 sm:py-[18px]">
        <BrandLogo className="min-w-0 shrink" size="header" />

        <PhoneLink
          source="navbar_desktop"
          className="hidden min-w-0 flex-col items-end text-right lg:flex"
        >
          <span className="flex items-center gap-1.5 font-semibold text-navy">
            <Phone className="h-4 w-4 shrink-0 text-amber" aria-hidden="true" />
            {PHONE_DISPLAY}
          </span>
          <span className="text-[0.72rem] text-landing-slate">{PHONE_HOURS}</span>
        </PhoneLink>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <PhoneLink
            source="navbar_mobile_compact"
            className="flex items-center gap-1 rounded-lg border border-navy/15 px-2.5 py-2 text-[0.78rem] font-semibold text-navy lg:hidden"
            aria-label={`Call ${PHONE_DISPLAY}`}
          >
            <Phone className="h-4 w-4 text-amber" aria-hidden="true" />
            <span className="hidden sm:inline">{PHONE_DISPLAY}</span>
          </PhoneLink>

          {!isLoggedIn ? (
            <>
              <Button
                onClick={() => router.push("/signup")}
                variant="ghost"
                className="hidden px-2 text-[0.92rem] text-landing-slate hover:text-navy md:inline-flex"
              >
                Sign up
              </Button>
              <Button
                onClick={() => router.push("/login")}
                variant="outline"
                className="hidden rounded-lg border-navy/20 px-3 text-[0.92rem] text-navy md:inline-flex"
              >
                Sign in
              </Button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleSignOut}
              className="hidden cursor-pointer px-2 text-[0.92rem] text-landing-slate hover:text-navy md:block"
            >
              Sign out
            </button>
          )}

          <button
            type="button"
            onClick={openQuoteModal}
            className="cursor-pointer rounded-lg bg-amber px-3 py-2 text-[0.8rem] font-semibold text-navy transition hover:-translate-y-px hover:bg-amber-dark sm:px-5 sm:py-2.5 sm:text-[0.92rem]"
          >
            <span className="sm:hidden">Check MOT</span>
            <span className="hidden sm:inline">Check my MOT</span>
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-navy/15 text-navy transition hover:bg-navy/5 md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-t border-line bg-cream transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="landing-container flex flex-col gap-2 py-4">
          <PhoneLink
            source="navbar_mobile_menu"
            className="flex flex-col rounded-lg border border-navy/15 bg-white px-4 py-3"
          >
            <span className="flex items-center gap-2 font-semibold text-navy">
              <Phone className="h-4 w-4 text-amber" aria-hidden="true" />
              {PHONE_DISPLAY}
            </span>
            <span className="mt-1 text-[0.82rem] text-landing-slate">
              {PHONE_HOURS}
            </span>
          </PhoneLink>

          {!isLoggedIn ? (
            <>
              <button
                type="button"
                onClick={() => goTo("/login")}
                className="w-full cursor-pointer rounded-lg border border-navy/20 px-4 py-3 text-center text-[0.95rem] font-semibold text-navy transition hover:bg-navy/5"
              >
                Sign in
              </button>
              <button
                type="button"
                onClick={() => goTo("/signup")}
                className="w-full cursor-pointer rounded-lg bg-navy px-4 py-3 text-center text-[0.95rem] font-semibold text-cream transition hover:bg-navy-light"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => goTo("/dashboard")}
                className="w-full cursor-pointer rounded-lg border border-navy/20 px-4 py-3 text-center text-[0.95rem] font-semibold text-navy transition hover:bg-navy/5"
              >
                Dashboard
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="w-full cursor-pointer rounded-lg bg-navy px-4 py-3 text-center text-[0.95rem] font-semibold text-cream transition hover:bg-navy-light"
              >
                Sign out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
