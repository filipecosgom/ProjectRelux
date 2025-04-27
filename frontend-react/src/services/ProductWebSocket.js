class ProductWebSocket {
  constructor() {
    this.socket = null;
  }

  connect(productId, onMessageCallback) {
    this.socket = new WebSocket(`ws://localhost:8080/product/${productId}`);

    this.socket.onopen = () => {
      console.log(`Conectado ao WebSocket do produto ${productId}`);
    };

    this.socket.onmessage = (event) => {
      const update = JSON.parse(event.data);
      console.log("Atualização recebida via WebSocket:", update);
      if (onMessageCallback) {
        onMessageCallback(update); // Chama o callback para processar a atualização
      }
    };

    this.socket.onerror = (error) => {
      console.error("Erro no WebSocket:", error);
    };

    this.socket.onclose = () => {
      console.log(`Desconectado do WebSocket do produto ${productId}`);
    };
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }
}

export default new ProductWebSocket();
