import { useState, useCallback } from "react";

export function useChatStream() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = useCallback(async (userInput) => {
    const userMessage = { role: "user", content: userInput };
    const updatedMessages = [...messages, userMessage];

    setMessages([...updatedMessages, { role: "assistant", content: "" }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.replace("data: ", "").trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              assistantText += parsed.text;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: "assistant",
                  content: assistantText,
                };
                return updated;
              });
            }
          } catch {}
        }
      }
    } catch (err) {
      console.error("Erreur:", err);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "❌ Une erreur est survenue. Veuillez réessayer.",
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return { messages, isLoading, sendMessage };
}