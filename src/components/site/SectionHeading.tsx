interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  light?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="label-eyebrow text-crimson">{eyebrow}</p>
      <h2
        className={`mt-4 text-balance font-heading text-[2rem] font-bold leading-[1.08] tracking-[-0.03em] sm:text-[2.5rem] ${
          light ? "text-white" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={`mt-5 text-base leading-[1.65] sm:text-[1.0625rem] ${
            light ? "text-white/70" : "text-ink/65"
          }`}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
