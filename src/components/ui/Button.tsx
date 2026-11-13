import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export type ButtonVariant = "sun" | "brand" | "outline" | "white" | "ghostLight";
export type ButtonSize = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold whitespace-nowrap " +
  "transition-[transform,background-color,box-shadow,border-color] duration-300 ease-[var(--ease-soft)] " +
  "active:scale-[0.97] disabled:cursor-not-allowed";

const variants: Record<ButtonVariant, string> = {
  sun: "btn-shine bg-sun text-ink shadow-[0_12px_30px_-12px_rgb(255_179_0/0.9)] hover:bg-sun-deep hover:-translate-y-0.5",
  brand: "btn-shine bg-brand-600 text-white shadow-[0_12px_30px_-12px_rgb(31_82_216/0.9)] hover:bg-brand-700 hover:-translate-y-0.5",
  outline: "border border-ink/15 bg-white/60 text-ink backdrop-blur hover:border-ink/40 hover:bg-white",
  white: "bg-white text-ink hover:bg-sky hover:-translate-y-0.5",
  ghostLight: "border border-white/30 text-white hover:bg-white/10 hover:border-white/60",
};

const sizes: Record<ButtonSize, string> = {
  md: "h-11 px-5 text-[15px]",
  lg: "h-14 px-7 text-base",
};

export function buttonClasses(variant: ButtonVariant = "brand", size: ButtonSize = "md", extra = "") {
  return `${base} ${variants[variant]} ${sizes[size]} ${extra}`;
}

export function ButtonArrow({ external = false }: { external?: boolean }) {
  const Icon = external ? ArrowUpRight : ArrowRight;
  return (
    <Icon
      aria-hidden
      className={`size-[1.1em] transition-transform duration-300 ease-[var(--ease-soft)] ${
        external ? "group-hover:translate-x-0.5 group-hover:-translate-y-0.5" : "group-hover:translate-x-1"
      }`}
    />
  );
}

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  arrow?: boolean;
  className?: string;
}

export function ButtonLink({ href, children, variant = "brand", size = "md", icon, arrow = true, className = "" }: ButtonLinkProps) {
  const external = /^https?:/.test(href);
  const content = (
    <>
      {icon}
      <span>{children}</span>
      {arrow && <ButtonArrow external={external} />}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={buttonClasses(variant, size, className)}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={buttonClasses(variant, size, className)}>
      {content}
    </Link>
  );
}
