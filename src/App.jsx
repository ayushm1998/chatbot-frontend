import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatbotIcon from "./components/ChatbotIcon";
import ChatHeaderIcon from "./components/ChatHeaderIcon";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import apiRequest from "./utils/apiRequest";
import { IoIosLogOut } from "react-icons/io";


import LoginForm from "./components/LoginForm";
import api from "./helper/apiURL.json"
import ReactMarkdown from "react-markdown";


const App = () => {
  const chatBodyRef = useRef();
  const [showChatbot, setShowChatbot] = useState(false);
  const [user, setUser] = useState(null);
  const [chatHistory, setChatHistory] = useState([
    {
      hideInChat: true,
      role: "assistant",
      content:
        "You are a chatbot for CSUS IPGE, assisting foreign students. Ignore unrelated queries. If student id is not provided, get their studentid name from getStudentId function from tools and then greet  'Thank you! {Name} Let me assist you now Please confirm your Student id.' Use tools for queries like visa status or admission status; otherwise, provide general info. Respond in natural language. Redirect unsupported queries to IPGE staff. Clarify unclear queries and handle one at a time.",
    },
  ]);

  // Function to generate bot response
  const generateBotResponse = async (history) => {
    const updateHistory = (content, isError = false) => {
      setChatHistory((prev) => [
        ...prev.filter((msg) => msg.content !== "Thinking..."),
        { role: "assistant", content, isError },
      ]);
    };

    history = history.map(({ role, content }) => ({ role, content }));
    try {
      const response = await apiRequest(
        api.URL.openai,
        "POST",
        {history,user}
      );
      console.log(response)
      updateHistory(response.data.data);
    } catch (error) {
      updateHistory(error.message, true);
    }
  };

  // Logout function: clear local storage, reset state, and optionally clear backend cookie
  const handleLogout = async () => {
    try {
      // Optionally, hit a logout endpoint to clear the cookie on the server.
      await axios.post(api.URL.logout, {});
    } catch (err) {
      console.error("Error during logout:", err);
    }
    // Remove token from localStorage and reset user state.
    localStorage.removeItem("token");
    setUser(null);
    setChatHistory([
      {
        hideInChat: true,
        role: "assistant",
        content:
          "You are a chatbot for CSUS IPGE, assisting foreign students. Always request their Student ID before proceeding and ignore unrelated queries. If not provided, ask: 'Please provide your Student ID before I assist you.' Acknowledge when received: 'Thank you! Let me assist you now.' Use tools for queries like visa status or admission status; otherwise, provide general info. Respond in natural language. Redirect unsupported queries to IPGE staff. Clarify unclear queries and handle one at a time.",
      },
    ]);
  
    // Close chatbot UI
    setShowChatbot(false);

  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ token });
    }
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTo({
        top: chatBodyRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [chatHistory]);

  // If not logged in, display the login form.
  if (!user) {
    return <LoginForm setUser={setUser} />;
  }

  return (
    <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
      <button onClick={() => setShowChatbot((prev) => !prev)} id="chatbot-toggler">
        <span className="material-symbols-rounded">mode_comment</span>
        <span className="material-symbols-rounded">close</span>
      </button>
      <div className="chatbot-popup">
        {/* Chatbot Header */}
        <div className="chat-header">
          <div className="header-info">
            <ChatHeaderIcon />
            <h2 className="logo-text">Hornet Chat Assistant</h2>
          </div>
          {/* Logout Button */}
          <button onClick={handleLogout} className="logout-button">
          <IoIosLogOut />
          </button>
          <button onClick={() => setShowChatbot((prev) => !prev)} className="material-symbols-rounded">
            keyboard_arrow_down
          </button>
        </div>
        {/* Chatbot Body */}
        <div ref={chatBodyRef} className="chat-body">
          <div className="message bot-message">
            <ChatbotIcon />
            <p className="message-text">
              Hey there <br /> How can I help you today?
            </p>
          </div>
          {chatHistory.map((chat, index) => (
            <ChatMessage key={index} chat={chat} />
          ))}
        </div>
        {/* Chatbot Footer */}
        <div className="chat-footer">
          <ChatForm
            chatHistory={chatHistory}
            setChatHistory={setChatHistory}
         generateBotResponse={generateBotResponse}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
