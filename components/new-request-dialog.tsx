"use client";

import { useState, useRef } from "react";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowLeft, Check, Upload, X } from "lucide-react";
import { useVrmLookup, useCreateRequestWithDefects } from "@/hooks/use-vehicles";
import { useUploadMotDetails } from "@/hooks/use-requests";
import { queryKeys } from "@/lib/query-keys";
import {
  hasRecentClientEnquiry,
  markClientEnquirySubmitted,
} from "@/lib/enquiry-submit-guard";
import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { PhoneInput } from "@/components/phone-input";
import { Field, FieldLabel, FieldError, FieldGroup } from "@/components/ui/field";
import * as FileUpload from "@/components/ui/file-upload";
import type { VrmLookupResponse } from "@/types/vehicle";
import { defectTypeConfig } from "@/types/vehicle";
import { UK_POSTCODE_REGEX } from "@/lib/uk-postcode";

const requestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  postcode: z
    .string()
    .trim()
    .max(10, "Postcode must be less than 10 characters")
    .regex(UK_POSTCODE_REGEX, "Please enter a valid UK postcode (e.g. SW1A 1AA)"),
  vrm: z.string().min(2, "Please enter a valid registration number."),
  notes: z.string(),
  authorized: z.boolean().refine((val) => val === true, {
    message: "You must authorize contact to continue.",
  }),
});

export interface NewRequestFormValues {
  name: string;
  email: string;
  phone: string;
  postcode: string;
  vrm: string;
  notes: string;
}

interface NewRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVehicleLookupSuccess?: (
    vehicleData: VrmLookupResponse,
    formValues: NewRequestFormValues,
  ) => void;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}

export function NewRequestDialog({
  open,
  onOpenChange,
  onVehicleLookupSuccess,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: NewRequestDialogProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [defectsData, setDefectsData] = useState<VrmLookupResponse | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [successMessage, setSuccessMessage] = useState(
    "We'll review your request and send a quote shortly.",
  );
  const isSubmittingRef = useRef(false);

  const queryClient = useQueryClient();
  const vrmLookup = useVrmLookup();
  const createRequest = useCreateRequestWithDefects();
  const uploadMotDetails = useUploadMotDetails();

  const resetDialog = () => {
    setStep(1);
    setDefectsData(null);
    setSelectedIds(new Set());
    setFiles([]);
    setSuccessMessage("We'll review your request and send a quote shortly.");
    isSubmittingRef.current = false;
    form.reset();
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) resetDialog();
    onOpenChange(nextOpen);
  };

  const form = useForm({
    defaultValues: {
      name: defaultName,
      email: defaultEmail,
      phone: defaultPhone,
      postcode: "",
      vrm: "",
      notes: "",
      authorized: false as boolean,
    },
    validators: {
      onSubmit: requestSchema,
    },
    onSubmit: async ({ value }) => {
      if (vrmLookup.isPending || isSubmittingRef.current) return;

      isSubmittingRef.current = true;
      vrmLookup.mutate(value.vrm, {
        onSuccess: (data) => {
          onVehicleLookupSuccess?.(data, {
            name: value.name,
            email: value.email,
            phone: value.phone,
            postcode: value.postcode,
            vrm: value.vrm,
            notes: value.notes,
          });
          setDefectsData(data);
          setSelectedIds(new Set());
          setStep(2);
        },
        onSettled: () => {
          isSubmittingRef.current = false;
        },
      });
    },
  });

  const toggleDefect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSubmitRequest = async () => {
    if (
      createRequest.isPending ||
      uploadMotDetails.isPending ||
      isSubmittingRef.current
    ) {
      return;
    }
    if (!defectsData?.vehicle || selectedIds.size === 0) return;

    const values = form.state.values;

    if (hasRecentClientEnquiry(values.email, values.vrm)) {
      setSuccessMessage(
        "We already received your quote request. Our team will be in touch shortly.",
      );
      setStep(3);
      return;
    }

    isSubmittingRef.current = true;

    try {
      for (const file of files) {
        await uploadMotDetails.mutateAsync(file);
      }

      createRequest.mutate(
        {
          name: values.name,
          email: values.email,
          phone: values.phone,
          vrm: values.vrm,
          postcode: values.postcode,
          selectedDefectIds: Array.from(selectedIds),
          notes: values.notes || undefined,
        },
        {
          onSuccess: (result) => {
            markClientEnquirySubmitted(values.email, values.vrm);
            queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
            setSuccessMessage(
              result.message ||
                "We'll review your request and send a quote shortly.",
            );
            setStep(3);
          },
          onSettled: () => {
            isSubmittingRef.current = false;
          },
        },
      );
    } catch {
      isSubmittingRef.current = false;
    }
  };

  const isBusy =
    vrmLookup.isPending || createRequest.isPending || uploadMotDetails.isPending;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="sm:max-w-[650px] max-h-[90vh] p-4 gap-0 rounded-3xl overflow-hidden flex flex-col bg-white border border-[#F0F0F0]"
      >
        <div className="bg-[#F6F6F6] border border-[#F0F0F0] rounded-2xl px-6 py-4 mb-3 relative">
          {step === 2 && (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="absolute top-4 left-4 p-1 rounded-full hover:bg-[#EAEAEA] transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5 text-[#81868C]" />
            </button>
          )}
          <h2 className="text-xl font-semibold text-[#0E1716]">
            {step === 1 && "Vehicle details"}
            {step === 2 && "Select repairs"}
            {step === 3 && "Request submitted"}
          </h2>
          <p className="text-[#7F8282] text-sm">
            {step === 1 && "Enter your vehicle details and get a quote"}
            {step === 2 &&
              `${defectsData?.vehicle.make} ${defectsData?.vehicle.model} · ${defectsData?.vehicle.vrm}`}
            {step === 3 && successMessage}
          </p>
          <DialogClose className="absolute top-4 right-4 p-1 rounded-full hover:bg-[#EAEAEA] transition-colors">
            <X className="h-5 w-5 text-[#81868C]" />
          </DialogClose>
        </div>

        <div className="bg-[#F6F6F6] border border-[#F0F0F0] rounded-2xl p-6 flex-1 overflow-y-auto">
          {step === 1 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
              }}
              className="flex flex-col gap-6"
            >
              <FieldGroup className="gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.Field
                    name="name"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="gap-1">
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-[#211E25] text-sm font-medium px-2"
                          >
                            Name
                          </FieldLabel>
                          <Input
                            id={field.name}
                            placeholder="Enter your name"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={!!defaultName || isBusy}
                            className="rounded-lg px-4 py-5 bg-white border-[#EAEAEA]"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                  <form.Field
                    name="email"
                    children={(field) => {
                      const isInvalid =
                        field.state.meta.isTouched && !field.state.meta.isValid;
                      return (
                        <Field data-invalid={isInvalid} className="gap-1">
                          <FieldLabel
                            htmlFor={field.name}
                            className="text-[#211E25] text-sm font-medium px-2"
                          >
                            Email
                          </FieldLabel>
                          <Input
                            id={field.name}
                            type="email"
                            placeholder="Enter your email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            disabled={!!defaultEmail || isBusy}
                            className="rounded-lg px-4 py-5 bg-white border-[#EAEAEA]"
                          />
                          {isInvalid && (
                            <FieldError errors={field.state.meta.errors} />
                          )}
                        </Field>
                      );
                    }}
                  />
                </div>

                <form.Field
                  name="phone"
                  children={(field) => {
                    const isInvalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field data-invalid={isInvalid} className="gap-1">
                        <FieldLabel className="text-[#211E25] text-sm font-medium px-2">
                          Phone number
                        </FieldLabel>
                        <PhoneInput
                          value={field.state.value}
                          onChange={(value) => field.handleChange(value)}
                          defaultCountry="GB"
                          disabled={!!defaultPhone || isBusy}
                        />
                        {isInvalid && (
                          <FieldError errors={field.state.meta.errors} />
                        )}
                      </Field>
                    );
                  }}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.Field
                    name="postcode"
                    children={(field) => (
                      <Field className="gap-1">
                        <FieldLabel className="text-[#211E25] text-sm font-medium px-2">
                          Postcode
                        </FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          disabled={isBusy}
                          className="rounded-lg px-4 py-5 bg-white border-[#EAEAEA]"
                        />
                      </Field>
                    )}
                  />
                  <form.Field
                    name="vrm"
                    children={(field) => (
                      <Field className="gap-1">
                        <FieldLabel className="text-[#211E25] text-sm font-medium px-2">
                          VRM
                        </FieldLabel>
                        <Input
                          value={field.state.value}
                          onChange={(e) =>
                            field.handleChange(e.target.value.toUpperCase())
                          }
                          disabled={isBusy}
                          className="rounded-lg px-4 py-5 bg-white border-[#EAEAEA]"
                        />
                      </Field>
                    )}
                  />
                </div>

                <Field className="gap-1">
                  <FieldLabel className="text-[#211E25] text-sm font-medium px-2">
                    MOT failure details
                  </FieldLabel>
                  <FileUpload.Root
                    value={files}
                    onValueChange={setFiles}
                    accept="image/*,.pdf"
                    maxFiles={5}
                    maxSize={10 * 1024 * 1024}
                    multiple
                    disabled={isBusy}
                  >
                    <FileUpload.Dropzone className="border border-dashed border-[#FD6900] rounded-lg p-6 text-center bg-white">
                      <Upload className="h-5 w-5 mx-auto mb-2 text-[#494F57]" />
                      <p className="text-sm font-medium text-[#494F57]">
                        Import Files
                      </p>
                    </FileUpload.Dropzone>
                  </FileUpload.Root>
                </Field>

                <form.Field
                  name="notes"
                  children={(field) => (
                    <Field className="gap-1">
                      <FieldLabel className="text-[#211E25] text-sm font-medium px-2">
                        Extra notes
                      </FieldLabel>
                      <Textarea
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        disabled={isBusy}
                        className="min-h-[80px] rounded-lg bg-white border-[#EAEAEA]"
                      />
                    </Field>
                  )}
                />

                <form.Field
                  name="authorized"
                  children={(field) => (
                    <Field className="gap-1">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={field.state.value}
                          onCheckedChange={(checked) =>
                            field.handleChange(checked as boolean)
                          }
                          disabled={isBusy}
                        />
                        <label className="text-sm text-[#69757A] leading-relaxed">
                          I authorize Fail2Fix to contact me about MOT repair
                          quotations.
                        </label>
                      </div>
                    </Field>
                  )}
                />
              </FieldGroup>

              <Button
                type="submit"
                disabled={isBusy}
                className="w-full h-12 bg-[#F15D1E] hover:bg-[#d9531a] text-white rounded-full"
              >
                {vrmLookup.isPending ? "Looking up vehicle..." : "Continue"}
              </Button>
            </form>
          )}

          {step === 2 && defectsData && (
            <div className="flex flex-col gap-4">
              {defectsData.defects.length === 0 ? (
                <p className="text-sm text-[#69757A]">
                  No priced defects found for this vehicle. Add notes and submit
                  anyway, or contact support.
                </p>
              ) : (
                <div className="space-y-2 max-h-[340px] overflow-y-auto">
                  {defectsData.defects.map((defect) => {
                    const selected = selectedIds.has(defect.id);
                    const config = defectTypeConfig[defect.type];
                    return (
                      <button
                        key={defect.id}
                        type="button"
                        onClick={() => toggleDefect(defect.id)}
                        className={`w-full text-left rounded-lg border p-3 transition-colors ${
                          selected
                            ? "border-[#F15D1E] bg-white"
                            : "border-[#EAEAEA] bg-white/70"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded border ${
                              selected
                                ? "border-[#F15D1E] bg-[#F15D1E] text-white"
                                : "border-[#D1D5DB]"
                            }`}
                          >
                            {selected && <Check className="h-3 w-3" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="text-[10px] font-semibold px-2 py-0.5 rounded"
                                style={{
                                  color: config.color,
                                  backgroundColor: config.bgColor,
                                  border: `1px solid ${config.borderColor}`,
                                }}
                              >
                                {config.label}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-[#494F57]">
                              {defect.text}
                            </p>
                            {defect.suggestedPart && (
                              <p className="mt-1 text-xs text-[#81868C]">
                                {defect.suggestedPart.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              <Button
                type="button"
                onClick={handleSubmitRequest}
                disabled={
                  isBusy ||
                  (defectsData.defects.length > 0 && selectedIds.size === 0)
                }
                className="w-full h-12 bg-[#F15D1E] hover:bg-[#d9531a] text-white rounded-full"
              >
                {createRequest.isPending ? "Submitting..." : "Submit request"}
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#DCFCE7]">
                <Check className="h-7 w-7 text-[#16A34A]" />
              </div>
              <p className="text-[#0E1716] font-medium">
                Your repair request has been submitted.
              </p>
              <Button
                type="button"
                onClick={() => handleOpenChange(false)}
                className="rounded-full bg-[#F15D1E] hover:bg-[#d9531a]"
              >
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
