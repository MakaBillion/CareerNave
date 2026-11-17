import { type ChangeEvent, type FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Loader2, Mail, MapPin } from "lucide-react";
import { SectionHeading } from "@/src/components/site/SectionHeading";

const EMAIL = "info@careernave.co.za";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
  name: string;
  email: string;
  message: string;
}

const EMPTY: FormState = { name: "", email: "", message: "" };

export default function ContactSection() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const update =
    (field: keyof FormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
      if (error) setError("");
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) {
      setError("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.length < 10) {
      setError("Please enter a message of at least 10 characters.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok || !data?.received) {
        throw new Error(data?.error || "Request failed");
      }
      setStatus("sent");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      const messageText =
        err instanceof Error && err.message && err.message !== "Request failed"
          ? err.message
          : `We could not send that message right now. Please email us directly at ${EMAIL}.`;
      setError(messageText);
    }
  };

  return (
    <section id="contact" className="scroll-anchor border-b border-ink/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's connect people to opportunity."
            intro="Whether you are a learner, an employer ready to host, a training provider, or a programme funder — tell us where you fit and we will take it from there."
          />

          <div className="mt-10 space-y-5">
            <a href={`mailto:${EMAIL}`} className="group flex items-start gap-4">
              <Mail className="mt-0.5 h-5 w-5 flex-none text-crimson" strokeWidth={1.5} />
              <span>
                <span className="label-eyebrow block text-ink/45">Email</span>
                <span className="mt-1 block font-heading text-lg font-semibold text-ink underline decoration-crimson/40 decoration-1 underline-offset-4 transition-colors group-hover:text-crimson group-hover:decoration-crimson">
                  {EMAIL}
                </span>
              </span>
            </a>
            <div className="flex items-start gap-4">
              <MapPin className="mt-0.5 h-5 w-5 flex-none text-crimson" strokeWidth={1.5} />
              <span>
                <span className="label-eyebrow block text-ink/45">Location</span>
                <span className="mt-1 block text-base text-ink/75">Middelburg, Mpumalanga, South Africa</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-ink/10 pt-10 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0">
          {status === "sent" ? (
            <div className="flex h-full flex-col justify-center py-6">
              <CheckCircle2 className="h-9 w-9 text-crimson" strokeWidth={1.5} />
              <h3 className="mt-6 font-heading text-2xl font-bold tracking-[-0.02em] text-ink">
                Thank you — message received.
              </h3>
              <p className="mt-3 max-w-sm text-base leading-[1.65] text-ink/65">
                A member of the CareerNave team will be in touch. For anything urgent, email us at{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-crimson underline underline-offset-4">
                  {EMAIL}
                </a>
                .
              </p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-8 min-h-[40px] self-start text-sm font-semibold text-ink/70 underline decoration-ink/25 underline-offset-4 hover:text-crimson"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7" noValidate>
              <div>
                <label htmlFor="name" className="label-eyebrow block text-ink/50">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                  className="mt-2 min-h-[44px] w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/35 focus:border-crimson focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label htmlFor="email" className="label-eyebrow block text-ink/50">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.co.za"
                  className="mt-2 min-h-[44px] w-full border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/35 focus:border-crimson focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label htmlFor="message" className="label-eyebrow block text-ink/50">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us how you would like to work with CareerNave"
                  className="mt-2 w-full resize-none border-0 border-b border-ink/20 bg-transparent px-0 py-3 text-base text-ink placeholder:text-ink/35 focus:border-crimson focus:outline-none focus:ring-0"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-crimson">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className="group inline-flex min-h-[46px] w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-crimson px-8 py-3.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[14rem]"
              >
                {status === "sending" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    Send Message
                    <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
