class WebSocketService {
  constructor() {
    this.socket = null;
  }

  /**
   * Conecta ao WebSocket.
   * @param {string} username - Nome do usuário que está se conectando.
   */
  connect(username) {
    this.socket = new WebSocket(
      `ws://localhost:8080/filipe-proj5/chat/${username}`
    );

    this.socket.onopen = () => {
      console.log("Conectado ao WebSocket como:", username);
    };

    this.socket.onclose = () => {
      console.log("Desconectado do WebSocket");
    };

    this.socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };
  }

  /**
   * Envia uma mensagem para o WebSocket.
   * @param {string} recipient - Nome do destinatário.
   * @param {string} message - Conteúdo da mensagem.
   */
  sendMessage(recipient, message) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`${recipient}:${message}`);
    } else {
      console.error("WebSocket não está conectado.");
    }
  }

  /**
   * Define um callback para receber mensagens.
   * @param {function} callback - Função a ser chamada quando uma mensagem for recebida.
   */
  onMessage(callback) {
    if (this.socket) {
      this.socket.onmessage = (event) => {
        callback(event.data);
      };
    }
  }

  /**
   * Desconecta do WebSocket.
   */
  disconnect() {
    if (this.socket) {
      this.socket.close();
    }
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
