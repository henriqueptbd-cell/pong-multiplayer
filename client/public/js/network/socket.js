/* =====================================================
   ARQUIVO: socket.js
   FUNÇÃO: Cliente Socket.IO para comunicação com servidor
   CAMADA: Network (Comunicação)
   ===================================================== */

class SocketClient {
    constructor() {
        // ==========================================
        // 1. CONECTAR AO SERVIDOR
        // ==========================================
        // O Socket.IO tenta conectar automaticamente
        // Se não encontrar, tenta novamente com fallback
        this.socket = io('http://localhost:3000', {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 10,
            reconnectionDelay: 1000
        });

        // ==========================================
        // 2. ESTADO DA CONEXÃO
        // ==========================================
        this.isConnected = false;
        this.socketId = null;

        // ==========================================
        // 3. CONFIGURAR LISTENERS
        // ==========================================
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
}

// =====================================================
// EXPORTAÇÃO
// =====================================================
export default SocketClient;