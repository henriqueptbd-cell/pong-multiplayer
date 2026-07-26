/* =====================================================
   ARQUIVO: Ball.js
   FUNÇÃO: Classe que representa a BOLA
   CAMADA: Core - Entities (Entidades do jogo)
   ===================================================== */

class Ball {
    /* ==================================================
       CONSTRUTOR
       ================================================== 
       Cria uma nova bola com as propriedades:
       - x, y: posição (canto superior esquerdo)
       - size: tamanho (quadrado/círculo)
       - speedX, speedY: velocidade em cada eixo
    */
    constructor(x, y, size, speedX, speedY) {
        // Posição atual
        this.x = x;
        this.y = y;

        // Tamanho
        this.size = size;

        // Velocidade atual
        this.speedX = speedX;
        this.speedY = speedY;

        // Guarda as velocidades iniciais para reset
        this.initialSpeedX = speedX;
        this.initialSpeedY = speedY;
    }

    /* ==================================================
       MÉTODO: move
       ================================================== 
       Move a bola uma posição.
       A bola se move somando a velocidade à posição.
       Ex: x = x + speedX
    */
    move() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    /* ==================================================
       MÉTODO: reverseX
       ================================================== 
       Inverte a direção horizontal da bola.
       Usado quando a bola bate em uma raquete.
    */
    reverseX() {
        this.speedX = -this.speedX;
    }

    /* ==================================================
       MÉTODO: reverseY
       ================================================== 
       Inverte a direção vertical da bola.
       Usado quando a bola bate no topo ou base.
    */
    reverseY() {
        this.speedY = -this.speedY;
    }

    /* ==================================================
       MÉTODO: reset
       ================================================== 
       Reseta a bola para o centro do canvas.
       A direção inicial é aleatória (para não ficar repetitiva).
    */
    reset() {
        // Posição central
        this.x = 400;  // 800/2
        this.y = 250;  // 500/2

        // Velocidade X aleatória (esquerda ou direita)
        // Math.random() > 0.5 = 50% de chance
        this.speedX = this.initialSpeedX * (Math.random() > 0.5 ? 1 : -1);

        // Velocidade Y aleatória (cima ou baixo)
        this.speedY = this.initialSpeedY * (Math.random() > 0.5 ? 1 : -1);
    }

    /* ==================================================
       MÉTODO: isOutOfBounds
       ================================================== 
       Verifica se a bola saiu da tela pela lateral.
       Retorna:
       - true: se saiu pela esquerda OU direita
       - false: se está dentro da tela
    */
    isOutOfBounds(canvasWidth) {
        // x < 0 = saiu pela esquerda
        // x > canvasWidth = saiu pela direita
        return this.x < 0 || this.x > canvasWidth;
    }

    /* ==================================================
       GETTERS: centerX, centerY
       ================================================== 
       Calculam e retornam o centro da bola.
       Útil para cálculos de colisão (Issue #6).
    */
    get centerX() {
        return this.x + this.size / 2;
    }

    get centerY() {
        return this.y + this.size / 2;
    }
}

export default Ball;