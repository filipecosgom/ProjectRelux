class WebSocketService {
  constructor() {
    this.socket = null;
    this.pingInterval = null; // Intervalo para enviar pings
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

    console.log("Estado inicial do WebSocket:", this.socket.readyState);

    this.socket.onopen = () => {
      console.log("Conectado ao WebSocket como:", username);

      // Inicia o envio de pings a cada 30 segundos
      this.pingInterval = setInterval(() => {
        if (this.socket.readyState === WebSocket.OPEN) {
          this.socket.send("ping");
        }
      }, 30000); // 30 segundos
    };

    this.socket.onclose = () => {
      console.log("Conexão WebSocket fechada. Estado:", this.socket.readyState);
      clearInterval(this.pingInterval); // Para o envio de pings
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
    if (this.socket) {
      this.socket.onmessage = (event) => {
        console.log("Mensagem recebida do WebSocket:", event.data);
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
