import React, { useState, useRef, useEffect } from "react";

const QuickHelp = () => {
  const [messages, setMessages] = useState([
    { type: "bot", text: "Welcome to QuickHelp! Get instant explanations ⚡" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages(prev => [...prev, { type: "user", text: input }]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { type: "bot", text: "Quick explanation: " + input },
      ]);
      setIsTyping(false);
    }, 800);
  };

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "linear-gradient(135deg, #fbf9f1, #fdfcf8)", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <header style={{
        padding: "1rem",
        textAlign: "center",
        fontSize: "1.7rem",
        fontWeight: "bold",
        background: "linear-gradient(135deg, #a18cd1, #fbc2eb)",
        color: "white",
        letterSpacing: "1px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        borderBottomLeftRadius: "12px",
        borderBottomRightRadius: "12px",
      }}>
        ⚡ QuickHelp
      </header>

      <div ref={chatboxRef} style={{ flex: 1, display: "flex", flexDirection: "column", padding: "1rem", overflowY: "auto", gap: "0.5rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{
            margin: "0.5rem 0",
            padding: "0.8rem 1rem",
            borderRadius: "12px",
            maxWidth: "70%",
            alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
            background: msg.type === "user" ? "linear-gradient(135deg, #42a5f5, #1e88e5)" : "#ddd9c5",
            color: msg.type === "user" ? "white" : "black",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            transform: "translateY(0)",
            opacity: 1,
            animation: index === 0 ? "" : `fadeInUp 0.5s ease forwards`,
            animationDelay: index === 0 ? "" : `${index * 0.1}s`,
            ...(msg.type === "bot" && index > 0 ? { animation: "floatBot 4s ease-in-out infinite" } : {}),
          }}>
            {msg.text}
          </div>
        ))}

        {isTyping && (
          <div style={{
            alignSelf: "flex-start",
            padding: "0.6rem 1rem",
            borderRadius: "12px",
            background: "#ddd9c5",
            color: "black",
            fontStyle: "italic",
            fontSize: "0.9rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
            animation: "floatBot 4s ease-in-out infinite",
          }}>
            Bot is typing...
          </div>
        )}
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ccc", padding: "0.5rem", background: "white", boxShadow: "0 -2px 10px rgba(0,0,0,0.05)" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: "0.7rem",
            border: "1px solid #ccc",
            borderRadius: "12px",
            outline: "none",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.05)",
            transition: "box-shadow 0.3s ease",
          }}
          onFocus={(e) => (e.target.style.boxShadow = "0 0 5px #42a5f5")}
          onBlur={(e) => (e.target.style.boxShadow = "inset 0 2px 4px rgba(0,0,0,0.05)")}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "0.5rem",
            padding: "0.7rem 1.2rem",
            border: "none",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #f4b30c, #f4a700)",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transition: "transform 0.2s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        >
          Send
        </button>
      </div>

      <style>
        {`
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }

          @keyframes floatBot {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-6px); }
          }
        `}
      </style>
    </div>
  );
};

export default QuickHelp;