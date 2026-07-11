"use client"

import { useId } from "react"
import { OTPInput, SlotProps } from "input-otp"
import { MinusIcon } from "lucide-react"

import { cn } from "@/lib/utils"


interface OTPComponentProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function OTPComponent({ value, onChange, disabled }: OTPComponentProps) {
  const id = useId()
  return (
    <div className="*:not-first:mt-2">
      <OTPInput
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        containerClassName="flex items-center gap-3 has-disabled:opacity-50"
        maxLength={6}
        render={({ slots }) => (
          <>
            <div className="flex">
              {slots.slice(0, 3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>

            <div className="text-muted-foreground/80">
              <MinusIcon size={16} aria-hidden="true" />
            </div>

            <div className="flex">
              {slots.slice(3).map((slot, idx) => (
                <Slot key={idx} {...slot} />
              ))}
            </div>
          </>
        )}
      />
    </div>
  )
}

function Slot(props: SlotProps) {
  return (
    <div
      className={cn(
        "border-input bg-background text-foreground relative -ms-px flex size-16 items-center justify-center border font-medium shadow-xs transition-[color,box-shadow] first:ms-0 first:rounded-s-md last:rounded-e-md",
        { "border-ring ring-ring/50 z-10 ring-[3px]": props.isActive }
      )}
    >
      {props.char !== null && <div>{props.char}</div>}
    </div>
  )
}
