"use client";

import { CheckCircle2, Clock, Loader2 } from "lucide-react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ButtonArrow, buttonClasses, type ButtonVariant } from "@/components/ui/Button";

interface FormLinkButtonProps {
  /** Validated Google Form URL, or null while the organisation hasn't provided it yet. */
  url: string | null;
  label: string;
  variant?: ButtonVariant;
  icon?: ReactNode;
  /** Return false to block opening (e.g. consent not given). */
  beforeOpen?: () => boolean;
  instagramHref?: string;
  light?: boolean;
  className?: string;
}

type Status = "idle" | "opening" | "opened" | "pending";

/**
 * Opens the official Google Form in a new tab. Applications never pass
 * through this website — responses go straight to the organisation's private
 * Google account. While no link is configured, the button says so honestly
 * instead of pretending to work.
 */
export function FormLinkButton({ url, label, variant = "brand", icon, beforeOpen, instagramHref, light = false, className = "" }: FormLinkButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const statusId = useId();
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = () => {
    if (beforeOpen && !beforeOpen()) return;
    if (!url) {
      setStatus("pending");
      return;
    }
    setStatus("opening");
    window.open(url, "_blank", "noopener,noreferrer");
    timer.current = setTimeout(() => setStatus("opened"), 900);
  };

  const msgTone = light ? "text-white/85" : "text-ink-soft";

  return (
    <div className={className}>
      <button type="button" onClick={onClick} className={buttonClasses(variant, "lg", "w-full max-w-full !h-auto min-h-14 py-3 !whitespace-normal text-center sm:w-auto")} aria-describedby={statusId}>
        {status === "opening" ? <Loader2 className="size-[1.1em] animate-spin" aria-hidden /> : icon}
        <span>{status === "opening" ? "Opening the form…" : label}</span>
        {status !== "opening" && <ButtonArrow external={!!url} />}
        {!url && (
          <span className="ml-1 shrink-0 rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">Link pending</span>
        )}
      </button>

      <div id={statusId} aria-live="polite" className="min-h-[1.5rem]">
        {status === "opened" && url && (
          <p className={`mt-3 flex items-start gap-2 text-sm font-medium ${msgTone}`}>
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" aria-hidden />
            <span>
              The form opened in a new tab. If nothing happened,{" "}
              <a href={url} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                open it here
              </a>
              .
            </span>
          </p>
        )}
        {status === "pending" && (
          <p className={`mt-3 flex items-start gap-2 rounded-2xl p-3 text-sm font-medium ${light ? "bg-white/10 text-white" : "bg-sun-soft text-ink"}`}>
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden />
            <span>
              The application form isn&apos;t published yet — it will appear here very soon.
              {instagramHref && (
                <>
                  {" "}
                  Meanwhile, you can message us on{" "}
                  <a href={instagramHref} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-2">
                    Instagram
                  </a>
                  .
                </>
              )}
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
