require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Socket.IO com CORS
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Middleware
app.use(express.static(path.join(__dirname, '../../client/public')));

// Rotas
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

// ==========================================
// SOCKET.IO EVENTOS
// ==========================================
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);
    console.log(`📊 Total de clientes: ${io.engine.clientsCount}`);

    // --- Ping/Pong ---
    socket.on('ping', (data) => {
        console.log(`📨 Ping de ${socket.id}:`, data);
        socket.emit('pong', {
            message: 'Pong do servidor!',
            timestamp: new Date().toISOString(),
            clientId: socket.id
        });
    });

    // --- Mensagem (NOVO) ---
    socket.on('message', (data) => {
        console.log(`💬 Mensagem de ${socket.id}:`, data);

        // Ecoa a mensagem de volta
        socket.emit('message', {
            received: data,
            echo: 'Mensagem recebida pelo servidor!',
            timestamp: new Date().toISOString()
        });
    });

    // --- Desconexão ---
    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);
        console.log(`📊 Total de clientes: ${io.engine.clientsCount}`);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO: ws://localhost:${PORT}`);
    console.log('========================================');
    console.log(`📁 Servindo arquivos da pasta: client/public`);
    console.log(`🧪 Teste: http://localhost:${PORT}/ping`);
    console.log('========================================');
});