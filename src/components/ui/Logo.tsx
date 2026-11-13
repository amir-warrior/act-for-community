import Link from "next/link";

/**
 * TEMPORARY wordmark. Replace the <svg> with the official Act for Community
 * logo (e.g. <Image src="/logo.svg" …/>) once the team provides it.
 */
export function Logo({ light = false, onClick }: { light?: boolean; onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} aria-label="Act for Community — home" className="group flex items-center gap-2.5">
      <svg viewBox="0 0 40 40" className="size-9 shrink-0 transition-transform duration-500 group-hover:rotate-[-10deg]" aria-hidden>
        <circle cx="28" cy="12" r="8" fill="var(--color-sun)" />
        <circle cx="17" cy="22" r="14" fill={light ? "#fff" : "var(--color-brand-600)"} />
        <path
          d="M11.2 28 17 14l5.8 14M13.4 23.2h7.2"
          stroke={light ? "var(--color-brand-700)" : "#fff"}
          strokeWidth="2.6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className={`font-display text-[14px] leading-[1.05] font-semibold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Act for
        <br />
        Community
      </span>
    </Link>
  );
}
