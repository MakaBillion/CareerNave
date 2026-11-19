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
      <span
        aria-hidden="true"
        className="relative flex h-7 w-12 shrink-0 items-center justify-center overflow-hidden"
      >
        <img
          src="/assets/aistudio/image_a0e679ca_a2a722c7.jpg"
          alt=""
          referrerPolicy="no-referrer"
          className="h-auto w-[185%] max-w-none shrink-0 mix-blend-multiply"
        />
      </span>
      <span className="font-heading text-xl font-extrabold tracking-[-0.03em] text-ink">
        Career<span className="text-crimson">Nave</span>
      </span>
    </a>
  );
}
