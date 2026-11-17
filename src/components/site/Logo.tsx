interface LogoProps {
  className?: string;
}

export default function Logo({ className = "" }: LogoProps) {
  return (
    <a
      href="#top"
      aria-label="CareerNave — back to top"
      className={`inline-flex shrink-0 items-center gap-2.5 whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson ${className}`}
    >
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="h-7 w-7 shrink-0"
      >
        <rect x="1" y="1" width="26" height="26" rx="4" stroke="#0A0A0A" strokeWidth="1.5" />
        <path d="M8.5 19.5L13.2 8.5L19.5 14.8L8.5 19.5Z" fill="#D33F43" />
        <circle cx="19.5" cy="8.5" r="2" fill="#0A0A0A" />
      </svg>
      <span className="font-heading text-xl font-extrabold tracking-[-0.03em] text-ink">
        Career<span className="text-crimson">Nave</span>
      </span>
    </a>
  );
}
