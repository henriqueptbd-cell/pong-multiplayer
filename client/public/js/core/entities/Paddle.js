/* =====================================================
   ARQUIVO: Paddle.js
   FUNÇÃO: Classe que representa uma RAQUETE
   CAMADA: Core - Entities (Entidades do jogo)
   ===================================================== */

class Paddle {
    /* ==================================================
       CONSTRUTOR
       ================================================== 
       Cria uma nova raquete com as propriedades:
       - x, y: posição (canto superior esquerdo)
       - width, height: dimensões
       - speed: velocidade de movimento
    */
    constructor(x, y, width, height, speed) {
        // Posição
        this.x = x;
        this.y = y;

        // Dimensões
        this.width = width;
        this.height = height;

        // Velocidade (quantos pixels por frame)
        this.speed = speed;

        // Pontuação (começa em 0)
        this.score = 0;
    }

    /* ==================================================
       MÉTODO: move
       ================================================== 
       Move a raquete para cima ou para baixo.
       - direction: -1 (cima) ou 1 (baixo)
       - canvasHeight: altura do canvas (para não sair da tela)
       
       Retorna:
       - true: se moveu
       - false: se não moveu (bateu na borda)
    */
    move(direction, canvasHeight) {
        // Calcula a nova posição
        // direction * speed = deslocamento (ex: -1 * 5 = -5)
        const newY = this.y + (direction * this.speed);

        // Verifica se a raquete não vai sair da tela
        // Borda superior: newY >= 0
        // Borda inferior: newY + height <= canvasHeight
        if (newY >= 0 && newY + this.height <= canvasHeight) {
            this.y = newY;
            return true; // Moveu com sucesso
        }

        return false; // Não moveu (bateu na borda)
    }

    /* ==================================================
       MÉTODO: reset
       ================================================== 
       Reseta a posição da raquete.
       Útil quando reiniciamos o jogo.
    */
    reset(y) {
        this.y = y;
    }

    /* ==================================================
       GETTER: centerY
       ================================================== 
       Calcula e retorna o centro Y da raquete.
       Útil para cálculos de colisão (Issue #6).
    */
    get centerY() {
        // Centro = posição Y + metade da altura
        return this.y + this.height / 2;
    }
}

export default Paddle;