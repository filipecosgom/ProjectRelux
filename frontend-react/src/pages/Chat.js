import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import webSocketService from "../services/websocketService";
import "./Chat.css";

const Chat = ({ loggedInUser }) => {
  const { username } = useParams(); // Obtém o destinatário da URL
  const [message, setMessage] = useState(""); // Estado para a mensagem digitada
  const [messages, setMessages] = useState([]); // Estado para as mensagens do chat
  const [recipient, setRecipient] = useState(username); // Define o destinatário inicial como o username da URL

  useEffect(() => {
    console.log("Conectando ao WebSocket com usuário logado:", loggedInUser);
    webSocketService.connect(loggedInUser); // Conecta ao WebSocket como o usuário logado

    webSocketService.onMessage((data) => {
      console.log("Nova mensagem recebida:", data);

      // Remove o prefixo "recipient:" da mensagem recebida, se existir
      const formattedMessage = data.includes(":")
        ? data.split(":")[1].trim()
        : data;

      setMessages((prevMessages) => [...prevMessages, formattedMessage]);
    });

    return () => {
      console.log("Desconectando do WebSocket...");
      webSocketService.disconnect();
    };
  }, [loggedInUser]);

  const handleSendMessage = () => {
    if (message.trim() && recipient.trim()) {
      console.log("Enviando mensagem para:", recipient);
      webSocketService.sendMessage(recipient, message);
      setMessages((prevMessages) => [...prevMessages, `Você: ${message}`]);
      setMessage("");
    } else {
      console.warn("Mensagem ou destinatário vazio. Mensagem não enviada.");
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-users">
        <h3>Usuários</h3>
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
