import { useState } from "react";
import { motion } from "motion/react";
import { Search, X } from "lucide-react";
import { SectionHeading } from "@/src/components/site/SectionHeading";
import { SETAS } from "@/src/data/setas";

export default function SetasSection() {
  const [query, setQuery] = useState("");
  const term = query.trim().toLowerCase();
  const visible = term
    ? SETAS.filter(
        (seta) =>
          seta.acronym.toLowerCase().includes(term) || seta.name.toLowerCase().includes(term)
      )
    : SETAS;

  return (
    <section id="setas" className="scroll-anchor border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="SETA Coverage"
            title="Working across all 21 SETAs."
            intro="Every Sector Education and Training Authority in South Africa — so funding, accreditation and placement follow your industry, not a narrow list."
          />
          <p className="hidden max-w-[16rem] border-t border-crimson/50 pt-3 text-sm leading-relaxed text-ink/60 lg:block">
            From AgriSETA to W&amp;RSETA — including BANKSETA and CATHSSETA.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-b border-ink/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a SETA or sector"
              aria-label="Search SETAs"
              className="min-h-[42px] w-full rounded-full border border-ink/15 bg-white py-2.5 pl-11 pr-10 text-sm text-ink placeholder:text-ink/40 focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/20"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-crimson"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          <p className="label-eyebrow tabular-nums text-ink/45">
            {visible.length} of {SETAS.length} SETAs
          </p>
        </div>

        {visible.length === 0 ? (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border border-ink/10 bg-neutral-50 p-6">
            <p className="text-sm text-ink/65">
              No SETA matches &ldquo;{query.trim()}&rdquo;. We cover every sector — clear the search to view the full list.
            </p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="whitespace-nowrap text-sm font-semibold text-crimson underline underline-offset-4 hover:text-crimson-dark"
            >
              Show all 21 SETAs
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((seta, index) => (
              <motion.div
                key={seta.acronym}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.35,
                  delay: Math.min(index, 8) * 0.03,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group bg-white p-5 transition-colors duration-200 hover:bg-crimson-tint sm:p-6"
              >
                <h3 className="font-heading text-[0.9375rem] font-bold tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-crimson">
                  {seta.acronym}
                </h3>
                <p className="mt-1.5 text-[0.8125rem] leading-[1.5] text-ink/60">{seta.name}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
