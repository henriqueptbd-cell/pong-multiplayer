require('dotenv').config();

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// ==========================================
// IMPORTA ROOM MANAGER
// ==========================================
import RoomManager from './core/roomManager.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// ==========================================
// INICIA ROOM MANAGER
// ==========================================
const roomManager = new RoomManager();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(express.static(path.join(__dirname, '../../client/public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

app.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        status: 'Server is running!'
    });
});

// ==========================================
// SOCKET.IO EVENTOS
// ==========================================
io.on('connection', (socket) => {
    console.log(`🔌 Cliente conectado: ${socket.id}`);

    // --- Ping/Pong ---
    socket.on('ping', (data) => {
        socket.emit('pong', {
            message: 'Pong do servidor!',
            timestamp: new Date().toISOString(),
            clientId: socket.id
        });
    });

    // ==========================================
    // CRIAR SALA
    // ==========================================
    socket.on('createRoom', ({ playerName }, callback) => {
        const code = roomManager.createRoom(socket.id, playerName);
        socket.join(code);

        callback({
            success: true,
            code: code,
            room: roomManager.getRoom(code)
        });

        console.log(`🏠 Sala ${code} criada por ${playerName}`);
    });

    // ==========================================
    // ENTRAR EM SALA
    // ==========================================
    socket.on('joinRoom', ({ code, playerName }, callback) => {
        const result = roomManager.joinRoom(code, socket.id, playerName);

        if (result.error) {
            callback({ success: false, error: result.error });
            return;
        }

        socket.join(code);

        io.to(code).emit('playerJoined', {
            players: result.room.players,
            state: result.room.state
        });

        if (result.room.state === 'playing') {
            io.to(code).emit('gameStarting', {
                players: result.room.players
            });
        }

        callback({ success: true, room: result.room });
        console.log(`👋 ${playerName} entrou na sala ${code}`);
    });

    // ==========================================
    // DESCONEXÃO
    // ==========================================
    socket.on('disconnect', () => {
        console.log(`🔌 Cliente desconectado: ${socket.id}`);

        // Remove jogador de todas as salas
        for (const [code, room] of roomManager.rooms) {
            const playerExists = room.players.some(p => p.id === socket.id);
            if (playerExists) {
                roomManager.removePlayer(code, socket.id);
                io.to(code).emit('playerLeft', {
                    playerId: socket.id,
                    players: room.players
                });
                break;
            }
        }
    });
});

// ==========================================
// INICIAR SERVIDOR
// ==========================================
server.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor: http://localhost:${PORT}`);
    console.log(`🔌 Socket.IO: ws://localhost:${PORT}`);
    console.log('========================================');
});