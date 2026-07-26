// =====================================================
// 1. CARREGAR VARIÁVEIS DE AMBIENTE
// =====================================================
require('dotenv').config();

// =====================================================
// 2. IMPORTAÇÕES
// =====================================================
const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// =====================================================
// 3. IMPORTA O ROOM MANAGER E GAME STATE
// =====================================================
const RoomManager = require('./core/roomManager.js');
const GameState = require('./core/gameState.js');

// =====================================================
// 4. CONFIGURAÇÃO DO SERVIDOR
// =====================================================
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

// =====================================================
// 5. SOCKET.IO COM CORS
// =====================================================
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
});

// =====================================================
// 6. INICIA O ROOM MANAGER
// =====================================================
const roomManager = new RoomManager();

// =====================================================
// 7. DICIONÁRIO DE ESTADOS DO JOGO (FORA DO io.on)
// =====================================================
const gameStates = new Map();

// =====================================================
// 8. MIDDLEWARE E ROTAS
// =====================================================
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

// =====================================================
// 9. SOCKET.IO EVENTOS
// =====================================================
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
    // INICIAR JOGO (quando 2 jogadores estão na sala)
    // ==========================================
    socket.on('gameStart', ({ roomCode }) => {
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
    socket.on('keys', ({ roomCode, playerId, keys }) => {
        const gameState = gameStates.get(roomCode);
        if (!gameState) return;

        if (!gameState.keys) {
            gameState.keys = {};
        }
        gameState.keys[playerId] = keys;
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

                // Remove estado do jogo se sala vazia
                if (room.players.length === 0) {
                    gameStates.delete(code);
                }
                break;
            }
        }
    });

    // ==========================================
    // PAUSA SINCRONIZADA
    // ==========================================
    socket.on('togglePause', ({ roomCode }) => {
        const gameState = gameStates.get(roomCode);
        if (!gameState) return;

        const newState = gameState.togglePause();
        io.to(roomCode).emit('pauseState', { state: newState });
        console.log(`🔄 Pausa alternada na sala ${roomCode}: ${newState}`);
    });

    // ==========================================
    // INICIAR CONTAGEM REGRESSIVA
    // ==========================================
    socket.on('startCountdown', ({ roomCode }) => {
        const gameState = gameStates.get(roomCode);
        if (!gameState) return;

        const timer = gameState.startCountdown();
        io.to(roomCode).emit('countdownUpdate', { timer });
        console.log(`⏳ Contagem iniciada na sala ${roomCode}: ${timer}`);
    });

    // ==========================================
    // RECONEXÃO (quando cliente se reconecta)
    // ==========================================
    socket.on('reconnectRoom', ({ roomCode, playerName }) => {
        const room = roomManager.getRoom(roomCode);
        if (!room) {
            socket.emit('reconnectError', { error: 'Sala não encontrada' });
            return;
        }

        // Verifica se o jogador já está na sala
        const existingPlayer = room.players.find(p => p.id === socket.id);
        if (existingPlayer) {
            socket.join(roomCode);
            socket.emit('reconnectSuccess', { room });
            console.log(`🔄 Jogador reconectado: ${playerName} na sala ${roomCode}`);
        } else {
            socket.emit('reconnectError', { error: 'Jogador não encontrado na sala' });
        }
    });
});

// =====================================================
// 10. LOOP DO JOGO (~60 FPS)
// =====================================================
setInterval(() => {
    for (const [roomCode, gameState] of gameStates) {
        const room = roomManager.getRoom(roomCode);
        if (!room || room.players.length < 2) {
            gameStates.delete(roomCode);
            continue;
        }

        // Pega as teclas de cada jogador
        const keys1 = gameState.keys?.[room.players[0]?.id] || { up: false, down: false };
        const keys2 = gameState.keys?.[room.players[1]?.id] || { up: false, down: false };

        // Atualiza o jogo
        gameState.update(keys1, keys2);

        // Dentro do setInterval, após gameState.update()
        // Atualiza a contagem regressiva se estiver em countdown
        if (gameState.state === 'countdown') {
            const timer = gameState.updateCountdown();
            io.to(roomCode).emit('countdownUpdate', { timer });

            // Se a contagem terminou, o jogo começa
            if (gameState.state === 'playing') {
                io.to(roomCode).emit('gameState', gameState.getState());
            }
        }

        // Envia estado atualizado para todos na sala
        io.to(roomCode).emit('gameState', gameState.getState());
    }
}, 16); // ~60 FPS

// =====================================================
// 11. INICIAR SERVIDOR
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