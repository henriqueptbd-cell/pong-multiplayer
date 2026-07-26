/* =====================================================
   ARQUIVO: renderer.js
   FUNÇÃO: Responsável por DESENHAR tudo no canvas
   CAMADA: UI (Interface do Usuário)
   ===================================================== */

class Renderer {
    /* ==================================================
       CONSTRUTOR
       ================================================== 
       Recebe o canvas e guarda seu contexto.
       O contexto (ctx) é a "caneta" que usamos para desenhar.
    */
    constructor(canvas) {
        this.canvas = canvas;

        // getContext('2d') = pega a "caneta" para desenho 2D
        this.ctx = canvas.getContext('2d');

        // Guarda as dimensões para usar depois
        this.width = canvas.width;
        this.height = canvas.height;
    }

    /* ==================================================
       MÉTODO: clear
       ================================================== 
       Limpa a tela com uma cor de fundo.
       Isso é importante para não ter "rastros" do frame anterior.
    */
    clear() {
        // fillStyle = cor de preenchimento
        this.ctx.fillStyle = '#0a0a1a';

        // fillRect = desenha um retângulo preenchido
        // (x, y, largura, altura)
        // Aqui: preenche TODO o canvas
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /* ==================================================
       MÉTODO: drawPaddle
       ================================================== 
       Desenha uma raquete na tela.
       Recebe um objeto Paddle com as propriedades:
       - x, y (posição)
       - width, height (dimensões)
    */
    drawPaddle(paddle) {
        this.ctx.fillStyle = '#33ff33';    // Cor verde
        this.ctx.shadowColor = '#33ff33';  // Cor da sombra
        this.ctx.shadowBlur = 10;          // Intensidade da sombra

        // Desenha a raquete como um retângulo preenchido
        this.ctx.fillRect(
            paddle.x,
            paddle.y,
            paddle.width,
            paddle.height
        );

        // Reseta a sombra (para não afetar outros desenhos)
        this.ctx.shadowBlur = 0;
    }

    /* ==================================================
       MÉTODO: drawBall
       ================================================== 
       Desenha a bola na tela.
       Recebe um objeto Ball com as propriedades:
       - x, y (posição)
       - size (tamanho)
    */
    drawBall(ball) {
        this.ctx.fillStyle = '#ffffff';    // Cor branca
        this.ctx.shadowColor = '#ffffff';  // Sombra branca
        this.ctx.shadowBlur = 15;          // Mais brilho que a raquete

        // Desenha a bola como um quadrado (por enquanto)
        // Vamos mudar para círculo depois (Issue #2)
        this.ctx.fillRect(
            ball.x,
            ball.y,
            ball.size,
            ball.size
        );

        this.ctx.shadowBlur = 0;
    }

    /* ==================================================
       MÉTODO: drawScore
       ================================================== 
       Desenha o placar na tela.
       Recebe a pontuação dos dois jogadores.
    */
    drawScore(score1, score2) {
        this.ctx.fillStyle = '#33ff33';    // Cor verde
        this.ctx.font = '32px "Courier New", monospace';
        this.ctx.textAlign = 'center';     // Centraliza o texto

        // Placar do Jogador 1 (esquerda)
        // 25% da largura do canvas
        this.ctx.fillText(
            score1,
            this.width * 0.25,
            50
        );

        // Placar do Jogador 2 (direita)
        // 75% da largura do canvas
        this.ctx.fillText(
            score2,
            this.width * 0.75,
            50
        );

        // Reseta o alinhamento (para não afetar outros textos)
        this.ctx.textAlign = 'left';
    }

    /* ==================================================
       MÉTODO: drawCenterLine
       ================================================== 
       Desenha a linha central tracejada (estilo Pong).
       Essa linha divide a quadra ao meio.
    */
    drawCenterLine() {
        this.ctx.strokeStyle = '#33ff33';  // Cor da linha
        this.ctx.lineWidth = 2;            // Espessura

        // setLineDash cria uma linha tracejada
        // [10, 15] = 10px desenhado, 15px vazio
        this.ctx.setLineDash([10, 15]);

        // Desenha uma linha vertical no centro
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();

        // Reseta o estilo de linha (remove o tracejado)
        this.ctx.setLineDash([]);
    }
}

export default Renderer;