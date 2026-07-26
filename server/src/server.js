require('dotenv').config({
    quiet: true
});

const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const RoomManager = require('./core/roomManager.js');

const GameState = require('./core/gameState.js');

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
    // ==========================================
    // DICIONÁRIO DE ESTADOS DO JOGO POR SALA
    // ==========================================
    const gameStates = new Map();

    // ==========================================
    // QUANDO JOGO COMEÇA (2 jogadores na sala)
    // ==========================================
    socket.on('gameStart', (data) => {
        const { roomCode } = data;
        const room = roomManager.getRoom(roomCode);

        if (!room || room.players.length < 2) return;

        // Cria estado do jogo para esta sala
        const gameState = new GameState();
        gameState.start();
        gameStates.set(roomCode, gameState);

        // Envia estado inicial para todos
        io.to(roomCode).emit('gameState', gameState.getState());
        console.log(`🎮 Jogo iniciado na sala ${roomCode}`);
    });

    // ==========================================
    // RECEBER TECLAS DOS JOGADORES
    // ==========================================
    socket.on('keys', (data) => {
        const { roomCode, playerId, keys } = data;
        const gameState = gameStates.get(roomCode);

        if (!gameState) return;

        if (!gameState.keys) {
            gameState.keys = {};
        }
        gameState.keys[playerId] = keys;
    });

    // ==========================================
    // LOOP DO JOGO (RODA A CADA 16ms)
    // ==========================================
    setInterval(() => {
        for (const [roomCode, gameState] of gameStates) {
            const room = roomManager.getRoom(roomCode);
            if (!room || room.players.length < 2) {
                gameStates.delete(roomCode);
                continue;
            }

            const keys1 = gameState.keys?.[room.players[0]?.id] || { up: false, down: false };
            const keys2 = gameState.keys?.[room.players[1]?.id] || { up: false, down: false };

            gameState.update(keys1, keys2);
            io.to(roomCode).emit('gameState', gameState.getState());
        }
    }, 16);
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