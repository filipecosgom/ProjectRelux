class WebSocketService {
  constructor() {
    this.socket = null;
    this.pingInterval = null; // Intervalo para enviar pings
    this.onMessageCallback = null; // Callback para mensagens recebidas
  }

  /**
   * Conecta ao WebSocket.
   * @param {string} username - Nome do usuário que está se conectando.
   */
  connect(username) {
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.warn("WebSocket já está conectado ou em processo de conexão.");
      return;
    }

    this.socket = new WebSocket(
      `ws://localhost:8080/filipe-proj5/chat/${username}`
    );

    this.socket.onopen = () => {
      console.log(`Conexão WebSocket aberta para o usuário: ${username}`);
      console.log("Estado do WebSocket:", this.socket.readyState); // Deve ser 1 (OPEN)
    };

    this.socket.onmessage = (event) => {
      console.log("Mensagem recebida do WebSocket:", event.data);
      if (this.onMessageCallback) {
        this.onMessageCallback(event.data);
      }
    };

    this.socket.onclose = (event) => {
      console.log("Conexão WebSocket fechada. Estado:", this.socket.readyState); // Deve ser 3 (CLOSED)
    };

    this.socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
      console.log("Estado do WebSocket no erro:", this.socket.readyState);
    };
  }

  /**
   * Envia uma mensagem para o WebSocket.
   * @param {string} recipient - Nome do destinatário.
   * @param {string} message - Conteúdo da mensagem.
   */
  sendMessage(recipient, message) {
    console.log(
      "Tentando enviar mensagem. Estado do WebSocket:",
      this.socket.readyState
    );
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(`${recipient}:${message}`);
      console.log("Mensagem enviada:", `${recipient}:${message}`);
    } else {
      console.error("WebSocket não está conectado. Mensagem não enviada.");
    }
  }

  /**
   * Define um callback para receber mensagens.
   * @param {function} callback - Função a ser chamada quando uma mensagem for recebida.
   */
  onMessage(callback) {
    this.onMessageCallback = callback;
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
