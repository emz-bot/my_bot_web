let instance = null;

class WebSocketService {
  constructor() {
    if (!instance) {
      this.socket = new WebSocket(window.gurl.WS_BASE_URL + "/ws");
      if (localStorage.token) {
        this.token = localStorage.token;
      }
      instance = this;
    }
    return instance;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.socket.onopen = () => resolve();
      this.socket.onerror = error => reject(error);
    });
  }

  send(data) {
    data.token = this.token;
    this.socket.send(JSON.stringify(data));
  }

  onMessage() {
    return new Promise((resolve) => {
      this.socket.onmessage = event => resolve(event.data);
    });
  }

  disconnect() {
    this.socket.close();
  }
}

export default WebSocketService;