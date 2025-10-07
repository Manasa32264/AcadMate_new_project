import React, { useState, useRef, useEffect } from "react";
import "./ChatbotHub.css";

const ChatbotHub = () => {
  const [activeMode, setActiveMode] = useState("eduboat");
  const [messages, setMessages] = useState({
    quickhelp: [{ type: "bot", text: "Welcome to QuickHelp! Get instant explanations ⚡" }],
    examprep: [{ type: "bot", text: "Welcome to ExamPrep! Get exam-ready answers ✍️" }],
    deepdive: [{ type: "bot", text: "Welcome to DeepDive! Explore concepts thoroughly 🌊" }]
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatboxRef = useRef(null);
  const [selectedMarks, setSelectedMarks] = useState(5);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, isTyping, activeMode]);

  // Function to format the answer text with proper styling
  const formatAnswer = (text) => {
    if (!text) return null;

    // Split by double asterisks for bold sections (headers)
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    
    return (
      <div className="formatted-answer">
        {parts.map((part, index) => {
          // Check if it's a bold section
          if (part.startsWith('**') && part.endsWith('**')) {
            const content = part.slice(2, -2);
            return (
              <div key={index} className="answer-heading">
                {content}
              </div>
            );
          }
          
          // Check if it's a bullet point section (starts with ***)
          if (part.includes('***')) {
            const lines = part.split('\n').filter(line => line.trim());
            return (
              <div key={index} className="bullet-section">
                {lines.map((line, i) => {
                  if (line.trim().startsWith('***')) {
                    const content = line.replace(/^\*\*\*/, '').trim();
                    const [title, ...rest] = content.split(':');
                    return (
                      <div key={i} className="bullet-item">
                        <span className="bullet-title">{title}:</span>
                        <span className="bullet-content">{rest.join(':')}</span>
                      </div>
                    );
                  }
                  return <p key={i} className="answer-text">{line}</p>;
                })}
              </div>
            );
          }
          
          // Regular paragraphs
          const paragraphs = part.split('\n').filter(p => p.trim());
          return (
            <div key={index}>
              {paragraphs.map((para, i) => (
                <p key={i} className="answer-text">{para}</p>
              ))}
            </div>
          );
        })}
      </div>
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const questionText = input;
    setMessages(prev => ({
      ...prev,
      [activeMode]: [...prev[activeMode], { type: "user", text: questionText }]
    }));
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questionText,
          marks: selectedMarks,
          top_k: 5,
          temperature: 0.3
        })
      });

      const data = await response.json();

      setMessages(prev => ({
        ...prev,
        [activeMode]: [...prev[activeMode], { 
          type: "bot", 
          text: data.answer,
          formatted: true 
        }]
      }));

    } catch (error) {
      setMessages(prev => ({
        ...prev,
        [activeMode]: [...prev[activeMode], { 
          type: "bot", 
          text: `Error: ${error.message}`,
          formatted: false 
        }]
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getModeConfig = () => {
    switch (activeMode) {
      case "quickhelp":
        return { name: "⚡ QuickHelp" };
      case "examprep":
        return { name: "📘 ExamPrep" };
      case "deepdive":
        return { name: "🔍 DeepDive" };
      default:
        return { name: "🚢 AcadBoat" };
    }
  };

  const modeConfig = getModeConfig();
  const currentMessages = messages[activeMode] || [];

  if (activeMode === "eduboat") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <header className="text-center py-16 px-4">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            AcadBoat
          </h1>
          <p className="text-xl text-gray-600">Study made simple with smart support.</p>
        </header>

        <div className="max-w-6xl mx-auto px-4 pb-16">
          <div className="grid md:grid-cols-3 gap-6">
            <div 
              onClick={() => setActiveMode("quickhelp")}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-yellow-400"
            >
              <h3 className="text-2xl font-bold mb-3 text-yellow-600">⚡ QuickHelp</h3>
              <p className="text-gray-600">Quick explanations that make hard topics easy to understand.</p>
            </div>
            
            <div 
              onClick={() => setActiveMode("deepdive")}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-blue-400"
            >
              <h3 className="text-2xl font-bold mb-3 text-blue-600">🔍 DeepDive</h3>
              <p className="text-gray-600">Explore concepts deeply with clarity and precision.</p>
            </div>
            
            <div 
              onClick={() => setActiveMode("examprep")}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 border-2 border-transparent hover:border-purple-400"
            >
              <h3 className="text-2xl font-bold mb-3 text-purple-600">📘 ExamPrep</h3>
              <p className="text-gray-600">Structured notes and strategies to excel in exams.</p>
            </div>
          </div>
        </div>

        <footer className="text-center py-8 text-gray-500">✨ Happy learning!</footer>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-md px-6 py-4 flex items-center gap-4 border-b-2 border-indigo-200">
        <button 
          onClick={() => setActiveMode("eduboat")}
          className="text-2xl hover:bg-gray-100 p-2 rounded-lg transition-colors"
          title="Back to AcadBoat"
        >
          🏠
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{modeConfig.name}</h1>
          <p className="text-sm text-gray-600">
            {activeMode === "quickhelp" && "Get instant explanations for quick understanding"}
            {activeMode === "examprep" && "Structured answers and strategies for exam success"}
            {activeMode === "deepdive" && "Comprehensive explanations with detailed insights"}
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto p-4">
        <div ref={chatboxRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
          {currentMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                msg.type === 'user' 
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white' 
                  : 'bg-white shadow-md border border-gray-200'
              }`}>
                {msg.type === 'bot' && msg.formatted ? (
                  formatAnswer(msg.text)
                ) : (
                  <div className={msg.type === 'user' ? 'text-white' : 'text-gray-800'}>
                    {msg.text}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white shadow-md border border-gray-200 rounded-2xl px-5 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">Bot is typing</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-gray-200">
          <div className="flex gap-3 items-end">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your question..."
              className="flex-1 border-2 border-gray-300 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
              rows="2"
            />
            <select 
              value={selectedMarks} 
              onChange={(e) => setSelectedMarks(parseInt(e.target.value))}
              className="border-2 border-gray-300 rounded-xl px-4 py-3 bg-white focus:outline-none focus:border-indigo-500 transition-colors"
            >
              {[1,2,5,10,15,20].map(m => (
                <option key={m} value={m}>{m} marks</option>
              ))}
            </select>
            <button 
              onClick={sendMessage}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-105 shadow-md"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotHub;