"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";

type SubmitButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  pendingText?: string;
};

export const SubmitButton = ({
  children,
  className,
  pendingText = "Submitting...",
  ...props
}: SubmitButtonProps) => {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      aria-disabled={pending}
      disabled={pending || props.disabled}
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-md bg-dark px-4 text-sm font-medium text-light transition-colors hover:bg-dark/90 disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    >
      {pending ? pendingText : children}
    </button>
  );
};
