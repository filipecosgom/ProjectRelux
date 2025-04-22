import React, { useEffect, useState } from "react";
import webSocketService from "../services/websocketService";
import "./Chat.css";

const Chat = ({ username }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState("");

  useEffect(() => {
    // Conecta ao WebSocket ao carregar o componente
    webSocketService.connect(username);

    // Recebe mensagens
    webSocketService.onMessage((data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Desconecta ao desmontar o componente
    return () => {
      webSocketService.disconnect();
    };
  }, [username]);

  const handleSendMessage = () => {
    if (message.trim() && recipient.trim()) {
      webSocketService.sendMessage(recipient, message);
      setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
      setMessage("");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-users">
        <h3>Usuários</h3>
        {/* Lista de usuários com quem o usuário já conversou */}
        {/* Substituir por dados reais */}
        <ul>
          <li onClick={() => setRecipient("john")}>John</li>
          <li onClick={() => setRecipient("jane")}>Jane</li>
        </ul>
      </div>

      <div className="chat-window">
        <h3>Chat com {recipient || "..."}</h3>
        <div className="chat-messages">
          {messages.map((msg, index) => (
            <div key={index} className="chat-message">
              {msg}
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={handleSendMessage}>Enviar</button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
