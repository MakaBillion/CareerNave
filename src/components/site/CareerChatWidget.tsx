import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Loader2, MessageSquare, RotateCcw, Send, X } from "lucide-react";

type ChatRoleId = "learner" | "employer" | "provider";

interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  roleLabel?: string;
}

const ROLES: {
  id: ChatRoleId;
  label: string;
  title: string;
  welcome: string;
  prompts: string[];
}[] = [
  {
    id: "learner",
    label: "Learner",
    title: "Learner Pathway Advisor",
    welcome:
      "Ask about accredited learnerships, internships, Work-Integrated Learning (WIL), or our five focus sectors.",
    prompts: [
      "What focus sectors does CareerNave train in?",
      "How does Work-Integrated Learning (WIL) work?",
      "How do I get in touch to apply?",
    ],
  },
  {
    id: "employer",
    label: "Employer",
    title: "Employer & Incentives Specialist",
    welcome:
      "Ask about zero-payroll-cost hosting, virtual or remote placements, B-BBEE points, and SARS Section 12H rebates.",
    prompts: [
      "Can we host learnerships without physical office space?",
      "How do SARS Section 12H rebates and B-BBEE points work?",
      "What does zero-payroll-cost hosting mean?",
    ],
  },
  {
    id: "provider",
    label: "SETA / QCTO",
    title: "SETA & QCTO Coordinator",
    welcome:
      "Ask about QCTO-aligned curriculum delivery, SETA Discretionary Grants, and coverage across all 21 SETAs.",
    prompts: [
      "Which SETAs does CareerNave work across?",
      "How does CareerNave support QCTO training providers?",
      "How do SETA Discretionary Grants align with your programmes?",
    ],
  },
];

export default function CareerChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeRole, setActiveRole] = useState<ChatRoleId>("learner");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  const threadEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const currentRole = ROLES.find((r) => r.id === activeRole) ?? ROLES[0];

  useEffect(() => {
    if (isOpen) {
      threadEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending, isOpen]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const sendMessage = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed || isSending) return;

    setError("");
    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      role: "user",
      text: trimmed,
    };

    const historyPayload = messages.map((m) => ({
      role: m.role,
      text: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          role: activeRole,
          history: historyPayload,
        }),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || typeof data?.reply !== "string") {
        throw new Error(data?.error || "Unable to get a response right now.");
      }

      const modelMsg: ChatMessage = {
        id: `${Date.now()}-model`,
        role: "model",
        text: data.reply,
        roleLabel: currentRole.title,
      };
      setMessages((prev) => [...prev, modelMsg]);
    } catch (err) {
      const errMessage =
        err instanceof Error ? err.message : "Unable to reach the CareerNave assistant.";
      setError(errMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const handleClear = () => {
    setMessages([]);
    setError("");
    inputRef.current?.focus();
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open CareerNave assistant chat"
          className="fixed bottom-4 right-4 z-40 inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full bg-ink px-4 text-xs font-semibold text-white shadow-[0_12px_30px_-10px_rgba(10,10,10,0.45)] transition-colors duration-150 hover:bg-crimson focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson sm:bottom-6 sm:right-6"
        >
          <MessageSquare className="h-4 w-4 text-crimson transition-colors group-hover:text-white" />
          <span>Ask CareerNave</span>
        </button>
      )}

      {isOpen && (
        <section
          aria-label="CareerNave Assistant Chat"
          className="fixed bottom-4 right-4 z-50 flex max-h-[calc(100vh-5.5rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-lg border border-ink/15 bg-white shadow-2xl sm:bottom-6 sm:right-6 sm:w-[400px]"
        >
          <header className="border-b border-ink/10 bg-white px-4 py-3.5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="label-eyebrow text-crimson">CareerNave Advisor</p>
                <h2 className="mt-0.5 font-heading text-sm font-bold text-ink">
                  {currentRole.title}
                </h2>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear conversation"
                    title="Clear conversation"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-crimson"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 items-center justify-center rounded-md text-ink/55 transition-colors hover:bg-ink/5 hover:text-ink focus-visible:outline-2 focus-visible:outline-crimson"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div
              role="tablist"
              aria-label="Select advisor role"
              className="mt-3 grid grid-cols-3 gap-1 rounded-md bg-neutral-100 p-1"
            >
              {ROLES.map((role) => {
                const selected = role.id === activeRole;
                return (
                  <button
                    key={role.id}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => {
                      setActiveRole(role.id);
                      setError("");
                    }}
                    className={`truncate rounded px-2 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                      selected
                        ? "bg-white text-ink shadow-xs"
                        : "text-ink/60 hover:text-ink"
                    }`}
                  >
                    {role.label}
                  </button>
                );
              })}
            </div>
          </header>

          <div className="flex-1 space-y-3.5 overflow-y-auto bg-white px-4 py-4">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <p className="text-sm leading-relaxed text-ink/70">{currentRole.welcome}</p>
                <div className="space-y-2 border-t border-ink/10 pt-3">
                  <p className="label-eyebrow text-ink/40">Suggested questions</p>
                  <div className="flex flex-col gap-2">
                    {currentRole.prompts.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => void sendMessage(prompt)}
                        className="rounded-md border border-ink/12 bg-neutral-50 px-3 py-2 text-left text-xs font-medium leading-snug text-ink/80 transition-colors hover:border-crimson/40 hover:bg-crimson-tint hover:text-ink focus-visible:outline-2 focus-visible:outline-crimson"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
                  >
                    {!isUser && msg.roleLabel && (
                      <span className="mb-1 text-[0.6875rem] font-medium text-ink/45">
                        CareerNave · {msg.roleLabel}
                      </span>
                    )}
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3.5 py-2.5 text-sm leading-relaxed ${
                        isUser
                          ? "bg-ink text-white"
                          : "border border-ink/10 bg-neutral-50 text-ink"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                );
              })
            )}

            {isSending && (
              <div className="flex items-center gap-2 text-xs text-ink/55">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-crimson" />
                <span>Thinking...</span>
              </div>
            )}

            {error && (
              <p
                role="alert"
                className="rounded-md border border-crimson/30 bg-crimson-tint px-3 py-2 text-xs font-medium text-crimson"
              >
                {error}
              </p>
            )}

            <div ref={threadEndRef} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-end gap-2 border-t border-ink/10 bg-white p-3"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask ${currentRole.label.toLowerCase()} advisor...`}
              aria-label="Chat message"
              className="max-h-24 min-h-[42px] flex-1 resize-none rounded-md border border-ink/15 bg-white px-3 py-2.5 text-sm text-ink placeholder:text-ink/40 focus:border-crimson focus:outline-none focus:ring-2 focus:ring-crimson/15"
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              aria-label="Send message"
              className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-crimson text-white transition-colors duration-150 hover:bg-crimson-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crimson disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}
    </>
  );
}
