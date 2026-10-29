
import { useState, useRef, useEffect } from "react";
import { X, Send, Trash2, Loader2, MessageCircle, Headset } from "lucide-react";
import chatImg from "@/assets/chat.jpeg";
import { chatWithAI, type ChatMessage } from "@/lib/chat.functions";

type Step = "name" | "email" | "question" | "ai_chat";
type DisplayMessage = {
    role: "bot" | "user";
    text: string;
    id: string;
};

const WELCOME_MESSAGE =
    "Hi 👋 Welcome to Yupoosuha! What's your name?";

const CONTACT_MESSAGE =
    "✅ Thank you! Our expert will contact you shortly. 📞 You can also call us at +91 97411 23546.";

export function LiveChatWidget() {
    const [open, setOpen] = useState(false);
    const [step, setStep] = useState<Step>("name");
    const [messages, setMessages] = useState<DisplayMessage[]>([
        { id: "welcome", role: "bot", text: WELCOME_MESSAGE },
    ]);
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        question: "",
    });
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const messageId = useRef(0);

    const addMessage = (role: "bot" | "user", text: string) => {
        messageId.current += 1;
        const newMessage: DisplayMessage = {
            id: `message-${messageId.current}`,
            role,
            text,
        };
        setMessages((prev) => [...prev, newMessage]);
    };

    // Keep scrolling inside the message area, not the entire page.
    useEffect(() => {
        const element = scrollRef.current;
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth",
            });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (open) {
            inputRef.current?.focus();
        }
    }, [open]);

    const processAIQuery = async (message: string) => {
        setIsTyping(true);

        try {
            const result = await chatWithAI({
                data: {
                    message,
                    history,
                },
            });

            const answer =
                typeof result?.text === "string" && result.text.trim()
                    ? result.text.trim()
                    : "I'm sorry, I couldn't generate a response. Please try again.";

            addMessage("bot", answer);

            setHistory((prev) => [
                ...prev,
                { role: "user", parts: [{ text: message }] },
                { role: "model", parts: [{ text: answer }] },
            ]);
        } catch (error: unknown) {
            console.error("Yupoosuha chat request failed:", error);

            addMessage(
                "bot",
                "I'm sorry, I'm unable to connect to the AI assistant right now. Please try again later."
            );
        } finally {
            setIsTyping(false);

            // Always show the contact message after every AI response or error.
            addMessage("bot", CONTACT_MESSAGE);
        }
    };

    const handleSend = async () => {
        const userMessage = input.trim();

        if (!userMessage || isTyping) return;

        setInput("");
        addMessage("user", userMessage);

        if (step === "name") {
            setForm((prev) => ({ ...prev, name: userMessage }));
            setStep("email");
            addMessage("bot", "Nice to meet you! 😊 What's your email address?");
            return;
        }

        if (step === "email") {
            const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userMessage);

            if (!emailIsValid) {
                addMessage("bot", "Please enter a valid email address.");
                setInput(userMessage);
                return;
            }

            setForm((prev) => ({ ...prev, email: userMessage }));
            setStep("question");
            addMessage(
                "bot",
                "Great! Please tell us your question about stocks or finance."
            );
            return;
        }

        if (step === "question") {
            setForm((prev) => ({ ...prev, question: userMessage }));
            setStep("ai_chat");
            await processAIQuery(userMessage);
            return;
        }

        await processAIQuery(userMessage);
    };

    const clearChat = () => {
        if (isTyping) return;

        setMessages([
            {
                id: "welcome-reset",
                role: "bot",
                text: "Chat cleared! 👋 How can I help you today?",
            },
        ]);
        setHistory([]);
        setStep("ai_chat");
        setInput("");
        inputRef.current?.focus();
    };

    return (
        <>
            {/* Floating launcher */}
            {!open && (
                <button
                    type="button"
                    onClick={() => setOpen(true)}
                    aria-label="Open Yupoosuha AI chat"
                    className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-white/10 bg-zinc-950 p-2 pr-5 text-white shadow-2xl shadow-black/30 transition hover:scale-105 hover:border-emerald-400/50"
                >
                    <span className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-emerald-400">
                        <img
                            src={chatImg}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                        <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-zinc-950 bg-emerald-400" />
                    </span>
                    <span className="text-left">
                        <span className="block text-sm font-semibold">Need help?</span>
                        <span className="block text-xs text-zinc-400">
                            Chat with our AI
                        </span>
                    </span>
                </button>
            )}

            {/* Fixed-size chat window */}
            {open && (
                <section
                    role="dialog"
                    aria-label="Yupoosuha AI Assistant"
                    className="fixed bottom-4 right-3 z-50 flex h-[min(600px,calc(100dvh-32px))] w-[calc(100vw-24px)] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 text-white shadow-2xl shadow-black/40 sm:bottom-6 sm:right-6"
                >
                    {/* Header */}
                    <header className="flex shrink-0 items-center justify-between border-b border-white/10 bg-zinc-900 px-4 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-400 text-zinc-950">
                                <MessageCircle size={23} />
                            </div>
                            <div className="min-w-0">
                                <h2 className="truncate text-sm font-bold">
                                    Yupoosuha Assistant
                                </h2>
                                <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                                    Stock market & finance support
                                </p>
                            </div>
                        </div>

                        <div className="ml-2 flex shrink-0 items-center gap-1">
                            <button
                                type="button"
                                onClick={clearChat}
                                disabled={isTyping}
                                aria-label="Clear chat"
                                title="Clear chat"
                                className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-red-400 disabled:opacity-40"
                            >
                                <Trash2 size={17} />
                            </button>
                            <button
                                type="button"
                                onClick={() => setOpen(false)}
                                aria-label="Close chat"
                                className="rounded-xl p-2 text-zinc-400 transition hover:bg-white/10 hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>
                    </header>

                    {/* Scrollable messages: only this section scrolls */}
                    <div
                        ref={scrollRef}
                        aria-live="polite"
                        className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-zinc-950 px-4 py-5 [scrollbar-width:thin] [scrollbar-color:#3f3f46_transparent]"
                    >
                        <div className="mx-auto w-fit rounded-full border border-white/10 bg-zinc-900 px-3 py-1 text-[10px] font-medium uppercase tracking-widest text-zinc-500">
                            Today · Yupoosuha Support
                        </div>

                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                            >
                                {msg.role === "bot" && (
                                    <div className="mb-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                        <Headset size={15} />
                                    </div>
                                )}

                                <div
                                    className={`max-w-[84%] whitespace-pre-wrap break-words rounded-2xl px-3.5 py-3 text-[13px] leading-relaxed ${msg.role === "user"
                                            ? "rounded-br-md bg-emerald-400 font-medium text-zinc-950"
                                            : "rounded-bl-md border border-white/[0.07] bg-zinc-900 text-zinc-200"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex items-end gap-2">
                                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
                                    <Headset size={15} />
                                </div>
                                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-white/[0.07] bg-zinc-900 px-4 py-3 text-xs text-zinc-400">
                                    <Loader2 size={14} className="animate-spin text-emerald-400" />
                                    Thinking...
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input stays fixed at the bottom */}
                    <footer className="shrink-0 border-t border-white/10 bg-zinc-900 p-3">
                        <div className="flex items-end gap-2 rounded-2xl border border-white/10 bg-zinc-950 p-2 transition focus-within:border-emerald-400/50">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(event) => setInput(event.target.value)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" && !event.shiftKey) {
                                        event.preventDefault();
                                        void handleSend();
                                    }
                                }}
                                disabled={isTyping}
                                placeholder={
                                    step === "name"
                                        ? "Enter your name..."
                                        : step === "email"
                                            ? "Enter your email..."
                                            : "Ask about stocks or finance..."
                                }
                                aria-label="Type your message"
                                rows={1}
                                className="max-h-24 min-h-10 flex-1 resize-y bg-transparent px-2 py-2 text-sm text-white outline-none placeholder:text-zinc-600 disabled:opacity-60"
                            />

                            <button
                                type="button"
                                onClick={() => void handleSend()}
                                disabled={isTyping || !input.trim()}
                                aria-label="Send message"
                                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-400 text-zinc-950 transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {isTyping ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>

                        <p className="mt-2 text-center text-[10px] text-zinc-600">
                            AI responses may be inaccurate. Verify financial information.
                        </p>
                    </footer>
                </section>
            )}
        </>
    );
}

export default LiveChatWidget;
