import Logo from "@/src/components/site/Logo";

const NAV = [
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Focus Sectors", href: "#sectors" },
  { label: "SETAs", href: "#setas" },
  { label: "Contact", href: "#contact" },
];

export default function SiteFooter() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_0.8fr_1fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-xs text-sm leading-[1.7] text-ink/60">
              From learning and training all the way to employment.
            </p>
            <div className="mt-6 h-[2px] w-10 bg-crimson" />
          </div>

          <nav className="flex flex-col gap-3" aria-label="Footer navigation">
            <span className="label-eyebrow text-ink/40">Navigate</span>
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="w-fit text-sm text-ink/75 transition-colors hover:text-crimson"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3">
            <span className="label-eyebrow text-ink/40">Business details</span>
            <p className="text-sm leading-[1.8] text-ink/75">
              <span className="font-semibold text-ink">CareerNave</span>
              <span className="mx-2 text-ink/25" aria-hidden="true">·</span>
              A Division of MBS Utilities (Pty) Ltd
              <br />
              Middelburg, Mpumalanga, South Africa
            </p>
            <a
              href="mailto:info@careernave.co.za"
              className="w-fit text-sm font-semibold text-crimson underline decoration-crimson/30 decoration-1 underline-offset-4 transition-colors hover:decoration-crimson"
            >
              info@careernave.co.za
            </a>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-ink/45">
            &copy; {new Date().getFullYear()} CareerNave. A Division of MBS Utilities (Pty) Ltd. All rights reserved.
          </p>
          <a
            href="#top"
            className="w-fit text-xs font-semibold uppercase tracking-[0.16em] text-ink/45 transition-colors hover:text-crimson"
          >
            Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
