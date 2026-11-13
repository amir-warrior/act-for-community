"use client";

import { AlertCircle, Check, Heart } from "lucide-react";
import { useRef, useState } from "react";
import { FormLinkButton } from "./FormLinkButton";

/**
 * Consent first, then the private Google Form. Nothing is submitted to or
 * stored by this website.
 */
export function HelpApply({ url, instagramHref }: { url: string | null; instagramHref?: string }) {
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState(false);
  const boxRef = useRef<HTMLInputElement>(null);

  const beforeOpen = () => {
    if (agreed) return true;
    setError(true);
    boxRef.current?.focus();
    return false;
  };

  return (
    <div>
      <label
        className={`group flex cursor-pointer gap-4 rounded-2xl p-4 ring-1 transition-colors sm:p-5 ${
          error ? "bg-red-50 ring-red-300" : agreed ? "bg-sky ring-brand-300" : "bg-white ring-ink/10 hover:ring-brand-300"
        }`}
      >
        <span className="relative mt-0.5 shrink-0">
          <input
            ref={boxRef}
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError(false);
            }}
            aria-invalid={error}
            aria-describedby={error ? "consent-error" : undefined}
            className="peer size-6 cursor-pointer appearance-none rounded-lg border-2 border-ink/25 bg-white transition-colors checked:border-brand-600 checked:bg-brand-600 focus-visible:outline-3 focus-visible:outline-brand-400"
          />
          <Check className="pointer-events-none absolute top-1 left-1 size-4 text-white opacity-0 transition-opacity peer-checked:opacity-100" aria-hidden strokeWidth={3} />
        </span>
        <span className="text-[15px] leading-relaxed text-ink">
          I agree that the core team of Act for Community may use the information I submit only to review my request and contact me. I understand it
          will be kept private and will not be published or shared.
        </span>
      </label>

      {error && (
        <p id="consent-error" role="alert" className="mt-3 flex items-center gap-2 text-sm font-semibold text-red-600">
          <AlertCircle className="size-4" aria-hidden /> Please tick the consent box above to continue.
        </p>
      )}

      <FormLinkButton
        className="mt-6"
        url={url}
        label="Open the application form"
        variant="sun"
        icon={<Heart className="size-[1.1em]" aria-hidden />}
        beforeOpen={beforeOpen}
        instagramHref={instagramHref}
      />
    </div>
  );
}
