/* =====================================================
   ARQUIVO: server.js
   FUNÇÃO: Servidor HTTP com Express e Socket.IO
   ===================================================== */

// =====================================================
// 1. CARREGAR VARIÁVEIS DE AMBIENTE
// =====================================================
require('dotenv').config();

// =====================================================
// 2. IMPORTAÇÕES (TODAS NO TOPO)
// =====================================================
const express = require('express');
const path = require('path');
const http = require('http');

// ✅ CORRETO: Socket.IO importado ANTES de server.listen()
const { Server } = require('socket.io');

// =====================================================
// 3. CONFIGURAÇÃO
// =====================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Cria o servidor HTTP
const server = http.createServer(app);

// =====================================================
// 4. CONFIGURAR SOCKET.IO (COM CORS)
// =====================================================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// =====================================================
// 5. MIDDLEWARE E ROTAS
// =====================================================
app.use(express.static(path.join(__dirname, '../../client/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

app.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        status: 'Server is running!',
        socketio: '✅ Ativo'
    });
});

// =====================================================
// 6. EVENTOS DO SOCKET.IO
// =====================================================
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);
    console.log(`📊 Total de clientes: ${io.engine.clientsCount}`);

    socket.on('ping', (data) => {
        console.log(`📨 Ping de ${socket.id}:`, data);
        socket.emit('pong', {
            message: 'Pong do servidor!',
            timestamp: new Date().toISOString(),
            clientId: socket.id
        });
    });

    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
        console.log(`📊 Total de clientes: ${io.engine.clientsCount}`);
    });
});

// =====================================================
// 7. INICIA O SERVIDOR (SEMPRE POR ÚLTIMO)
// =====================================================
server.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO: ws://localhost:${PORT}`);
    console.log('========================================');
    console.log(`📁 Servindo arquivos da pasta: client/public`);
    console.log(`🧪 Teste: http://localhost:${PORT}/ping`);
    console.log('========================================');
});