import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizonal, Mic, MicOff } from "lucide-react";
import { cn } from "@/lib/utils";

export function ChatInput({ onSend, isLoading }) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const handleSend = () => {
    if (!value.trim() || isLoading) return;
    onSend(value.trim());
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Votre navigateur ne supporte pas la reconnaissance vocale.");
      return;
    }
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "fr-FR";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setValue(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  return (
    <div
      className="flex gap-2 p-4 backdrop-blur-md"
      style={{
        background: "var(--bg-input)",
        borderTop: "1px solid var(--border)",
      }}
    >
      <Button
        onClick={toggleVoice}
        variant="ghost"
        className={cn(
          "rounded-xl px-3 transition-all",
          isListening ? "text-red-400 animate-pulse" : ""
        )}
        style={{ color: isListening ? undefined : "var(--text-secondary)" }}
      >
        {isListening ? <MicOff size={18} /> : <Mic size={18} />}
      </Button>

      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isListening ? "Écoute en cours..." : "Posez votre question..."}
        disabled={isLoading}
        className="flex-1 rounded-xl border focus-visible:ring-indigo-500"
        style={{
          background: "var(--bg-card)",
          borderColor: "var(--border)",
          color: "var(--text-primary)",
        }}
      />

      <Button
        onClick={handleSend}
        disabled={!value.trim() || isLoading}
        className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 shadow-lg shadow-indigo-500/30"
      >
        <SendHorizonal size={18} />
      </Button>
    </div>
  );
}