"use client";

import posthog from "posthog-js";
import Button from "@/components/ui/Button";
import type { ReactNode } from "react";

interface TrackableButtonProps {
  href: string;
  event: string;
  properties?: Record<string, string | number | boolean>;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark" | "ghost";
  className?: string;
}

export default function TrackableButton({
  href,
  event,
  properties,
  children,
  variant,
  className,
}: TrackableButtonProps) {
  return (
    <Button
      href={href}
      variant={variant}
      className={className}
      onClick={() => posthog.capture(event, properties)}
    >
      {children}
    </Button>
  );
}
