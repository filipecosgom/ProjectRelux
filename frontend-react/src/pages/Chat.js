import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import webSocketService from "../services/websocketService";
import "./Chat.css";

const Chat = ({ loggedInUser }) => {
  const { username } = useParams(); // Obtém o destinatário da URL
  const [message, setMessage] = useState(""); // Estado para a mensagem digitada
  const [messages, setMessages] = useState([]); // Estado para as mensagens do chat
  const [recipient, setRecipient] = useState(username); // Define o destinatário inicial como o username da URL
  const messagesEndRef = useRef(null); // Ref para o elemento final da lista de mensagens

  // Função para formatar a data e hora
  const formatTimestamp = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0"); // Mês começa em 0
    const year = now.getFullYear();
    const time = now.toLocaleTimeString("pt-PT"); // Formato HH:MM:SS
    return `${day}/${month}/${year} ${time}`;
  };

  useEffect(() => {
    console.log("Conectando ao WebSocket com usuário logado:", loggedInUser);
    webSocketService.connect(loggedInUser); // Conecta ao WebSocket como o usuário logado

    webSocketService.onMessage((data) => {
      console.log("Nova mensagem recebida:", data);

      // Divide a mensagem no formato "remetente:mensagem"
      const [sender, content] = data.includes(":")
        ? data.split(":").map((part) => part.trim())
        : [null, data];

      // Adiciona a mensagem ao estado, incluindo o remetente e a timestamp
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: sender || "Desconhecido",
          content,
          timestamp: formatTimestamp(), // Adiciona a data e hora
        },
      ]);
    });

    return () => {
      console.log("Desconectando do WebSocket...");
      webSocketService.disconnect();
    };
  }, [loggedInUser]);

  // Faz scroll para o final da lista de mensagens
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && recipient.trim()) {
      console.log("Enviando mensagem para:", recipient);
      webSocketService.sendMessage(recipient, message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "Você",
          content: message,
          timestamp: formatTimestamp(), // Adiciona a data e hora
        },
      ]);
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
            <div
              key={index}
              className={`chat-message ${
                msg.sender === "Você" ? "sent" : "received"
              }`}
            >
              <strong>{msg.sender}:</strong> {msg.content}
              <div className="timestamp">{msg.timestamp}</div>
            </div>
          ))}
          {/* Elemento vazio para rolar até o final */}
          <div ref={messagesEndRef} />
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
