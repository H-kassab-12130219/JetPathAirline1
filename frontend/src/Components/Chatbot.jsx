import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaRobot, FaTimes, FaPaperPlane } from "react-icons/fa";
import AuthContext from "../Contexts/AuthContext";

const Chatbot = () => {
  // Load initial state from sessionStorage
  const getInitialOpenState = () => {
    const saved = sessionStorage.getItem('chatbotOpen');
    return saved === 'true';
  };

  const getInitialMessages = () => {
    const saved = sessionStorage.getItem('chatbotMessages');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error parsing chatbot messages:', e);
      }
    }
    return [
      {
        role: "assistant",
        content: "Hello! I'm your flight assistant. I can help you find flights. Try asking: 'Find me the cheapest flight from Beirut to Turkey' or 'Show me flights to Paris under $500'",
      },
    ];
  };

  const [isOpen, setIsOpen] = useState(getInitialOpenState);
  const [messages, setMessages] = useState(getInitialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const { Flights, Locations, CreateToast } = useContext(AuthContext);

  // Save open state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem('chatbotOpen', isOpen.toString());
  }, [isOpen]);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    sessionStorage.setItem('chatbotMessages', JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/api/chatbot/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          flights: Flights,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message,
            flights: data.flights || null,
          },
        ]);

        // If flights were found, trigger search in dashboard
        if (data.flights && data.flights.length > 0 && data.searchParams) {
          // Store search parameters for dashboard
          if (data.searchParams.destination) {
            sessionStorage.setItem("searchDestination", data.searchParams.destination);
          }
          if (data.searchParams.date) {
            sessionStorage.setItem("searchDepartureDate", data.searchParams.date);
          }
          if (data.searchParams.budget) {
            sessionStorage.setItem("searchBudget", data.searchParams.budget);
          }
          if (data.searchParams.tripType) {
            sessionStorage.setItem("searchTripType", data.searchParams.tripType);
          }
          
          // Navigate to dashboard if not already there, or refresh if already on dashboard
          const currentPath = window.location.pathname;
          if (currentPath !== "/dashboard") {
            navigate("/dashboard");
          } else {
            // Keep chatbot open and trigger a page refresh to reload the dashboard with new search params
            // The chatbot state will be preserved via sessionStorage
            window.location.reload();
          }
        }
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.message || "I'm sorry, I couldn't process your request. Please try again.",
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full shadow-2xl flex items-center justify-center z-50 transition-all duration-300 hover:scale-110"
          aria-label="Open chatbot"
        >
          <FaRobot className="text-2xl" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaRobot className="text-white text-xl" />
              <h3 className="text-white font-semibold">Flight Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Close chatbot"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-950">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === "user"
                      ? "bg-red-600 text-white"
                      : "bg-slate-800 text-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.flights && msg.flights.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-white/20">
                      <p className="text-xs font-semibold mb-1">Found {msg.flights.length} flight(s):</p>
                      {msg.flights.slice(0, 3).map((flight, idx) => (
                        <div key={idx} className="text-xs bg-white/10 p-2 rounded mb-1">
                          <p className="font-semibold">
                            {flight.departureLocation} → {flight.arrivalLocation}
                          </p>
                          <p>${flight.price} • {flight.roundTrip}</p>
                        </div>
                      ))}
                      {msg.flights.length > 3 && (
                        <p className="text-xs italic">...and {msg.flights.length - 3} more</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 text-gray-100 rounded-2xl p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about flights..."
                className="flex-1 bg-slate-800 text-white rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl px-4 py-2 transition-colors"
              >
                <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;

