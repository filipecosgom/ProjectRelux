import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import webSocketService from "../services/websocketService";
import api from "../services/apiService"; // Importa o serviço para chamadas à API
import "./Chat.css";

const Chat = ({ loggedInUser }) => {
  const { username } = useParams(); // Obtém o destinatário da URL
  const navigate = useNavigate(); // Hook para navegação
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [recipient, setRecipient] = useState(username || ""); // Define o destinatário inicial
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Função para buscar a lista de usuários do backend
  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/all"); // Faz a chamada ao endpoint
      setUsers(response.data); // Armazena os usuários no estado
    } catch (err) {
      console.error("Erro ao carregar a lista de usuários:", err);
    } finally {
      setLoading(false); // Indica que o carregamento terminou
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Atualiza o destinatário ao mudar o URL
  useEffect(() => {
    setRecipient(username || "");
  }, [username]);

  // Conecta ao WebSocket
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
          timestamp: new Date().toLocaleString("pt-PT"),
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

  const handleUserSelection = (user) => {
    setRecipient(user.username);
    navigate(`/chat/${user.username}`); // Atualiza o URL
  };

  const handleSendMessage = () => {
    if (message.trim() && recipient.trim()) {
      console.log("Enviando mensagem para:", recipient);
      webSocketService.sendMessage(recipient, message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          sender: "Você",
          content: message,
          timestamp: new Date().toLocaleString("pt-PT"),
        },
      ]);
      setMessage("");
    } else {
      console.warn("Mensagem ou destinatário vazio. Mensagem não enviada.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-users">
        <h3>Usuários</h3>
        {loading ? (
          <p>Carregando...</p>
        ) : (
          <ul>
            {users.map((user) => (
              <li
                key={user.username}
                onClick={() => handleUserSelection(user)} // Atualiza o URL e o destinatário
              >
                <img
                  src={user.imagem || "https://via.placeholder.com/50"}
                  alt={user.username}
                  className="user-avatar"
                />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {recipient ? (
        <div className="chat-window">
          <h3>Chat com {recipient}</h3>
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
            <div ref={messagesEndRef} />
          </div>
          <div className="chat-input">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button onClick={handleSendMessage}>Enviar</button>
          </div>
        </div>
      ) : (
        <div className="chat-placeholder">
          <h3>Selecione um usuário para iniciar o chat</h3>
        </div>
      )}
    </div>
  );
};

export default Chat;
