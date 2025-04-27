import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import StoreLogo from "../../images/icon.png";
import { userStore } from "../../stores/UserStore";
import { IoAddCircleOutline } from "react-icons/io5";
import {
  FaSignOutAlt,
  FaSignInAlt,
  FaUsers,
  FaBell,
  FaRegCommentAlt,
  FaTools,
  FaUserInjured,
} from "react-icons/fa";
import ProductModal from "../product/ProductModal";
import api from "../../services/apiService";
import { toast } from "react-toastify";
import notificationService from "../../services/notificationService";

const Navbar = () => {
  const navigate = useNavigate(); // Hook para redirecionamento
  const username = userStore((state) => state.username);
  const imagem = userStore((state) => state.imagem);
  const isAdmin = userStore((state) => state.isAdmin);
  const clearUser = userStore((state) => state.clearUser);

  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal
  const [notifications, setNotifications] = useState([]);
  const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);
  const [messages, setMessages] = useState([]); // Estado para mensagens

  useEffect(() => {
    if (username) {
      notificationService.connect(username);

      notificationService.onNotification((data) => {
        try {
          const notification = JSON.parse(data); // Parse do JSON recebido
          setNotifications((prev) => [notification, ...prev]);
          setUnreadNotificationCount((prevCount) => prevCount + 1); // Incrementa o contador
        } catch (error) {
          console.error("Erro ao processar mensagem do WebSocket:", error);
        }
      });

      return () => {
        notificationService.disconnect(); // Desconecta ao desmontar o componente
      };
    }
  }, [username]);

  // Fechar a janela de notificações ao clicar fora dela
  useEffect(() => {
    const handleClickOutside = (event) => {
      const notificationPanel = document.querySelector(".notification-panel");
      if (notificationPanel && !notificationPanel.contains(event.target)) {
        setIsNotificationPanelOpen(false); // Fecha o painel
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Este bloco de código configura um intervalo para atualizar o estado das notificações periodicamente, garantindo que o tempo relativo exibido seja atualizado em tempo real.
  useEffect(() => {
    const interval = setInterval(() => {
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({
          ...notification,
          timestamp: notification.timestamp, // Mantém o timestamp original
        }))
      );
    }, 60000); // Atualiza a cada 60 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
  }, []);

  useEffect(() => {
    const updateNotifications = async () => {
      const updatedNotifications = notifications.map((notification) => {
        const relatedMessage = messages.find(
          (msg) => msg.id === notification.messageId && msg.isRead
        );
        if (relatedMessage) {
          return { ...notification, isRead: true };
        }
        return notification;
      });

      setNotifications(updatedNotifications);

      // Atualiza o contador de notificações não lidas
      const unreadCount = updatedNotifications.filter((n) => !n.isRead).length;
      setUnreadNotificationCount(unreadCount);
    };

    updateNotifications();
  }, [messages]);

  // Exibe uma toast de boas-vindas após o login
  useEffect(() => {
    if (username) {
      toast.success(`Login efetuado com sucesso! Bem-vindo, ${username}!`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }, [username]);

  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      clearUser();
      toast.success("Logout realizado com sucesso!");
      navigate("/"); // Redireciona para a página inicial
    } catch (error) {
      console.error("Erro no logout:", error.response?.data || error.message);
      toast.error("Erro ao realizar logout. Tente novamente.");
    }
  };

  const handleNotificationClick = (notification) => {
    // Lógica para lidar com o clique na notificação
    console.log("Notificação clicada:", notification);
  };

  const handleNotificationIconClick = () => {
    setIsNotificationPanelOpen((prev) => !prev); // Alterna o estado do painel
    if (!isNotificationPanelOpen) {
      // Reseta o contador de notificações não lidas ao abrir o painel
      const resetNotifications = notifications.map((notification) => ({
        ...notification,
        isRead: true, // Marca todas as notificações como lidas
      }));
      setNotifications(resetNotifications);
      setUnreadNotificationCount(0); // Reseta o contador de notificações não lidas
    }
  };

  const formatRelativeTime = (timestamp) => {
    // Lógica para formatar o tempo relativo
    const timeDiff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(timeDiff / 60000);

    if (minutes === 0) {
      return "agora mesmo";
    }

    if (minutes < 60) {
      return minutes === 1 ? "há 1 minuto" : `há ${minutes} minutos`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return hours === 1 ? "há 1 hora" : `há ${hours} horas`;
    }

    const days = Math.floor(hours / 24);
    return days === 1 ? "há 1 dia" : `há ${days} dias`;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-logo" to="/">
          <img
            src={StoreLogo}
            alt="Store Logo"
            className="d-inline-block align-text-top"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {username ? (
              <>
                {/* Ícone de notificações */}
                <li className="nav-item">
                  <div
                    className="notification-icon-container"
                    onClick={handleNotificationIconClick} // Usa a nova função
                  >
                    <FaBell className="notification-icon" />
                    {unreadNotificationCount > 0 && (
                      <span className="notification-badge">
                        {unreadNotificationCount}
                      </span>
                    )}
                  </div>

                  {isNotificationPanelOpen && (
                    <div className="notification-panel">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index}
                            className={`notification-item ${
                              notification.isRead ? "read" : ""
                            }`}
                            onClick={() =>
                              navigate(`/chat/${notification.sender}`)
                            } // Redireciona para o chat
                          >
                            <div className="notification-left">
                              <img
                                src={notification.senderImage}
                                alt="Imagem do remetente"
                                className="notification-avatar"
                              />
                              <p className="notification-sender">
                                {notification.sender}
                              </p>
                            </div>
                            <div className="notification-right">
                              <p className="notification-content">
                                {notification.content}
                              </p>
                              <p className="notification-preview">
                                <i>
                                  "
                                  {notification.messagePreview &&
                                  notification.messagePreview.length > 20
                                    ? `${notification.messagePreview.substring(
                                        0,
                                        17
                                      )}...`
                                    : notification.messagePreview || ""}
                                  "
                                </i>
                              </p>
                              <span className="notification-timestamp">
                                {formatRelativeTime(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="notification-empty">
                          Sem notificações
                        </div>
                      )}
                    </div>
                  )}
                </li>

                <li className="nav-item">
                  <IoAddCircleOutline
                    className="add-product-icon"
                    onClick={() => setIsModalOpen(true)}
                  />
                </li>
                <li className="nav-item dropdown">
                  <img
                    src={imagem}
                    alt="User"
                    className="nav-user-image dropdown-toggle"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  />
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <span className="dropdown-item-text">
                        Bem-vindo, {username}!
                      </span>
                    </li>
                    <li>
                      <Link to="/profile" className="dropdown-item">
                        <FaUserInjured className="nav-icon" /> O meu perfil
                      </Link>
                    </li>
                    <li>
                      <Link to="/users" className="dropdown-item">
                        <FaUsers className="nav-icon" /> Utilizadores
                      </Link>
                    </li>
                    <li>
                      <Link to="/chat" className="dropdown-item">
                        <FaRegCommentAlt className="nav-icon" /> Chat
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin" className="dropdown-item">
                          <FaTools className="nav-icon" /> Administrar
                        </Link>
                      </li>
                    )}
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <FaSignOutAlt className="nav-icon" /> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  <FaSignInAlt className="nav-icon" /> Login
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Modal de criação de produto */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </nav>
  );
};

export default Navbar;
