import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import ResilientImage from "@/src/components/site/ResilientImage";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  return (
    <section id="top" className="relative border-b border-ink/10 pt-16 sm:pt-20">
      <div className="mx-auto grid max-w-6xl items-stretch gap-12 px-5 pb-16 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div className="flex flex-col justify-center">
          <motion.p {...fade(0)} className="label-eyebrow text-crimson">
            Workforce Development · Skills Training · Employment
          </motion.p>
          <motion.h1
            {...fade(0.08)}
            className="mt-6 text-balance font-heading text-[2.5rem] font-bold leading-[1.0] tracking-[-0.035em] text-ink sm:text-[3.5rem] lg:text-[4.25rem]"
          >
            From Learning and Training All the Way to{" "}
            <span className="relative inline-block text-crimson">
              Employment.
              <span className="absolute -bottom-1 left-0 h-[3px] w-full bg-crimson/20" />
            </span>
          </motion.h1>
          <motion.p
            {...fade(0.16)}
            className="mt-7 max-w-xl text-[1.0625rem] leading-[1.65] text-ink/70 sm:text-lg"
          >
            CareerNave is a workforce development, skills training, and employment platform designed to
            connect people to opportunities. Our main goal is to help address unemployment by connecting
            learners, training providers, employers, and government-funded skills development programmes.
          </motion.p>
          <motion.div {...fade(0.24)} className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="#contact"
              className="group inline-flex min-h-[44px] items-center gap-2.5 whitespace-nowrap rounded-full bg-crimson px-7 py-3.5 text-sm font-semibold text-white shadow-[0_10px_30px_-12px_rgba(211,63,67,0.65)] transition-all duration-150 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson"
            >
              Get in Touch
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="whitespace-nowrap py-2 text-sm font-semibold text-ink/75 underline decoration-ink/25 decoration-1 underline-offset-[6px] transition-colors duration-150 hover:text-crimson hover:decoration-crimson focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson"
            >
              See how the ecosystem works
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.985 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col"
        >
          <div className="relative aspect-[3/4] w-full overflow-hidden border border-ink/10 bg-ink/5 lg:aspect-auto lg:h-full lg:min-h-[460px]">
            <ResilientImage
              src="/src/assets/images/hero_training_lab_1794905473891.jpg"
              alt="A South African learner working attentively at a workstation in a modern information technology training laboratory"
              className="block h-full w-full"
            />
          </div>
          <div className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 border-b border-r border-crimson/50" />
        </motion.div>
      </div>
    </section>
  );
}
