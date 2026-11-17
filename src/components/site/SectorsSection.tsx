import { motion } from "motion/react";
import { Briefcase, Cpu, Headphones, ShieldCheck, Utensils } from "lucide-react";
import { SectionHeading } from "@/src/components/site/SectionHeading";

const SECTORS = [
  { title: "Contact Centre Operations", icon: Headphones },
  { title: "Business Administration", icon: Briefcase },
  { title: "Information Technology (IT)", icon: Cpu },
  { title: "General Security Practices", icon: ShieldCheck },
  { title: "Hospitality", icon: Utensils },
];

export default function SectorsSection() {
  return (
    <section id="sectors" className="scroll-anchor border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <SectionHeading
          eyebrow="Focus Sectors"
          title="Where we place and train."
          intro="Our primary target industries — chosen for sustained demand, accreditation pathways, and real entry-level absorption across Mpumalanga and South Africa."
          align="center"
        />

        <div className="mt-14 grid grid-cols-1 gap-px border border-ink/10 bg-ink/10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {SECTORS.map((sector, index) => {
            const Icon = sector.icon;
            return (
              <motion.div
                key={sector.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.45, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group flex flex-col justify-between gap-8 bg-white p-6 transition-colors duration-200 hover:bg-crimson-tint sm:p-7"
              >
                <Icon
                  className="h-10 w-10 text-crimson transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-11 sm:w-11"
                  strokeWidth={1.35}
                />
                <div>
                  <span className="label-eyebrow tabular-nums text-ink/35">0{index + 1}</span>
                  <h3 className="mt-2 font-heading text-[1.0625rem] font-bold leading-snug tracking-[-0.01em] text-ink">
                    {sector.title}
                  </h3>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
