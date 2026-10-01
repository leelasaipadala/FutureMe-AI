"use client";

import { useState, useRef, useEffect } from "react";
import { MarkdownMessage } from "@/components/MarkdownMessage";
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Loader2,
  Bot,
  User,
} from "lucide-react";

type Message = {
  role: "user" | "model";
  text: string;
};

const STARTER_MESSAGE: Message = {
  role: "model",
  text: "Hi! I'm your FutureMe AI coach 👋 I can help you think through your goals, habits, career decisions, or life scenarios. What's on your mind?",
};

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([STARTER_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const { sendChatMessage } = await import("@/app/actions/chat");
      const history = messages.slice(1);
      const result = await sendChatMessage(userMessage, history);

      setMessages((prev) => [
        ...prev,
        { role: "model", text: result.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 md:right-8 z-50 w-[90vw] max-w-[400px] flex flex-col rounded-3xl shadow-2xl border border-border/60 overflow-hidden bg-white animate-in slide-in-from-bottom-5 fade-in duration-300"
          style={{ height: "600px", maxHeight: "80vh" }}>
          
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-5 py-4 bg-gradient-to-r from-primary to-emerald-500 text-white shrink-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm border border-white/20 shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-sm tracking-wide">FutureMe AI Coach</p>
                <p className="text-[10px] font-semibold text-white/80 uppercase tracking-wider mt-0.5">Your AI Life Coach</p>
              </div>
            </div>
            <button
              className="h-8 w-8 rounded-xl text-white hover:bg-white/20 flex items-center justify-center transition-colors relative z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar bg-slate-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 items-end ${msg.role === "user" ? "flex-row-reverse" : ""}`}
              >
                {/* Avatar */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border ${
                  msg.role === "user"
                    ? "bg-primary text-white border-primary/20"
                    : "bg-white text-primary border-border"
                }`}>
                  {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary text-white rounded-br-sm"
                      : "bg-white text-foreground border border-border rounded-bl-sm"
                  }`}
                >
                  {msg.role === "user" ? (
                    <span>{msg.text}</span>
                  ) : (
                    <MarkdownMessage text={msg.text} />
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 items-end">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-white text-primary shadow-sm border border-border">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-border shadow-sm rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-1.5 h-1.5 bg-primary/80 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-2" />
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div className="px-5 pb-3 bg-slate-50/50 flex flex-wrap gap-2 shrink-0">
              {["Reach my goals faster?", "Improve my habits", "Plan my finances"].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInput(prompt); }}
                  className="text-xs font-bold bg-white hover:bg-primary/5 text-primary px-3 py-1.5 rounded-xl border border-primary/20 shadow-sm transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input Bar */}
          <div className="p-4 bg-white border-t border-border flex gap-3 items-center shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask your AI coach..."
              className="flex-1 bg-muted/30 border border-border text-sm h-11 px-4 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
              disabled={isLoading}
            />
            <button
              className="h-11 w-11 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-sm flex items-center justify-center shrink-0 transition-all disabled:opacity-50 disabled:pointer-events-none"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={`fixed bottom-6 right-6 md:right-8 z-50 w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 border ${
          isOpen
            ? "bg-white text-foreground border-border hover:bg-muted/50 scale-95"
            : "bg-primary text-white border-primary/20 hover:bg-primary/90 hover:scale-105 hover:shadow-primary/30 hover:rotate-3"
        }`}
        aria-label="Open AI Chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </>
  );
}
