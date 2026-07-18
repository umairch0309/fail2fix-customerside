"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";

const PopupContactForm = dynamic(
  () =>
    import("@/components/marketing/popup-contact-form").then((mod) => ({
      default: mod.PopupContactForm,
    })),
  { ssr: false },
);

interface QuoteEntryContextValue {
  vrm: string;
  setVrm: (vrm: string) => void;
  postcode: string;
  setPostcode: (postcode: string) => void;
  openQuoteModal: () => void;
}

const QuoteEntryContext = createContext<QuoteEntryContextValue | null>(null);

export function QuoteEntryProvider({ children }: { children: ReactNode }) {
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [hasOpenedQuoteModal, setHasOpenedQuoteModal] = useState(false);
  const [postcode, setPostcode] = useState("");
  const [vrm, setVrm] = useState("");

  const openQuoteModal = useCallback(() => {
    setHasOpenedQuoteModal(true);
    setIsQuoteModalOpen(true);
  }, []);

  return (
    <QuoteEntryContext.Provider
      value={{ vrm, setVrm, postcode, setPostcode, openQuoteModal }}
    >
      {children}
      {hasOpenedQuoteModal ? (
        <PopupContactForm
          open={isQuoteModalOpen}
          onOpenChange={setIsQuoteModalOpen}
          initialPostcode={postcode}
          initialVrm={vrm}
        />
      ) : null}
    </QuoteEntryContext.Provider>
  );
}

export function useQuoteEntry() {
  const context = useContext(QuoteEntryContext);
  if (!context) {
    throw new Error("useQuoteEntry must be used within QuoteEntryProvider");
  }
  return context;
}
