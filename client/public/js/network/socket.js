/* =====================================================
   ARQUIVO: socket.js
   FUNÇÃO: Cliente Socket.IO para comunicação com servidor
   CAMADA: Network (Comunicação)
   ===================================================== */

class SocketClient {
    constructor() {
        // ==========================================
        // DETECTA AMBIENTE AUTOMATICAMENTE
        // ==========================================
        const isProduction = window.location.hostname !== 'localhost';
        const serverUrl = isProduction
            ? window.location.origin // ← Usa a URL do próprio site
            : 'http://localhost:3000';

        this.socket = io(serverUrl, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });

        this.isConnected = false;
        this.socketId = null;
        this.setupListeners();
    }

    /* ==================================================
       MÉTODO: setupListeners
       ================================================== 
       Configura os eventos que o cliente escuta
    */
    setupListeners() {
        // --- Quando CONECTA ---
        this.socket.on('connect', () => {
            this.isConnected = true;
            this.socketId = this.socket.id;
            console.log(`✅ Conectado ao servidor! ID: ${this.socketId}`);

            // Envia um ping automático ao conectar
            this.sendPing({
                message: 'Olá servidor!',
                timestamp: new Date().toISOString()
            });
        });

        // --- Quando DESCONECTA ---
        this.socket.on('disconnect', () => {
            this.isConnected = false;
            console.log('❌ Desconectado do servidor');
        });

        // --- Recebe PONG do servidor ---
        this.socket.on('pong', (data) => {
            console.log('🏓 PONG recebido do servidor:', data);

            // Dispara um evento customizado para o jogo
            document.dispatchEvent(new CustomEvent('serverPong', {
                detail: data
            }));
        });

        // --- Recebe MENSAGEM do servidor ---
        this.socket.on('message', (data) => {
            console.log('💬 Mensagem do servidor:', data);

            document.dispatchEvent(new CustomEvent('serverMessage', {
                detail: data
            }));
        });

        // --- Erro de conexão ---
        this.socket.on('connect_error', (error) => {
            console.error('❌ Erro de conexão:', error.message);
            console.log('🔄 Tentando reconectar...');
        });
    }

    /* ==================================================
       MÉTODO: sendPing
       ================================================== 
       Envia um ping para o servidor
    */
    sendPing(data = {}) {
        if (!this.isConnected) {
            console.warn('⚠️ Não conectado ao servidor');
            return;
        }

        this.socket.emit('ping', data);
        console.log('📨 Ping enviado:', data);
    }

    /* ==================================================
       MÉTODO: sendMessage
       ================================================== 
       Envia uma mensagem genérica para o servidor
    */
    sendMessage(message) {
        if (!this.isConnected) {
            console.warn('⚠️ Não conectado ao servidor');
            return;
        }

        this.socket.emit('message', {
            message: message,
            timestamp: new Date().toISOString()
        });
    }

    /* ==================================================
       MÉTODO: disconnect
       ================================================== 
       Desconecta do servidor manualmente
    */
    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            console.log('🔌 Desconexão manual');
        }
    }

    // ==========================================
    // MÉTODO: createRoom
    // ==========================================
    createRoom(playerName) {
        return new Promise((resolve, reject) => {
            this.socket.emit('createRoom', { playerName }, (response) => {
                if (response.success) {
                    resolve(response);
                } else {
                    reject(response.error || 'Erro ao criar sala');
                }
            });
        });
    }

    // ==========================================
    // MÉTODO: joinRoom
    // ==========================================
    joinRoom(code, playerName) {
        return new Promise((resolve, reject) => {
            this.socket.emit('joinRoom', { code, playerName }, (response) => {
                if (response.success) {
                    resolve(response);
                } else {
                    reject(response.error || 'Erro ao entrar na sala');
                }
            });
        });
    }

    // ==========================================
    // PAUSA SINCRONIZADA
    // ==========================================
    togglePause(roomCode) {
        if (!this.isConnected) return;
        this.socket.emit('togglePause', { roomCode });
    }

    // ==========================================
    // RECONECTAR À SALA
    // ==========================================
    reconnectRoom(roomCode, playerName) {
        return new Promise((resolve, reject) => {
            this.socket.emit('reconnectRoom', { roomCode, playerName }, (response) => {
                if (response && response.error) {
                    reject(response.error);
                } else {
                    resolve(response);
                }
            });
        });
    }
}

// =====================================================
// EXPORTAÇÃO
// =====================================================
export default SocketClient;