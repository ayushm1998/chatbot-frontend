import ChatbotIcon from "./ChatbotIcon";
import ReactMarkdown from "react-markdown";

const ChatMessage = ({ chat }) => {
  return (
    !chat.hideInChat && (
      <div className={`message ${chat.role === "assistant" ? "bot" : "user"}-message ${chat.isError ? "error" : ""}`}>
        {chat.role === "assistant" && <ChatbotIcon />} 
       

        <p className="message-text"> <ReactMarkdown>{chat.content}</ReactMarkdown>
        </p>
      </div>
    )
  );
};
export default ChatMessage;