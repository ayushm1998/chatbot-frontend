import { useRef } from "react";
const ChatForm = ({ chatHistory, setChatHistory, generateBotResponse }) => {
  const inputRef = useRef();
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const userMessage = inputRef.current.value.trim();
    if (!userMessage) return;
    inputRef.current.value = "";
    // Update chat history with the user's message
    setChatHistory((history) => [...history, { role: "user", content: userMessage }]);
    // Delay 600 ms before showing "Thinking..." and generating response
    setTimeout(() => {
      // Add a "Thinking..." placeholder for the bot's response
      setChatHistory((history) => [...history, { role: "assistant", content: "Thinking..." }]);
      // Call the function to generate the bot's response
      generateBotResponse([...chatHistory, { role: "user", content: `${userMessage}` }]);
    }, 600);
  };
  return (
    <form onSubmit={handleFormSubmit} className="chat-form">
      <input ref={inputRef} placeholder="Type your query here..." className="message-input" required />
      <button type="submit" id="send-message" className="material-symbols-rounded">
        arrow_upward
      </button>
    </form>
  );
};
export default ChatForm;