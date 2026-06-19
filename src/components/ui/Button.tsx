import Link from "next/link";
import type { ReactNode } from "react";

interface ButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "outline" | "dark" | "ghost";
  className?: string;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "bg-red border-red text-white hover:bg-ink hover:border-ink",
  outline: "bg-white border-red text-red hover:bg-red hover:text-white",
  dark: "bg-ink border-ink text-white hover:bg-red hover:border-red",
  ghost: "bg-transparent border-white/40 text-white hover:bg-white hover:text-ink",
};

export default function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-md border-2 px-6 min-h-12 text-[15px] font-extrabold whitespace-nowrap transition-all duration-150 hover:-translate-y-0.5 ${variantStyles[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
