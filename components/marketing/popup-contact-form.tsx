"use client";
import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { Upload, X, ChevronsUpDownIcon, ArrowLeft, Check } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import CustomButton from "@/components/custombutton";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Field, FieldLabel } from "@/components/ui/field";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useVrmLookup, useSubmitSelection } from "@/hooks/use-vehicles";
import {
  hasRecentClientEnquiry,
  markClientEnquirySubmitted,
} from "@/lib/enquiry-submit-guard";
import {
  buildQuoteSignInUrl,
  savePendingQuote,
} from "@/lib/pending-quote";
import { useSession } from "@/lib/auth-client";
import { validateUkPostcode, isValidUkPostcode } from "@/lib/uk-postcode";
import type { VrmLookupResponse, MotDefectWithPricing } from "@/types/vehicle";
import { defectTypeConfig } from "@/types/vehicle";
import { toast } from "@/components/ui/sonner";

const getCountryName = (countryCode: string) => {
  try {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return regionNames.of(countryCode) || countryCode;
  } catch {
    return countryCode;
  }
};

interface PopupContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPostcode?: string;
  initialVrm?: string;
}

export function PopupContactForm({
  open,
  onOpenChange,
  initialPostcode = "",
  initialVrm = "",
}: PopupContactFormProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [phonePopoverOpen, setPhonePopoverOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step state: 1 = contact form, 2 = defect selection
  const [step, setStep] = useState<1 | 2>(1);
  const [defectsData, setDefectsData] = useState<VrmLookupResponse | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Success state
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState(
    "We've received your quote request and will get back to you shortly.",
  );
  const isSubmittingRef = useRef(false);

  const vrmLookup = useVrmLookup();
  const submitSelection = useSubmitSelection();
  const isBusy = vrmLookup.isPending || submitSelection.isPending;

  // Google Ads conversion tracking
  const trackConversion = useCallback(() => {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", {
        send_to: "AW-17942814872/R3-OCKH_h_kbEJjB5utC",
        value: 1.0,
        currency: "GBP",
      });
    }
  }, []);

  useEffect(() => {
    if (open) {
      form.setFieldValue("postcode", initialPostcode);
      form.setFieldValue("vrm", initialVrm);
    }
  }, [open, initialPostcode, initialVrm]);

  const countries = useMemo(() => {
    return getCountries().map((country) => {
      const callingCode = `+${getCountryCallingCode(country)}`;
      const name = getCountryName(country);
      return {
        value: country,
        label: name,
        callingCode,
        searchText: `${callingCode} ${name}`.toLowerCase(),
      };
    });
  }, []);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      selectedCountry: "GB",
      postcode: initialPostcode,
      vrm: initialVrm,
      notes: "",
      agreeTerms: false,
    },
    onSubmit: async ({ value }) => {
      if (vrmLookup.isPending) return;

      vrmLookup.mutate(value.vrm, {
        onSuccess: (data) => {
          setDefectsData(data);
          setSelectedIds(new Set());
          setStep(2);
        },
      });
    },
  });

  const toggleDefect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (!defectsData?.defects) return;
    if (selectedIds.size === defectsData.defects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(defectsData.defects.map((d) => d.id)));
    }
  };

  const handleSubmitSelection = () => {
    if (submitSelection.isPending || isSubmittingRef.current) return;
    if (!defectsData?.vehicle || selectedIds.size === 0) return;

    const formValues = form.state.values;

    if (!isValidUkPostcode(formValues.postcode)) {
      setStep(1);
      return;
    }

    if (hasRecentClientEnquiry(formValues.email, formValues.vrm)) {
      setSuccessMessage(
        "We already received your quote request. Our team will be in touch shortly.",
      );
      setSubmitted(true);
      return;
    }

    const selectedDefects = (defectsData.defects || []).filter((d) =>
      selectedIds.has(d.id),
    );
    const payload = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      vrm: formValues.vrm,
      postcode: formValues.postcode,
      selectedDefectIds: Array.from(selectedIds),
      selectedDefectTexts: selectedDefects.map((d) => d.text),
      notes: formValues.notes || undefined,
    };

    // Guest flow: save draft → Sign In → request is submitted after auth
    if (!session?.user) {
      savePendingQuote(payload);
      handleOpenChange(false);
      toast.info("Please sign in to submit your repair quote request.");
      router.push(buildQuoteSignInUrl(formValues.email));
      return;
    }

    isSubmittingRef.current = true;

    submitSelection.mutate(
      {
        name: session.user.name || formValues.name,
        email: session.user.email || formValues.email,
        phone: formValues.phone,
        vrm: formValues.vrm,
        postcode: formValues.postcode,
        selectedDefectIds: Array.from(selectedIds),
        notes: formValues.notes || undefined,
      },
      {
        onSuccess: (result) => {
          markClientEnquirySubmitted(formValues.email, formValues.vrm);
          trackConversion();
          setSuccessMessage(
            result.message ||
              "We've received your quote request and will get back to you shortly.",
          );
          setSubmitted(true);
        },
        onSettled: () => {
          isSubmittingRef.current = false;
        },
      },
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset state when closing
      setStep(1);
      setDefectsData(null);
      setSelectedIds(new Set());
      setSubmitted(false);
      setSuccessMessage(
        "We've received your quote request and will get back to you shortly.",
      );
      form.reset();
      setFiles([]);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="w-[95vw] md:w-[60vw] max-w-6xl max-h-[1200px] p-0 gap-0 bg-transparent border-none overflow-hidden"
      >
        <VisuallyHidden>
          <DialogTitle>
            {step === 1 ? "Contact Form" : "Select Repairs"}
          </DialogTitle>
        </VisuallyHidden>

        <div className="bg-white border border-[#F0F0F0] p-3 md:p-4 w-full rounded-[1.5rem] md:rounded-[30px] flex flex-col gap-3 overflow-hidden">
          {submitted ? (
            /* ── Success State ── */
            <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-[20px] px-4 py-12 md:py-16 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#ECFDF5] flex items-center justify-center">
                <Check className="w-8 h-8 text-[#10B981]" />
              </div>
              <div className="text-center">
                <h2 className="font-display text-[1.4rem] md:text-[1.6rem] text-[#0E1716] font-medium">
                  Request received!
                </h2>
                <p className="text-[#7F8282] text-[0.9rem] mt-2 max-w-md">
                  {successMessage}
                </p>
              </div>
              <CustomButton
                type="button"
                onClick={() => handleOpenChange(false)}
                normalColor="#ED5616"
                textColor="white"
                className="py-6 px-8 mt-2"
              >
                Done
              </CustomButton>
            </div>
          ) : step === 1 ? (
            /* ── Step 1: Contact Form ── */
            <>
              {/* Header */}
              <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-2xl px-4 py-4 flex items-start justify-between">
                <div className="flex flex-col gap-0.5">
                  <h1 className="font-display text-xl md:text-2xl text-[#0E1716] font-medium">
                    Vehicle details
                  </h1>
                  <p className="text-[#7F8282] text-sm">
                    Enter your vehicle details and get a quote
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleOpenChange(false)}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors -mt-1 -mr-1"
                  aria-label="Close dialog"
                >
                  <X className="w-5 h-5 text-[#0E1716]" />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  form.handleSubmit();
                }}
                className="flex flex-col gap-3"
              >
                {/* Scrollable content */}
                <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-2xl px-4 py-4 flex flex-col gap-5 overflow-y-auto max-h-[55vh] hide-scroll">
                  {/* Name and Email */}
                  <div className="flex max-sm:flex-col gap-3">
                    <form.Field
                      name="name"
                      validators={{
                        onBlur: ({ value }) => {
                          if (!value.trim()) return "Name is required";
                          if (value.trim().length < 2) return "Name must be at least 2 characters";
                          return undefined;
                        },
                      }}
                      children={(field) => (
                        <Field className="w-full flex flex-col gap-2">
                          <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                            Name
                          </FieldLabel>
                          <Input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="text"
                            placeholder="Your full name"
                            disabled={isBusy}
                            className={`rounded-[14px] py-6 bg-white w-full placeholder:text-[#ACACAC] placeholder:text-[0.9rem] focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30 ${
                              field.state.meta.errors.length > 0
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />

                    <form.Field
                      name="email"
                      validators={{
                        onBlur: ({ value }) => {
                          if (!value.trim()) return "Email is required";
                          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Please enter a valid email";
                          return undefined;
                        },
                      }}
                      children={(field) => (
                        <Field className="w-full flex flex-col gap-2">
                          <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                            Email
                          </FieldLabel>
                          <Input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            type="email"
                            placeholder="your.email@example.com"
                            disabled={isBusy}
                            className={`rounded-[14px] py-6 bg-white w-full placeholder:text-[#ACACAC] placeholder:text-[0.9rem] focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30 ${
                              field.state.meta.errors.length > 0
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  {/* Phone Number */}
                  <form.Field
                    name="phone"
                    validators={{
                      onBlur: ({ value }) => {
                        if (!value.trim()) return "Phone number is required";
                        if (value.length < 7) return "Please enter a valid phone number";
                        return undefined;
                      },
                    }}
                    children={(field) => (
                      <Field className="flex flex-col gap-2">
                        <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                          Phone Number
                        </FieldLabel>
                        <div className="flex gap-2">
                          <form.Field
                            name="selectedCountry"
                            children={(countryField) => (
                              <Popover
                                open={phonePopoverOpen}
                                onOpenChange={setPhonePopoverOpen}
                                modal={true}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={phonePopoverOpen}
                                    disabled={isBusy}
                                    className="w-28 h-12 justify-center rounded-xl"
                                  >
                                    {(() => {
                                      const selectedData = countries.find(
                                        (c) =>
                                          c.value === countryField.state.value,
                                      );
                                      return selectedData ? (
                                        <span className="flex items-center gap-1.5 flex-1">
                                          <ReactCountryFlag
                                            countryCode={selectedData.value}
                                            svg
                                            style={{
                                              width: "1.25em",
                                              height: "1.25em",
                                              borderRadius: "0.4rem",
                                            }}
                                          />
                                          <span>
                                            {selectedData.callingCode}
                                          </span>
                                        </span>
                                      ) : (
                                        <span className="flex-1">Select</span>
                                      );
                                    })()}
                                    <ChevronsUpDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-[300px] p-0"
                                  align="start"
                                >
                                  <Command>
                                    <CommandInput placeholder="Search country..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        No country found.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {countries.map((country) => (
                                          <CommandItem
                                            key={country.value}
                                            value={country.searchText}
                                            onSelect={() => {
                                              countryField.handleChange(
                                                country.value,
                                              );
                                              setPhonePopoverOpen(false);
                                            }}
                                          >
                                            <span className="flex items-center justify-start gap-2.5">
                                              <ReactCountryFlag
                                                countryCode={country.value}
                                                svg
                                                style={{
                                                  width: "1.5em",
                                                  height: "1.5em",
                                                  borderRadius: "0.45rem",
                                                }}
                                              />
                                              <span className="font-semibold min-w-12">
                                                {country.callingCode}
                                              </span>
                                              <span className="text-muted-foreground">
                                                {country.label}
                                              </span>
                                            </span>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            )}
                          />
                          <Input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => {
                              const value = e.target.value.replace(/\D/g, "");
                              field.handleChange(value);
                            }}
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            placeholder="1234567890"
                            disabled={isBusy}
                            className={`rounded-[14px] py-6 bg-white flex-1 placeholder:text-[#ACACAC] placeholder:text-[0.9rem] focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30 ${
                              field.state.meta.errors.length > 0
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                        )}
                      </Field>
                    )}
                  />

                  {/* Postcode and VRM */}
                  <div className="flex max-sm:flex-col gap-3">
                    <form.Field
                      name="postcode"
                      validators={{
                        onBlur: ({ value }) => validateUkPostcode(value),
                        onChange: ({ value }) => {
                          // Only show format errors once user has typed enough
                          if (value.trim().length < 5) return undefined;
                          return validateUkPostcode(value);
                        },
                      }}
                      children={(field) => (
                        <Field className="w-full flex flex-col gap-2">
                          <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                            Postcode
                          </FieldLabel>
                          <Input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value.toUpperCase())
                            }
                            type="text"
                            placeholder="SW1A 1AA"
                            maxLength={10}
                            autoComplete="postal-code"
                            disabled={isBusy}
                            className={`rounded-[14px] py-6 bg-white w-full placeholder:text-[#ACACAC] placeholder:text-[0.9rem] focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30 ${
                              field.state.meta.errors.length > 0
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />

                    <form.Field
                      name="vrm"
                      validators={{
                        onBlur: ({ value }) => {
                          if (!value.trim()) return "Vehicle registration is required";
                          if (value.trim().length < 2) return "Please enter a valid registration";
                          return undefined;
                        },
                      }}
                      children={(field) => (
                        <Field className="w-full flex flex-col gap-2">
                          <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                            Vehicle Registration (VRM)
                          </FieldLabel>
                          <Input
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) =>
                              field.handleChange(e.target.value.toUpperCase())
                            }
                            type="text"
                            placeholder="AB12 CDE"
                            disabled={isBusy}
                            className={`rounded-[14px] py-6 bg-white w-full placeholder:text-[#ACACAC] placeholder:text-[0.9rem] focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30 ${
                              field.state.meta.errors.length > 0
                                ? "border-red-400 focus:border-red-400"
                                : "border-gray-300"
                            }`}
                          />
                          {field.state.meta.errors.length > 0 && (
                            <p className="text-red-500 text-xs">{field.state.meta.errors[0]}</p>
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  {/* File Upload */}
                  <div className=" flex flex-col gap-2.5">
                    <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                      Upload Files (Optional)
                    </FieldLabel>
                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => {
                        if (!isBusy) fileInputRef.current?.click();
                      }}
                      className={`border-2 border-dashed border-gray-300 rounded-xl p-6 bg-white transition-colors ${
                        isBusy
                          ? "opacity-60 cursor-not-allowed"
                          : "cursor-pointer hover:border-[#FF8E5E] focus-within:border-[#FF8E5E]"
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <div className="flex flex-col items-center gap-2 text-center">
                        <Upload className="w-8 h-8 text-gray-400" />
                        <p className="text-[#7F8282] text-[0.9rem]">
                          Drag & drop files here or click to browse
                        </p>
                        <p className="text-[#ACACAC] text-[0.8rem]">
                          Supports images, PDF, DOC files
                        </p>
                      </div>
                    </div>
                    {files.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {files.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2"
                          >
                            <span className="text-[0.85rem] text-[#211E25] truncate max-w-[150px]">
                              {file.name}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Extra Notes */}
                  <form.Field
                    name="notes"
                    children={(field) => (
                      <Field className=" flex flex-col gap-2.5">
                        <FieldLabel className="text-[#211E25] text-[0.95rem] font-medium">
                          Extra Notes (Optional)
                        </FieldLabel>
                        <Textarea
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Any additional information you'd like to share..."
                          disabled={isBusy}
                          className="rounded-xl py-3 bg-white border-gray-300 w-full min-h-[120px] placeholder:text-[#ACACAC] placeholder:text-[0.9rem] resize-none focus:border-[#FF8E5E]/60 focus-visible:ring-[#FF8E5E]/30"
                        />
                      </Field>
                    )}
                  />

                  {/* Terms */}
                  <div className="">
                    <form.Field
                      name="agreeTerms"
                      children={(field) => (
                        <Field>
                          <div className="flex gap-3 items-start">
                            <button
                              type="button"
                              disabled={isBusy}
                              onClick={() =>
                                field.handleChange(!field.state.value)
                              }
                              className="shrink-0 mt-0.5 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8E5E]/50 focus-visible:ring-offset-2"
                              role="checkbox"
                              aria-checked={field.state.value}
                              aria-required="true"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 26 26"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <motion.path
                                  transition={{
                                    ease: [0.215, 0.61, 0.355, 1],
                                    duration: 0.4,
                                    delay: field.state.value ? 0.2 : 0,
                                  }}
                                  initial={{
                                    opacity: field.state.value ? 1 : 0,
                                    scale: field.state.value ? 1 : 0.5,
                                  }}
                                  animate={{
                                    opacity: field.state.value ? 1 : 0,
                                    scale: field.state.value ? 1 : 0.5,
                                  }}
                                  d="M1 13C1 7.34315 1 4.51472 2.75736 2.75736C4.51472 1 7.34315 1 13 1C18.6569 1 21.4853 1 23.2426 2.75736C25 4.51472 25 7.34315 25 13C25 18.6569 25 21.4853 23.2426 23.2426C21.4853 25 18.6569 25 13 25C7.34315 25 4.51472 25 2.75736 23.2426C1 21.4853 1 18.6569 1 13Z"
                                  fill="#FF8E5E"
                                />
                                <motion.path
                                  transition={{
                                    ease: [0.215, 0.61, 0.355, 1],
                                    duration: 0.4,
                                    delay: field.state.value ? 0.2 : 0,
                                  }}
                                  initial={{
                                    clipPath: field.state.value
                                      ? "inset(0% 0% 0% 0%)"
                                      : "inset(0% 100% 0% 0%)",
                                  }}
                                  animate={{
                                    clipPath: field.state.value
                                      ? "inset(0% 0% 0% 0%)"
                                      : "inset(0% 100% 0% 0%)",
                                  }}
                                  d="M19.2574 8.9732L11.5035 18.204C11.4185 18.3053 11.3126 18.3871 11.1932 18.444C11.0737 18.5008 10.9435 18.5313 10.8112 18.5334H10.7956C10.6663 18.5333 10.5383 18.5061 10.4202 18.4534C10.302 18.4007 10.1962 18.3238 10.1097 18.2276L6.7866 14.5353C6.70221 14.4458 6.63656 14.3403 6.59351 14.2251C6.55046 14.1098 6.53089 13.9871 6.53593 13.8642C6.54098 13.7413 6.57054 13.6206 6.62289 13.5093C6.67524 13.398 6.74931 13.2982 6.84076 13.2159C6.93221 13.1336 7.03918 13.0705 7.15539 13.0301C7.27161 12.9897 7.39472 12.973 7.51749 12.9809C7.64026 12.9888 7.76021 13.0212 7.87029 13.0761C7.98038 13.131 8.07838 13.2074 8.15853 13.3007L10.7714 16.2038L17.8439 7.78589C18.0026 7.60248 18.227 7.48886 18.4687 7.4696C18.7105 7.45033 18.9501 7.52697 19.1358 7.68295C19.3215 7.83893 19.4383 8.06171 19.4611 8.30315C19.4838 8.54459 19.4107 8.78528 19.2574 8.9732Z"
                                  fill="white"
                                />
                                <motion.path
                                  strokeWidth={2}
                                  transition={{
                                    ease: [0.215, 0.61, 0.355, 1],
                                    duration: 0.4,
                                    delay: field.state.value ? 0 : 0.2,
                                  }}
                                  initial={{
                                    pathLength: field.state.value ? 0 : 1,
                                    strokeOpacity: field.state.value
                                      ? [1, 1, 0]
                                      : [0, 1, 1, 1],
                                  }}
                                  animate={{
                                    pathLength: field.state.value ? 0 : 1,
                                    strokeOpacity: field.state.value
                                      ? [1, 1, 0]
                                      : [0, 1, 1, 1],
                                  }}
                                  d="M22.8891 22.889C22.1189 23.6593 21.0955 24.0726 19.517 24.2848C17.9242 24.4989 15.8426 24.5 13 24.5C10.1574 24.5 8.07582 24.4989 6.483 24.2848C4.90456 24.0726 3.88121 23.6594 3.11092 22.889C2.34063 22.1188 1.92743 21.0955 1.71521 19.517C1.50106 17.9242 1.5 15.8426 1.5 13C1.5 10.1574 1.50106 8.07582 1.71521 6.483C1.92743 4.90456 2.34062 3.88121 3.11091 3.11091C3.88121 2.34062 4.90456 1.92743 6.483 1.71521C8.07582 1.50106 10.1574 1.5 13 1.5C15.8426 1.5 17.9242 1.50106 19.517 1.71521C21.0955 1.92743 22.1188 2.34062 22.889 3.11091C23.6594 3.8812 24.0726 4.90456 24.2848 6.483C24.4989 8.07582 24.5 10.1574 24.5 13C24.5 15.8426 24.4989 17.9242 24.2848 19.517C24.0726 21.0955 23.6594 22.1188 22.8891 22.889Z"
                                  className="stroke-gray-400"
                                />
                              </svg>
                            </button>
                            <FieldLabel
                              htmlFor="agreeTerms"
                              className="text-[#69757A] text-[0.95rem] leading-relaxed font-normal cursor-pointer"
                              onClick={() =>
                                field.handleChange(!field.state.value)
                              }
                            >
                              I authorize Fail2Fix and its representatives to
                              contact me via phone, email, or SMS to provide
                              quotations for MOT fail vehicle repair services.
                            </FieldLabel>
                          </div>
                        </Field>
                      )}
                    />
                  </div>
                </div>

                {/* Continue button */}
                <form.Subscribe
                  selector={(state) => [state.canSubmit, state.values]}
                  children={([canSubmit, values]) => {
                    const allFieldsFilled =
                      typeof values !== "boolean" &&
                      values.name.trim() !== "" &&
                      values.email.trim() !== "" &&
                      values.phone.trim() !== "" &&
                      isValidUkPostcode(values.postcode) &&
                      values.vrm.trim() !== "" &&
                      values.agreeTerms === true;

                    return (
                      <CustomButton
                        type="submit"
                        fullWidth
                        normalColor="#ED5616"
                        textColor="white"
                        className="py-6"
                        disabled={
                          !allFieldsFilled ||
                          !canSubmit ||
                          vrmLookup.isPending
                        }
                        loading={vrmLookup.isPending}
                        loadingText="Looking up vehicle..."
                      >
                        Continue
                      </CustomButton>
                    );
                  }}
                />
              </form>
            </>
          ) : (
            /* ── Step 2: Defect Selection ── */
            <>
              {/* Header with vehicle info */}
              <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-2xl px-4 py-4 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="p-1.5 hover:bg-white/60 rounded-lg transition-colors -ml-1"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-[#0E1716]" />
                </button>
                <div className="flex flex-col gap-0.5">
                  <h1 className="font-display text-xl md:text-2xl text-[#0E1716] font-medium">
                    Select repairs
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm text-[#7F8282]">
                    <span className="font-medium text-[#0E1716]">
                      {defectsData?.vehicle.vrm}
                    </span>
                    {defectsData?.vehicle.make && (
                      <span>• {defectsData.vehicle.make}</span>
                    )}
                    {defectsData?.vehicle.model && (
                      <span>{defectsData.vehicle.model}</span>
                    )}
                    {defectsData?.vehicle.primaryColour && (
                      <span className="capitalize">
                        • {defectsData.vehicle.primaryColour.toLowerCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Defects List */}
              <div className="bg-[#F6F6F6] border border-[#e9e9e9] rounded-2xl px-4 py-4 flex flex-col gap-4 overflow-y-auto max-h-[45vh] hide-scroll">
                {defectsData?.defects && defectsData.defects.length > 0 ? (
                  <>
                    {/* Selection Controls */}
                    <div className="flex items-center justify-between">
                      <p className="text-[#7F8282] text-sm">
                        {selectedIds.size} of {defectsData.defects.length} selected
                      </p>
                      <button
                        type="button"
                        onClick={toggleAll}
                        className="text-[#FF8E5E] text-sm font-medium hover:underline"
                      >
                        {selectedIds.size === defectsData.defects.length
                          ? "Deselect all"
                          : "Select all"}
                      </button>
                    </div>

                    {/* Defect Items */}
                    <div className="flex flex-col gap-2">
                      {defectsData.defects.map((defect) => (
                        <SelectableDefectItem
                          key={defect.id}
                          defect={defect}
                          selected={selectedIds.has(defect.id)}
                          onToggle={() => toggleDefect(defect.id)}
                        />
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 gap-3">
                    <p className="text-[#7F8282] text-sm text-center">
                      No defects found for this vehicle&apos;s latest MOT test.
                    </p>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-[#FF8E5E] text-sm font-medium hover:underline"
                    >
                      Go back
                    </button>
                  </div>
                )}
              </div>

              {/* Validation message for Step 2 */}
              {defectsData?.defects && defectsData.defects.length > 0 && selectedIds.size === 0 && (
                <p className="text-red-500 text-sm text-center">
                  Please select at least one defect to continue
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <CustomButton
                  type="button"
                  onClick={() => setStep(1)}
                  normalColor="#E5E5E5"
                  textColor="#0E1716"
                  className="py-6 flex-1"
                  disabled={submitSelection.isPending}
                >
                  Back
                </CustomButton>
                <CustomButton
                  type="button"
                  onClick={handleSubmitSelection}
                  normalColor="#ED5616"
                  textColor="white"
                  className="py-6 flex-[2]"
                  disabled={selectedIds.size === 0 || submitSelection.isPending}
                  loading={submitSelection.isPending}
                  loadingText="Submitting..."
                >
                  Submit Request
                </CustomButton>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Selectable defect item
 */
function SelectableDefectItem({
  defect,
  selected,
  onToggle,
}: {
  defect: MotDefectWithPricing;
  selected: boolean;
  onToggle: () => void;
}) {
  const config = defectTypeConfig[defect.type] || defectTypeConfig.ADVISORY;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={selected}
      className={`w-full text-left flex items-start gap-3 p-3 border rounded-xl transition-all ${
        selected
          ? "border-[#FF8E5E] bg-[#FFF8F5]"
          : "border-[#e9e9e9] bg-white hover:border-[#d1d1d1]"
      }`}
    >
      {/* Checkbox */}
      <div
        className={`w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-colors mt-0.5 ${
          selected
            ? "bg-[#FF8E5E] border-[#FF8E5E]"
            : "bg-white border-[#D1D5DB]"
        }`}
        aria-hidden="true"
      >
        {selected && (
          <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
            <path
              d="M2 6l3 3 5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Defect description */}
        <p className="text-sm text-[#0E1716] leading-snug">
          {defect.text}
        </p>
        {/* Badge */}
        <span
          className="inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-2"
          style={{
            color: config.color,
            backgroundColor: config.bgColor,
          }}
        >
          {config.label}
        </span>
      </div>
    </button>
  );
}
