/* =====================================================
   ARQUIVO: game.js
   FUNÇÃO: Classe principal que orquestra o jogo
   CAMADA: Core (Lógica central)
   DEPENDÊNCIAS: 
     - Renderer (para desenhar na tela)
     - Paddle, Ball (entidades do jogo)
   ===================================================== */

// =====================================================
// IMPORTAÇÕES
// =====================================================
// Usamos import/export (ES Modules) para organizar o código.
// Cada classe está em seu próprio arquivo.
import Renderer from '../ui/renderer.js';
import Paddle from './entities/Paddle.js';
import Ball from './entities/Ball.js';

/* =====================================================
   CLASSE GAME
   ===================================================== 
   A classe Game é o "cérebro" do jogo.
   Ela:
   1. Guarda o estado do jogo (entidades, pontuação, etc)
   2. Atualiza a lógica a cada frame (update)
   3. Desenha na tela (draw)
   4. Gerencia o loop principal
*/
class Game {
    /* ==================================================
       CONSTRUTOR
       ================================================== 
       O construtor é chamado quando criamos um novo Game.
       Ex: const game = new Game('gameCanvas');
    */
    constructor(canvasId) {
        // --- 1. CONFIGURAÇÕES INICIAIS ---

        // Pega o canvas pelo ID (que foi passado como parâmetro)
        // Ex: 'gameCanvas' vira document.getElementById('gameCanvas')
        this.canvas = document.getElementById(canvasId);

        // Cria um renderizador para desenhar no canvas
        // O renderizador é uma classe separada (responsabilidade única)
        this.renderer = new Renderer(this.canvas);

        // Guarda as dimensões do canvas para usar depois
        this.width = this.canvas.width;   // 800
        this.height = this.canvas.height; // 500

        // --- 2. ENTIDADES DO JOGO ---
        // As entidades são os objetos que compõem o jogo.
        // Cada entidade é uma classe separada.

        // Raquete 1 (esquerda) - Jogador 1
        // x=30, y=200 (posição inicial), 15x100 (largura/altura)
        this.paddle1 = new Paddle(30, 200, 15, 100, 5);

        // Raquete 2 (direita) - Jogador 2
        // x=755 (800 - 15 - 30), y=200
        this.paddle2 = new Paddle(755, 200, 15, 100, 5);

        // Bola - no centro do canvas
        // x=400, y=250 (centro), size=15, speedX=4, speedY=3
        this.ball = new Ball(400, 250, 15, 4, 3);

        // --- 3. ESTADO DO JOGO ---
        // Variáveis que controlam o fluxo do jogo

        // running = se o jogo está rodando ou pausado
        this.running = false;

        // keys = teclas que estão sendo pressionadas
        // Ex: { 'w': true, 'ArrowUp': false }
        this.keys = {};

        // --- 4. INICIALIZAÇÃO ---
        // Configura os eventos de teclado
        this.setupControls();

        // Mensagem de debug
        console.log('🎮 Game inicializado!');
        console.log(`📐 Canvas: ${this.width}x${this.height}`);
        console.log('🔧 Use game.start() para iniciar');
    }

    /* ==================================================
       MÉTODO: setupControls
       ================================================== 
       Configura os listeners de teclado.
       Quando uma tecla é pressionada, atualizamos
       o objeto `keys` com o estado da tecla.
    */
    setupControls() {
        // --- Tecla pressionada ---
        // Quando o usuário pressiona uma tecla:
        // 1. O navegador dispara um evento 'keydown'
        // 2. Nossa função é chamada com o evento
        // 3. Marcamos a tecla como true no objeto keys
        document.addEventListener('keydown', (event) => {
            // Guarda qual tecla foi pressionada
            // Ex: se pressionar 'w', event.key = 'w'
            this.keys[event.key] = true;

            // Previne comportamento padrão (ex: rolar a página com setas)
            event.preventDefault();
        });

        // --- Tecla solta ---
        // Quando o usuário solta uma tecla:
        // Marcamos a tecla como false no objeto keys
        document.addEventListener('keyup', (event) => {
            this.keys[event.key] = false;
            event.preventDefault();
        });

        console.log('⌨️ Controles configurados: W/S e Setas');
    }

    /* ==================================================
       MÉTODO: update
       ================================================== 
       Atualiza a lógica do jogo a cada frame.
       Isso inclui:
       - Movimento das raquetes
       - Movimento da bola
       - Colisões
       - Detecção de gols
       
       Este método é chamado ~60 vezes por segundo.
    */
    update() {
        // --- 1. MOVIMENTO DAS RAQUETES ---
        // Verificamos quais teclas estão pressionadas
        // e movemos as raquetes na direção correta.

        // Jogador 1 (esquerda) - Teclas W/S
        if (this.keys['w'] || this.keys['W']) {
            // Move para cima (-1) com a velocidade definida
            this.paddle1.move(-1, this.height);
        }
        if (this.keys['s'] || this.keys['S']) {
            // Move para baixo (+1)
            this.paddle1.move(1, this.height);
        }

        // Jogador 2 (direita) - Setas ↑/↓
        if (this.keys['ArrowUp']) {
            this.paddle2.move(-1, this.height);
        }
        if (this.keys['ArrowDown']) {
            this.paddle2.move(1, this.height);
        }

        // --- 2. MOVIMENTO DA BOLA ---
        // A bola se move sozinha, baseada na sua velocidade
        this.ball.move();

        // --- 3. COLISÃO COM BORDAS SUPERIOR/INFERIOR ---
        // Se a bola bate no topo ou na base, inverte a direção Y
        if (this.ball.y <= 0 || this.ball.y + this.ball.size >= this.height) {
            this.ball.reverseY();
        }

        // --- 4. DETECÇÃO DE GOL (por enquanto apenas log) ---
        // Se a bola saiu pela esquerda ou direita
        if (this.ball.isOutOfBounds(this.width)) {
            if (this.ball.x < 0) {
                // Saiu pela esquerda = ponto do jogador 2
                console.log('🏆 Gol do Jogador 2!');
                this.paddle2.score++;
            } else {
                // Saiu pela direita = ponto do jogador 1
                console.log('🏆 Gol do Jogador 1!');
                this.paddle1.score++;
            }
            // Reseta a bola para o centro
            this.ball.reset();
        }

        // --- 5. COLISÃO COM RAQUETES (será implementado na Issue #6) ---
        // Por enquanto, a bola atravessa as raquetes.
        // Vamos implementar a colisão em uma issue futura.
    }

    /* ==================================================
       MÉTODO: draw
       ================================================== 
       Desenha tudo na tela.
       Este método é chamado ~60 vezes por segundo.
       
       A ordem de desenho importa:
       1. Limpa a tela
       2. Desenha o fundo
       3. Desenha elementos de fundo (linha central)
       4. Desenha as entidades (raquetes, bola)
       5. Desenha a UI (placar)
    */
    draw() {
        // 1. Limpa a tela (fundo preto)
        this.renderer.clear();

        // 2. Desenha a linha central (estilo Pong)
        this.renderer.drawCenterLine();

        // 3. Desenha as raquetes
        this.renderer.drawPaddle(this.paddle1);
        this.renderer.drawPaddle(this.paddle2);

        // 4. Desenha a bola
        this.renderer.drawBall(this.ball);

        // 5. Desenha o placar
        this.renderer.drawScore(this.paddle1.score, this.paddle2.score);
    }

    /* ==================================================
       MÉTODO: loop
       ================================================== 
       O loop principal do jogo.
       Este método se chama recursivamente ~60 vezes por segundo.
       
       Como funciona:
       1. Verifica se o jogo está rodando
       2. Atualiza a lógica (update)
       3. Desenha na tela (draw)
       4. Pede para ser chamado novamente (requestAnimationFrame)
       
       requestAnimationFrame é como um "setInterval" inteligente:
       - Sincroniza com o monitor (60 FPS ou mais)
       - Para quando a aba não está visível (economiza energia)
       - Mais suave que setInterval
    */
    loop() {
        // Se o jogo não está rodando, não faz nada
        if (!this.running) return;

        // 1. Atualiza a lógica
        this.update();

        // 2. Desenha na tela
        this.draw();

        // 3. Chama a si mesmo no próximo frame
        // requestAnimationFrame recebe uma função callback
        // e a chama quando o monitor estiver pronto para o próximo frame
        requestAnimationFrame(() => this.loop());
    }

    /* ==================================================
       MÉTODO: start
       ================================================== 
       Inicia o jogo.
       Coloca running = true e começa o loop.
    */
    start() {
        this.running = true;
        this.loop();
        console.log('▶️ Jogo iniciado!');
    }

    /* ==================================================
       MÉTODO: pause
       ================================================== 
       Pausa o jogo.
       Coloca running = false, o que para o loop.
    */
    pause() {
        this.running = false;
        console.log('⏸️ Jogo pausado');
    }

    /* ==================================================
       MÉTODO: togglePause (útil para debug)
       ================================================== 
       Alterna entre pausado e rodando.
    */
    togglePause() {
        if (this.running) {
            this.pause();
        } else {
            this.start();
        }
    }
}

/* =====================================================
   EXPORTAÇÃO
   ===================================================== 
   Exportamos a classe Game para que outros arquivos
   possam importá-la.
   Ex: import Game from './game.js';
*/
export default Game;