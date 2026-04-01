import { useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Sun, Moon } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { useChatStream } from "@/lib/useChatStream";
import { useTheme } from "@/lib/useTheme";

export function ChatInterface() {
  const { messages, isLoading, sendMessage } = useChatStream();
  const { theme, toggleTheme } = useTheme();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 transition-colors duration-300"
      style={{ background: "var(--bg-main)" }}
    >
      {/* Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-300" style={{ background: "var(--blob1)" }} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl transition-colors duration-300" style={{ background: "var(--blob2)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-3xl" style={{ background: "var(--blob1)" }} />
      </div>

      {/* Fenêtre chat */}
      <div
        className="relative w-full max-w-2xl flex flex-col rounded-3xl overflow-hidden shadow-2xl backdrop-blur-xl transition-all duration-300"
        style={{
          height: "80vh",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center gap-3 px-6 py-4 backdrop-blur-md"
          style={{
            background: "var(--bg-header)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Ruphin</h1>
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>Assistant personalisé</p>
          </div>
          <Badge className="ml-auto bg-emerald-500/20 text-emerald-500 text-xs border border-emerald-500/30">
            En ligne
          </Badge>

          {/* Toggle thème */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-xl ml-2 transition-all hover:bg-white/10"
            style={{ color: "var(--text-secondary)" }}
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Bot size={32} className="text-indigo-400" />
              </div>
              <h2 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                Bonjour, je suis Ruphin IA 
              </h2>
              <p className="text-sm max-w-xs" style={{ color: "var(--text-secondary)" }}>
                Posez-moi vos questions, je répondrai uniquement sur la base des informations disponibles.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <ChatMessage key={i} message={msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          )}
        </div>

        {/* Input */}
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}