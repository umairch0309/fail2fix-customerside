"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { PopupContactForm } from "@/components/marketing/popup-contact-form";

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
  const [postcode, setPostcode] = useState("");
  const [vrm, setVrm] = useState("");

  const openQuoteModal = useCallback(() => {
    setIsQuoteModalOpen(true);
  }, []);

  return (
    <QuoteEntryContext.Provider
      value={{ vrm, setVrm, postcode, setPostcode, openQuoteModal }}
    >
      {children}
      <PopupContactForm
        open={isQuoteModalOpen}
        onOpenChange={setIsQuoteModalOpen}
        initialPostcode={postcode}
        initialVrm={vrm}
      />
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
