import Image from "next/image";
import { Camera } from "lucide-react";

interface PhotoProps {
  src?: string;
  alt?: string;
  /** Shown on the placeholder so editors know which photo belongs here. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Extra classes for the <img> (e.g. hover zoom). */
  imgClassName?: string;
}

/**
 * Real photo when `src` is set (uploaded through the CMS), otherwise a clearly
 * marked placeholder — we never show invented photos of real events.
 * The parent decides the size/aspect ratio; Photo fills it.
 */
export function Photo({ src, alt = "", label, className = "", sizes = "100vw", priority, imgClassName = "" }: PhotoProps) {
  return (
    <div className={`${/\babsolute\b/.test(className) ? "" : "relative"} overflow-hidden ${className}`}>
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={`object-cover ${imgClassName}`} />
      ) : (
        <div
          role="img"
          aria-label={`Photo placeholder${label ? `: ${label}` : ""}`}
          className={`bg-stripes absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center ${imgClassName}`}
        >
          <span className="grid size-11 place-items-center rounded-full bg-white/80 text-brand-600 shadow-sm">
            <Camera className="size-5" aria-hidden />
          </span>
          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold tracking-[0.14em] text-brand-700 uppercase">
            Photo placeholder
          </span>
          {label && <span className="max-w-[18rem] text-xs leading-snug font-medium text-ink-soft">{label}</span>}
        </div>
      )}
    </div>
  );
}
