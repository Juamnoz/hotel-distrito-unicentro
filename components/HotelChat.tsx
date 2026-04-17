"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface HotelChatProps {
  accent?: string;
  hotelName?: string;
  apiPath?: string;
}

const WELCOME: Message = {
  role: "assistant",
  content:
    "¡Hola! Soy el asistente de Hotel Distrito Unicentro. ¿En qué puedo ayudarte? Puedo informarte sobre nuestras habitaciones, servicios, ubicación o ayudarte a planear tu estadía.",
};

export default function HotelChat({
  accent = "#d0d0d0",
  hotelName = "Hotel Distrito Unicentro",
  apiPath = "/api/distrito-unicentro/chat",
}: HotelChatProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { role: "user", content: text };
    const history = [...messages, userMsg].filter((m) => m.role !== "assistant" || m !== WELCOME);
    // Build API messages (only user/assistant pairs, skip the static welcome if first)
    const apiMessages = [...messages.slice(1), userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantPlaceholder: Message = { role: "assistant", content: "" };
    setMessages((prev) => [...prev, assistantPlaceholder]);

    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!res.ok) throw new Error("Error del servidor");

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: "assistant", content: accumulated };
          return next;
        });
      }
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "assistant",
          content: "Lo siento, hubo un error. Por favor intenta de nuevo.",
        };
        return next;
      });
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div
      className="flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.09)",
        height: 520,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-5 py-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <Bot size={16} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Asistente</p>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
            {hotelName}
          </p>
        </div>
        <span
          className="ml-auto flex items-center gap-1.5 text-xs"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#4ade80" }}
          />
          En línea
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg, i) =>
          msg.role === "assistant" ? (
            <div key={i} className="flex items-start gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: "rgba(255,255,255,0.07)" }}
              >
                <Bot size={13} style={{ color: accent }} />
              </div>
              <div
                className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm leading-relaxed"
                style={{
                  background: "#1a1a1a",
                  color: "rgba(255,255,255,0.85)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                {msg.content || (
                  <span className="flex gap-1 items-center h-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div
                className="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm leading-relaxed"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
              >
                {msg.content}
              </div>
            </div>
          )
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div
          className="flex items-end gap-2 rounded-xl px-3 py-2"
          style={{ background: "#181818", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Escribe tu pregunta..."
            rows={1}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 resize-none outline-none"
            style={{ maxHeight: 100 }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-opacity"
            style={{
              background: input.trim() && !loading ? "#111111" : "rgba(255,255,255,0.05)",
              border: input.trim() && !loading ? "1px solid rgba(255,255,255,0.15)" : "1px solid transparent",
              opacity: input.trim() && !loading ? 1 : 0.4,
            }}
          >
            <Send size={14} style={{ color: input.trim() && !loading ? "#ffffff" : "#888" }} />
          </button>
        </div>
        <p className="text-center text-xs mt-2" style={{ color: "rgba(255,255,255,0.2)" }}>
          Enter para enviar · Shift+Enter para nueva línea
        </p>
      </div>
    </div>
  );
}
