import { motion } from "motion/react";
import ResilientImage from "@/src/components/site/ResilientImage";
import { SectionHeading } from "@/src/components/site/SectionHeading";

const FACTS = [
  { label: "Operating entity", value: "MBS Utilities (Pty) Ltd" },
  { label: "Head office", value: "Middelburg, Mpumalanga" },
  { label: "Mandate", value: "Skills development & employment" },
];

export default function AboutSection() {
  return (
    <section id="about" className="scroll-anchor border-b border-ink/10 bg-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="order-2 lg:order-1"
          >
            <div className="relative overflow-hidden border border-ink/10 bg-ink/5">
              <ResilientImage
                src="/src/assets/images/about_training_centre_1794905471681.jpg"
                alt="The interior of a modern South African skills training centre with collaborative desks and glass classrooms"
                className="block aspect-[3/2] w-full"
              />
            </div>

            <dl className="mt-8 divide-y divide-ink/10 border-y border-ink/10">
              {FACTS.map((fact) => (
                <div key={fact.label} className="flex items-baseline justify-between gap-6 py-3.5">
                  <dt className="label-eyebrow text-ink/45">{fact.label}</dt>
                  <dd className="text-right text-sm font-semibold text-ink">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div className="order-1 lg:order-2">
            <SectionHeading
              eyebrow="About Us"
              title="A navigation system for South African talent."
              intro="CareerNave exists to close the distance between a qualification and a paycheque. Operating as a division of MBS Utilities (Pty) Ltd from Middelburg, Mpumalanga, we coordinate the full pathway — accredited training, workplace experience, and placement — across the people and institutions that make employment possible."
            />
            <div className="mt-8 space-y-5 text-base leading-[1.65] text-ink/65">
              <p>
                Unemployment in South Africa is rarely a shortage of ambition. It is a fragmentation problem:
                learners cannot find host employers, employers cannot access funded programmes, and training
                providers carry the administrative load of proving outcomes. CareerNave sits in the middle of
                that system and makes the connections explicit.
              </p>
              <p>
                Every engagement is aligned to accredited, QCTO and SETA-recognised frameworks, so the training
                our partners deliver counts where it matters — in a qualification, in a workplace, and on a
                payroll.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
