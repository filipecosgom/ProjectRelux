class NotificationService {
  constructor() {
    this.socket = null;
    this.onNotificationCallback = null; // Callback para notificações recebidas
  }

  /**
   * Conecta ao WebSocket de notificações.
   * @param {string} username - Nome do usuário logado.
   */
  connect(username) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.warn("WebSocket de notificações já está conectado.");
      return;
    }

    this.socket = new WebSocket(
      `ws://localhost:8080/filipe-proj5/notifications/${username}`
    );

    this.socket.onopen = () => {
      console.log(`Conexão de notificações aberta para o usuário: ${username}`);
    };

    this.socket.onmessage = (event) => {
      console.log("Notificação recebida:", event.data);
      if (this.onNotificationCallback) {
        this.onNotificationCallback(event.data);
      }
    };

    this.socket.onclose = () => {
      console.log("Conexão de notificações fechada.");
    };

    this.socket.onerror = (error) => {
      console.error("Erro no WebSocket de notificações:", error);
    };
  }

  /**
   * Define um callback para notificações recebidas.
   * @param {function} callback - Função a ser chamada quando uma notificação for recebida.
   */
  onNotification(callback) {
    this.onNotificationCallback = callback;
  }

  /**
   * Desconecta do WebSocket de notificações.
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const notificationService = new NotificationService();
export default notificationService;
