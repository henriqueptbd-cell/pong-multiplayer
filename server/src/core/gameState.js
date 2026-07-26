/* =====================================================
   ARQUIVO: gameState.js
   FUNÇÃO: Estado autoritativo do jogo (roda no servidor)
   ===================================================== */

class GameState {
    constructor() {
        // Configurações
        this.width = 800;
        this.height = 500;
        this.paddleWidth = 15;
        this.paddleHeight = 100;
        this.ballSize = 15;
        this.paddleSpeed = 5;
        this.ballSpeed = 4;

        // Estado do jogo
        this.reset();
    }

    reset() {
        // Raquetes
        this.paddle1 = {
            x: 30,
            y: 200,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: this.paddleSpeed,
            score: 0
        };

        this.paddle2 = {
            x: this.width - 30 - this.paddleWidth,
            y: 200,
            width: this.paddleWidth,
            height: this.paddleHeight,
            speed: this.paddleSpeed,
            score: 0
        };

        // Bola
        this.ball = {
            x: this.width / 2 - this.ballSize / 2,
            y: this.height / 2 - this.ballSize / 2,
            size: this.ballSize,
            speedX: this.ballSpeed * (Math.random() > 0.5 ? 1 : -1),
            speedY: this.ballSpeed * (Math.random() > 0.5 ? 0.5 : -0.5)
        };

        this.state = 'waiting'; // waiting, playing, goal
        this.timestamp = Date.now();
    }

    // ==========================================
    // ATUALIZAR JOGO (FÍSICA)
    // ==========================================
    update(keys1, keys2) {
        if (this.state !== 'playing') return;

        // --- MOVIMENTO DAS RAQUETES ---
        // Jogador 1 (W/S)
        if (keys1.up) {
            this.paddle1.y -= this.paddle1.speed;
        }
        if (keys1.down) {
            this.paddle1.y += this.paddle1.speed;
        }

        // Jogador 2 (Setas)
        if (keys2.up) {
            this.paddle2.y -= this.paddle2.speed;
        }
        if (keys2.down) {
            this.paddle2.y += this.paddle2.speed;
        }

        // Limitar raquetes na tela
        this.paddle1.y = Math.max(0, Math.min(
            this.height - this.paddle1.height,
            this.paddle1.y
        ));
        this.paddle2.y = Math.max(0, Math.min(
            this.height - this.paddle2.height,
            this.paddle2.y
        ));

        // --- MOVIMENTO DA BOLA ---
        this.ball.x += this.ball.speedX;
        this.ball.y += this.ball.speedY;

        // --- COLISÃO COM PAREDES (topo/base) ---
        if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.height) {
            this.ball.speedY *= -1;
            this.ball.y = Math.max(0, Math.min(
                this.height - this.ball.size,
                this.ball.y
            ));
        }

        // --- COLISÃO COM RAQUETE 1 ---
        if (this.ball.speedX < 0 &&
            this.ball.x < this.paddle1.x + this.paddle1.width &&
            this.ball.x + this.ball.size > this.paddle1.x &&
            this.ball.y + this.ball.size > this.paddle1.y &&
            this.ball.y < this.paddle1.y + this.paddle1.height) {

            this.ball.speedX *= -1;
            this.ball.x = this.paddle1.x + this.paddle1.width;

            const hitPos = (this.ball.y + this.ball.size / 2) - (this.paddle1.y + this.paddle1.height / 2);
            this.ball.speedY = (hitPos / (this.paddle1.height / 2)) * 3;
        }

        // --- COLISÃO COM RAQUETE 2 ---
        if (this.ball.speedX > 0 &&
            this.ball.x + this.ball.size > this.paddle2.x &&
            this.ball.x < this.paddle2.x + this.paddle2.width &&
            this.ball.y + this.ball.size > this.paddle2.y &&
            this.ball.y < this.paddle2.y + this.paddle2.height) {

            this.ball.speedX *= -1;
            this.ball.x = this.paddle2.x - this.ball.size;

            const hitPos = (this.ball.y + this.ball.size / 2) - (this.paddle2.y + this.paddle2.height / 2);
            this.ball.speedY = (hitPos / (this.paddle2.height / 2)) * 3;
        }

        // --- DETECÇÃO DE GOL ---
        if (this.ball.x < -50) {
            this.paddle2.score++;
            this.state = 'goal';
            setTimeout(() => {
                this.resetBall();
                this.state = 'playing';
            }, 1000);
        } else if (this.ball.x > this.width + 50) {
            this.paddle1.score++;
            this.state = 'goal';
            setTimeout(() => {
                this.resetBall();
                this.state = 'playing';
            }, 1000);
        }

        this.timestamp = Date.now();
    }

    // ==========================================
    // RESETAR BOLA (após gol)
    // ==========================================
    resetBall() {
        this.ball.x = this.width / 2 - this.ball.size / 2;
        this.ball.y = this.height / 2 - this.ball.size / 2;
        this.ball.speedX = this.ballSpeed * (Math.random() > 0.5 ? 1 : -1);
        this.ball.speedY = this.ballSpeed * (Math.random() > 0.5 ? 0.5 : -0.5);
    }

    // ==========================================
    // INICIAR JOGO
    // ==========================================
    start() {
        this.reset();
        this.state = 'playing';
    }

    // ==========================================
    // OBTER ESTADO (para enviar aos clientes)
    // ==========================================
    getState() {
        return {
            paddle1: { ...this.paddle1 },
            paddle2: { ...this.paddle2 },
            ball: { ...this.ball },
            state: this.state,
            timestamp: this.timestamp
        };
    }
}

module.exports = GameState; // ← CommonJS