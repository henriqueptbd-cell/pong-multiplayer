/* =====================================================
   ARQUIVO: game.js
   FUNÇÃO: Classe principal que orquestra o jogo
   CAMADA: Core (Lógica central)
   ===================================================== */

import Renderer from '../ui/renderer.js';
import Paddle from './entities/Paddle.js';
import Ball from './entities/Ball.js';
import {
    checkPaddleCollision,
    calculateBounceAngle,
    detectGoal,
    increaseBallSpeed
} from './physics.js';

class Game {
    constructor(canvasId) {
        // --- 1. CONFIGURAÇÕES INICIAIS ---
        this.canvas = document.getElementById(canvasId);
        this.renderer = new Renderer(this.canvas);
        this.width = this.canvas.width;
        this.height = this.canvas.height;

        // --- 2. ENTIDADES DO JOGO ---
        this.paddle1 = new Paddle(30, 200, 15, 100, 5);
        this.paddle2 = new Paddle(755, 200, 15, 100, 5);
        this.ball = new Ball(400, 250, 15, 4, 3);

        // --- 3. ESTADO DO JOGO ---
        this.keys = {};

        // ==========================================
        // SISTEMA DE ESTADOS
        // ==========================================
        this.state = 'IDLE'; // IDLE, COUNTDOWN_START, PLAYING, PAUSED, COUNTDOWN_RESUME
        this.countdownDuration = 3;
        this.countdownTimer = 0;
        this.running = false;

        // ==========================================
        // REFERÊNCIAS PARA SOCKET E SALA (setadas pelo index)
        // ==========================================
        this.socket = null;
        this.currentRoom = null;

        // --- 4. INICIALIZAÇÃO ---
        this.setupControls();

        // ==========================================
        // INICIA O LOOP IMEDIATAMENTE (MESMO EM IDLE)
        // ==========================================
        this.loop();

        console.log('🎮 Game inicializado!');
        console.log(`📐 Canvas: ${this.width}x${this.height}`);
        console.log('🔧 Pressione P para começar o jogo');
    }

    /* ==================================================
       MÉTODO: setupControls
       ================================================== */
    setupControls() {
        // --- Tecla pressionada ---
        document.addEventListener('keydown', (event) => {
            // Ignora se estiver digitando em um input
            const tag = event.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                return;
            }

            this.keys[event.key] = true;

            // ==========================================
            // SISTEMA DE PAUSA (VIA SERVIDOR)
            // ==========================================
            if (event.key === 'p' || event.key === 'P') {
                // Se estiver em uma sala e conectado, envia pausa via servidor
                if (this.currentRoom && this.socket && this.socket.isConnected) {
                    this.socket.togglePause(this.currentRoom);
                } else {
                    // Fallback: pausa local (para teste sem servidor)
                    if (this.state === 'PLAYING') {
                        this.pauseInstant();
                    } else if (this.state === 'PAUSED') {
                        this.startCountdown('resume');
                    } else if (this.state === 'COUNTDOWN_RESUME') {
                        this.cancelCountdown();
                    } else if (this.state === 'IDLE') {
                        this.startGame();
                    }
                }
                event.preventDefault();
            }

            // Tecla ESC: cancela contagem
            if (event.key === 'Escape') {
                if (this.state === 'COUNTDOWN_RESUME') {
                    this.cancelCountdown();
                }
                event.preventDefault();
            }
        });

        // --- Tecla solta ---
        document.addEventListener('keyup', (event) => {
            const tag = event.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') {
                return;
            }

            this.keys[event.key] = false;
            event.preventDefault();
        });

        console.log('⌨️ Controles: W/S (J1), Setas (J2), P (Pausar/Despausar/Iniciar)');
    }

    /* ==================================================
       MÉTODO: setSocket (chamado pelo index.html)
       ================================================== */
    setSocket(socket, roomCode) {
        this.socket = socket;
        this.currentRoom = roomCode;
        console.log(`🔗 Game conectado à sala ${roomCode}`);
    }

    /* ==================================================
       MÉTODO: startGame (Inicia o jogo com contagem)
       ================================================== */
    startGame() {
        if (this.state === 'IDLE') {
            this.state = 'COUNTDOWN_START';
            this.countdownTimer = this.countdownDuration;
            console.log('⏳ Jogo começando em 3...');
        }
    }

    /* ==================================================
       MÉTODO: pauseInstant (PAUSA INSTANTÂNEA - fallback local)
       ================================================== */
    pauseInstant() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.running = false;
            console.log('⏸️ Jogo PAUSADO instantaneamente!');
        }
    }

    /* ==================================================
       MÉTODO: startCountdown (Inicia contagem para DESPAUSAR)
       ================================================== */
    startCountdown(action) {
        if (this.state === 'PAUSED' && action === 'resume') {
            this.state = 'COUNTDOWN_RESUME';
            this.countdownTimer = this.countdownDuration;
            console.log(`⏳ Despausando em ${this.countdownTimer}...`);
        }
    }

    /* ==================================================
       MÉTODO: updateCountdown
       ================================================== */
    updateCountdown() {
        this.countdownTimer -= 1 / 60;

        const secondsLeft = Math.ceil(this.countdownTimer);
        if (secondsLeft > 0 && secondsLeft !== Math.ceil(this.countdownTimer + 1 / 60)) {
            console.log(`⏳ ${secondsLeft}...`);
        }

        if (this.countdownTimer <= 0) {
            this.countdownTimer = 0;
            this.completeCountdown();
        }
    }

    /* ==================================================
       MÉTODO: completeCountdown
       ================================================== */
    completeCountdown() {
        if (this.state === 'COUNTDOWN_START') {
            this.state = 'PLAYING';
            this.running = true;
            console.log('🎮 Jogo INICIADO!');
        } else if (this.state === 'COUNTDOWN_RESUME') {
            this.state = 'PLAYING';
            this.running = true;
            console.log('▶️ Jogo DESPAUSADO!');
        }
    }

    /* ==================================================
       MÉTODO: cancelCountdown
       ================================================== */
    cancelCountdown() {
        if (this.state === 'COUNTDOWN_RESUME') {
            this.state = 'PAUSED';
            this.countdownTimer = 0;
            console.log('❌ Contagem cancelada! Jogo continua pausado.');
        }
    }

    /* ==================================================
       MÉTODO: update
       ================================================== */
    update() {
        // --- Se está em contagem, atualiza e retorna ---
        if (this.state === 'COUNTDOWN_START' || this.state === 'COUNTDOWN_RESUME') {
            this.updateCountdown();
            return;
        }

        // --- Se está pausado ou idle, não executa o jogo ---
        if (this.state === 'PAUSED' || this.state === 'IDLE') {
            return;
        }

        // --- Se não está jogando, não executa ---
        if (this.state !== 'PLAYING') return;

        // --- Movimento das raquetes ---
        if (this.keys['w'] || this.keys['W']) {
            this.paddle1.move(-1, this.height);
        }
        if (this.keys['s'] || this.keys['S']) {
            this.paddle1.move(1, this.height);
        }
        if (this.keys['ArrowUp']) {
            this.paddle2.move(-1, this.height);
        }
        if (this.keys['ArrowDown']) {
            this.paddle2.move(1, this.height);
        }

        // --- Movimento da bola ---
        this.ball.move();

        // --- Colisão com paredes ---
        if (this.ball.y <= 0) {
            this.ball.y = 0;
            this.ball.reverseY();
        }
        if (this.ball.y + this.ball.size >= this.height) {
            this.ball.y = this.height - this.ball.size;
            this.ball.reverseY();
        }

        // --- Colisão com raquete 1 ---
        if (this.ball.speedX < 0) {
            if (checkPaddleCollision(this.ball, this.paddle1)) {
                this.ball.x = this.paddle1.x + this.paddle1.width;
                this.ball.reverseX();
                const angle = calculateBounceAngle(this.ball, this.paddle1);
                this.ball.speedY = angle * 4;
                increaseBallSpeed(this.ball);
            }
        }

        // --- Colisão com raquete 2 ---
        if (this.ball.speedX > 0) {
            if (checkPaddleCollision(this.ball, this.paddle2)) {
                this.ball.x = this.paddle2.x - this.ball.size;
                this.ball.reverseX();
                const angle = calculateBounceAngle(this.ball, this.paddle2);
                this.ball.speedY = angle * 4;
                increaseBallSpeed(this.ball);
            }
        }

        // --- Detecção de gol ---
        const goal = detectGoal(this.ball, this.width);
        if (goal !== 0) {
            if (goal === 1) {
                this.paddle1.score++;
                console.log(`🏆 Gol do Jogador 1! ${this.paddle1.score} x ${this.paddle2.score}`);
            } else {
                this.paddle2.score++;
                console.log(`🏆 Gol do Jogador 2! ${this.paddle1.score} x ${this.paddle2.score}`);
            }
            this.ball.reset();
        }
    }

    /* ==================================================
       MÉTODO: draw
       ================================================== */
    draw() {
        // --- Limpa a tela ---
        this.renderer.clear();

        // ==========================================
        // SE FOR IDLE OU COUNTDOWN_START, NÃO DESENHA O JOGO
        // ==========================================
        if (this.state === 'IDLE' || this.state === 'COUNTDOWN_START') {
            this.renderer.drawPauseOverlay(this.state, this.countdownTimer);
            return;
        }

        // ==========================================
        // PARA OS DEMAIS ESTADOS, DESENHA O JOGO
        // ==========================================
        this.renderer.drawCenterLine();
        this.renderer.drawPaddle(this.paddle1);
        this.renderer.drawPaddle(this.paddle2);
        this.renderer.drawBall(this.ball);
        this.renderer.drawScore(this.paddle1.score, this.paddle2.score);

        // ==========================================
        // SE ESTIVER PAUSADO OU EM CONTAGEM, DESENHA OVERLAY POR CIMA
        // ==========================================
        if (this.state === 'PAUSED' || this.state === 'COUNTDOWN_RESUME') {
            this.renderer.drawPauseOverlay(this.state, this.countdownTimer);
        }
    }

    /* ==================================================
       MÉTODO: loop
       ================================================== */
    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }

    /* ==================================================
       MÉTODO: updateFromServer (recebe estado do servidor)
       ================================================== */
    updateFromServer(serverState) {
        this.paddle1.x = serverState.paddle1.x;
        this.paddle1.y = serverState.paddle1.y;
        this.paddle1.score = serverState.paddle1.score;

        this.paddle2.x = serverState.paddle2.x;
        this.paddle2.y = serverState.paddle2.y;
        this.paddle2.score = serverState.paddle2.score;

        this.ball.x = serverState.ball.x;
        this.ball.y = serverState.ball.y;
    }

    /* ==================================================
       MÉTODO: pauseFromServer (pausa comandada pelo servidor)
       ================================================== */
    pauseFromServer(state) {
        if (state === 'paused') {
            this.state = 'PAUSED';
            this.running = false;
            console.log('⏸️ Jogo pausado pelo servidor');
        } else if (state === 'playing') {
            this.state = 'PLAYING';
            this.running = true;
            console.log('▶️ Jogo despausado pelo servidor');
            this.loop();
        }
    }
}

export default Game;