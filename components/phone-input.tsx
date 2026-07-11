"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
import {
  getCountryCallingCode,
  CountryCode,
  parsePhoneNumberFromString,
} from "libphonenumber-js";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Country {
  code: CountryCode;
  name: string;
}

const countries: Country[] = [
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "IN", name: "India" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "PK", name: "Pakistan" },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  defaultCountry?: CountryCode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  defaultCountry = "GB",
  className,
  placeholder = "1234567890",
  disabled = false,
}: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = React.useState<Country>(
    countries.find((c) => c.code === defaultCountry) || countries[0]
  );

  const callingCode = getCountryCallingCode(selectedCountry.code);

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-lg border border-[#EAEAEA] bg-white shrink-0 h-[46px]",
              disabled ? "bg-[#F5F5F5] cursor-not-allowed" : "hover:bg-gray-50"
            )}
          >
            <ReactCountryFlag
              countryCode={selectedCountry.code}
              svg
              style={{ width: "1.5em", height: "1.5em" }}
            />
            <span className="text-sm text-[#494F57]">+{callingCode}</span>
            <ChevronDown className="h-4 w-4 text-[#81868C]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 rounded-lg" align="start">
          <DropdownMenuGroup>
            {countries.map((country) => (
              <DropdownMenuItem
                key={country.code}
                className="gap-3 cursor-pointer flex items-center"
                onSelect={() => handleCountryChange(country)}
              >
                <ReactCountryFlag
                  countryCode={country.code}
                  svg
                  style={{ width: "1.5em", height: "1.5em" }}
                />
                <span className="flex-1">{country.name}</span>
                <span className="text-[#81868C] text-sm">
                  +{getCountryCallingCode(country.code)}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <Input
        type="tel"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="rounded-lg px-4 py-5 bg-white border-[#EAEAEA] placeholder:text-[#ACACAC] placeholder:text-sm flex-1 h-[46px] disabled:bg-[#F5F5F5] disabled:text-[#494F57] disabled:opacity-100"
      />
    </div>
  );
}
