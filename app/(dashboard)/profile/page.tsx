"use client";

import { useEffect, useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { CheckCircle2, Mail } from "lucide-react";
import { useDashboardStore } from "@/stores/dashboard-store";
import { updateUser, useSession } from "@/lib/auth-client";
import { useUpdateProfile, useUserProfile } from "@/hooks/use-user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Button from "@/components/custombutton";
import { toast } from "@/components/ui/sonner";
import { ApiError } from "@/lib/api-client";

const profileSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name must be under 80 characters."),
  phone: z
    .string()
    .max(20, "Phone number must be under 20 characters.")
    .regex(/^[\d\s+()-]*$/, "Please enter a valid phone number."),
  address: z.string().max(200, "Address must be under 200 characters."),
  city: z.string().max(100, "City must be under 100 characters."),
  state: z.string().max(100, "County must be under 100 characters."),
  postalCode: z.string().max(20, "Postcode must be under 20 characters."),
});

export default function ProfilePage() {
  const setHeader = useDashboardStore((state) => state.setHeader);
  const { refetch: refetchSession } = useSession();
  const { data: profile, isLoading, isError, error } = useUserProfile();
  const { mutateAsync: saveProfile, isPending: isSaving } = useUpdateProfile();
  const [formReady, setFormReady] = useState(false);

  useEffect(() => {
    setHeader({
      title: "Profile",
      description: "View and update your account details",
      showBreadcrumbs: false,
      showButton: false,
    });
  }, [setHeader]);

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
    },
    validators: {
      onSubmit: profileSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const nextName = value.name.trim();
        const updated = await saveProfile({
          name: nextName,
          phone: value.phone?.trim() || null,
          address: value.address?.trim() || null,
          city: value.city?.trim() || null,
          state: value.state?.trim() || null,
          postalCode: value.postalCode?.trim() || null,
        });

        // Keep Better Auth session cookie in sync when display name changes
        if (nextName && nextName !== profile?.name) {
          const { error: sessionError } = await updateUser({ name: nextName });
          if (sessionError) {
            console.warn("Session name sync failed:", sessionError.message);
          } else {
            await refetchSession();
          }
        }

        form.setFieldValue("name", updated.name || "");
        form.setFieldValue("phone", updated.phone || "");
        form.setFieldValue("address", updated.address || "");
        form.setFieldValue("city", updated.city || "");
        form.setFieldValue("state", updated.state || "");
        form.setFieldValue("postalCode", updated.postalCode || "");
        toast.success("Profile updated");
      } catch (err) {
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : "Failed to update profile";
        toast.error(message);
      }
    },
  });

  useEffect(() => {
    if (!profile) return;
    form.setFieldValue("name", profile.name || "");
    form.setFieldValue("phone", profile.phone || "");
    form.setFieldValue("address", profile.address || "");
    form.setFieldValue("city", profile.city || "");
    form.setFieldValue("state", profile.state || "");
    form.setFieldValue("postalCode", profile.postalCode || "");
    setFormReady(true);
  }, [profile, form]);

  if (isLoading || !formReady) {
    return (
      <div className="flex items-center justify-center px-3 py-16 md:px-5">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-[#FD6900]" />
      </div>
    );
  }

  if (isError || !profile) {
    return (
      <div className="px-3 py-10 md:px-5">
        <div className="max-w-xl rounded-xl border border-[#EAEAEA] bg-white p-6 text-sm text-[#494F57]">
          {error instanceof ApiError && error.status === 401
            ? "Your session expired. Please sign in again."
            : "Could not load your profile. Please try again."}
        </div>
      </div>
    );
  }

  const initials = (profile.name || "U").slice(0, 2).toUpperCase();
  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6 px-3 pb-3 md:px-5 md:pb-4">
      <div className="max-w-xl rounded-xl border border-[#EAEAEA] bg-white p-5 md:p-6">
        <div className="mb-6 flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="bg-[#EAEAEA] text-base font-semibold text-[#494F57]">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold text-[#494F57]">
              {profile.name || "User"}
            </p>
            <p className="truncate text-sm text-[#97999D]">{profile.email}</p>
          </div>
        </div>

        <dl className="mb-6 space-y-4 border-t border-[#EAEAEA] pt-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <dt className="text-xs font-medium tracking-wide text-[#97999D] uppercase">
                Email
              </dt>
              <dd className="mt-1 flex items-center gap-2 text-sm font-medium text-[#494F57]">
                <Mail className="h-3.5 w-3.5 text-[#81868C]" />
                {profile.email || "—"}
              </dd>
            </div>
            {profile.emailVerified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Verified
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                Unverified
              </span>
            )}
          </div>
          <div>
            <dt className="text-xs font-medium tracking-wide text-[#97999D] uppercase">
              Member since
            </dt>
            <dd className="mt-1 text-sm font-medium text-[#494F57]">
              {memberSince}
            </dd>
          </div>
        </dl>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4 border-t border-[#EAEAEA] pt-5"
        >
          <FieldGroup className="gap-4">
            <form.Field
              name="name"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Display name
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isSaving}
                      className="h-11"
                      placeholder="Your name"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="phone"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Phone
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isSaving}
                      className="h-11"
                      placeholder="07..."
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <form.Field
              name="address"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Address
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isSaving}
                      className="h-11"
                      placeholder="Street address"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field
                name="city"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        City
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        disabled={isSaving}
                        className="h-11"
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              />
              <form.Field
                name="state"
                children={(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid} className="gap-1">
                      <FieldLabel
                        htmlFor={field.name}
                        className="text-[0.85rem] font-medium text-gray-900"
                      >
                        County
                      </FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        aria-invalid={isInvalid}
                        disabled={isSaving}
                        className="h-11"
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
              name="postalCode"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid} className="gap-1">
                    <FieldLabel
                      htmlFor={field.name}
                      className="text-[0.85rem] font-medium text-gray-900"
                    >
                      Postcode
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      disabled={isSaving}
                      className="h-11"
                      placeholder="e.g. SW1A 1AA"
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="py-5"
            loading={isSaving}
            loadingText="Saving..."
            disabled={isSaving}
          >
            Save changes
          </Button>
        </form>
      </div>
    </div>
  );
}
