import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import Logo from "@/src/components/site/Logo";
import ScrollProgress from "@/src/components/site/ScrollProgress";

const NAV = [
  { label: "About Us", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Focus Sectors", href: "#sectors" },
  { label: "SETAs", href: "#setas" },
  { label: "Contact", href: "#contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV.map((item) => document.querySelector(item.href)).filter(
      (el): el is Element => el !== null
    );
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-200 ${
        scrolled || open
          ? "border-ink/10 bg-white/95 backdrop-blur-md"
          : "border-transparent bg-white/85 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-5 sm:h-20 sm:px-8">
        <Logo />

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {NAV.map((item) => {
            const isActive = active === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "true" : undefined}
                className={`group relative shrink-0 whitespace-nowrap py-1 text-[0.8125rem] font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-crimson ${
                  isActive ? "text-ink" : "text-ink/70 hover:text-ink"
                }`}
              >
                {item.label}
                <span
                  className={`absolute inset-x-0 -bottom-1 h-px origin-left bg-crimson transition-transform duration-200 ${
                    isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href="#contact"
            className="hidden shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-crimson px-5 py-2.5 text-[0.8125rem] font-semibold text-white transition-colors duration-150 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson lg:inline-flex"
          >
            Get in Touch
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mr-2 flex h-11 w-11 items-center justify-center text-ink focus-visible:outline-2 focus-visible:outline-crimson lg:hidden"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink/10 bg-white lg:hidden">
          <nav className="flex flex-col px-5 py-2 sm:px-8" aria-label="Mobile navigation">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`border-b border-ink/10 py-3.5 text-sm font-medium last:border-0 ${
                  active === item.href ? "text-crimson" : "text-ink/80"
                }`}
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="my-4 inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-full bg-crimson px-6 py-3 text-sm font-semibold text-white"
            >
              Get in Touch
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        </div>
      )}

      <ScrollProgress />
    </header>
  );
}
