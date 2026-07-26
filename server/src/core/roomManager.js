/* =====================================================
   ARQUIVO: roomManager.js
   FUNÇÃO: Gerenciar salas do jogo
   ===================================================== */

class RoomManager {
    constructor() {
        // Salas ativas: { codigo: { players: [], state: 'waiting' } }
        this.rooms = new Map();
    }

    // ==========================================
    // GERAR CÓDIGO ALEATÓRIO (ex: ABC123)
    // ==========================================
    generateCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars[Math.floor(Math.random() * chars.length)];
        }
        return code;
    }

    // ==========================================
    // CRIAR SALA
    // ==========================================
    createRoom(playerId, playerName) {
        let code;
        do {
            code = this.generateCode();
        } while (this.rooms.has(code));

        const room = {
            code: code,
            players: [{
                id: playerId,
                name: playerName,
                side: 'left'
            }],
            state: 'waiting', // waiting, playing, finished
            gameState: null
        };

        this.rooms.set(code, room);
        console.log(`🏠 Sala criada: ${code} (${playerName})`);
        return code;
    }

    // ==========================================
    // ENTRAR EM SALA
    // ==========================================
    joinRoom(code, playerId, playerName) {
        const room = this.rooms.get(code);

        if (!room) {
            return { error: 'Sala não encontrada' };
        }

        if (room.players.length >= 2) {
            return { error: 'Sala cheia' };
        }

        if (room.state !== 'waiting') {
            return { error: 'Jogo já começou' };
        }

        room.players.push({
            id: playerId,
            name: playerName,
            side: 'right'
        });

        if (room.players.length === 2) {
            room.state = 'playing';
            console.log(`🎮 Jogo começando na sala ${code}!`);
        }

        console.log(`👋 ${playerName} entrou na sala ${code}`);
        return { success: true, room };
    }

    // ==========================================
    // OBTER SALA
    // ==========================================
    getRoom(code) {
        return this.rooms.get(code) || null;
    }

    // ==========================================
    // REMOVER SALA
    // ==========================================
    removeRoom(code) {
        this.rooms.delete(code);
        console.log(`🗑️ Sala removida: ${code}`);
    }

    // ==========================================
    // REMOVER JOGADOR
    // ==========================================
    removePlayer(code, playerId) {
        const room = this.rooms.get(code);
        if (!room) return;

        room.players = room.players.filter(p => p.id !== playerId);

        if (room.players.length === 0) {
            this.removeRoom(code);
        } else {
            if (room.state === 'playing') {
                room.state = 'waiting';
                console.log(`⏳ Sala ${code} aguardando novo jogador`);
            }
        }
    }
}

module.exports = RoomManager;