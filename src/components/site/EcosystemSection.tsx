import { motion } from "motion/react";
import { Building2, GraduationCap, Landmark, School } from "lucide-react";
import { SectionHeading } from "@/src/components/site/SectionHeading";

const PILLARS = [
  {
    number: "01",
    icon: GraduationCap,
    title: "Learners",
    body: "Pathways to accredited learnerships, internships, and Work-Integrated Learning (WIL).",
  },
  {
    number: "02",
    icon: Building2,
    title: "Employers",
    body: "Run learnerships with or without physical office space — zero-payroll-cost hosting, with virtual and remote placements supported, unlocking B-BBEE points and SARS Section 12H tax rebates.",
  },
  {
    number: "03",
    icon: School,
    title: "Training Providers",
    body: "QCTO-aligned curriculum delivery and streamlined skills management.",
  },
  {
    number: "04",
    icon: Landmark,
    title: "Government Programmes",
    body: "Direct alignment with SETA Discretionary Grants to combat youth unemployment.",
  },
];

export default function EcosystemSection() {
  return (
    <section id="how-it-works" className="scroll-anchor border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="How It Works"
            title="The CareerNave Ecosystem"
            intro="Four stakeholders, one connected pathway. Each pillar strengthens the next — and CareerNave coordinates all four."
          />
          <p className="hidden max-w-[16rem] border-t border-crimson/50 pt-3 text-sm leading-relaxed text-ink/60 lg:block">
            One coordination point for learners, employers, providers and funders.
          </p>
        </div>

        <div className="mt-12 grid border-t border-ink/10 sm:grid-cols-2">
          {PILLARS.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <motion.article
                key={pillar.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                className="group relative border-b border-ink/10 px-0 py-9 transition-colors duration-200 sm:px-9 sm:odd:border-r sm:odd:pl-0 sm:even:pr-0 lg:px-10"
              >
                <div className="flex items-start justify-between">
                  <span className="label-eyebrow tabular-nums text-crimson">{pillar.number}</span>
                  <Icon
                    className="h-7 w-7 text-ink/25 transition-colors duration-200 group-hover:text-crimson"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="mt-8 font-heading text-xl font-bold tracking-[-0.02em] text-ink sm:text-[1.375rem]">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-sm text-[0.9375rem] leading-[1.65] text-ink/65">{pillar.body}</p>
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 bg-crimson transition-transform duration-300 group-hover:scale-x-100"
                />
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
