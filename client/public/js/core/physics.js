/* =====================================================
   ARQUIVO: physics.js
   FUNÇÃO: Lógica de física e colisões do jogo
   CAMADA: Core (Lógica central)
   ===================================================== */

/* =====================================================
   FUNÇÃO: checkPaddleCollision
   ===================================================== 
   Verifica se a bola colidiu com uma raquete.
   
   Como funciona a detecção?
   Usamos AABB (Axis-Aligned Bounding Box):
   - Verificamos se a bola está na mesma área X e Y que a raquete
   - Se as áreas se sobrepõem, há colisão!
   
   Parâmetros:
   - ball: objeto da bola (com x, y, size)
   - paddle: objeto da raquete (com x, y, width, height)
   
   Retorna:
   - true: se houve colisão
   - false: se não houve colisão
*/
export function checkPaddleCollision(ball, paddle) {
    // --- 1. CALCULAR OS EXTREMOS DA BOLA ---
    // A bola é um quadrado (ou círculo) com posição (x, y) e size
    const ballLeft = ball.x;
    const ballRight = ball.x + ball.size;
    const ballTop = ball.y;
    const ballBottom = ball.y + ball.size;

    // --- 2. CALCULAR OS EXTREMOS DA RAQUETE ---
    // A raquete é um retângulo com posição (x, y), width e height
    const paddleLeft = paddle.x;
    const paddleRight = paddle.x + paddle.width;
    const paddleTop = paddle.y;
    const paddleBottom = paddle.y + paddle.height;

    // --- 3. VERIFICAR SOBREPOSIÇÃO ---
    // Colisão AABB: os retângulos se sobrepõem se:
    // - A direita da bola > a esquerda da raquete
    // - A esquerda da bola < a direita da raquete
    // - A base da bola > o topo da raquete
    // - O topo da bola < a base da raquete

    const collidesX = ballRight > paddleLeft && ballLeft < paddleRight;
    const collidesY = ballBottom > paddleTop && ballTop < paddleBottom;

    // Só há colisão se houver sobreposição em AMBOS os eixos
    return collidesX && collidesY;
}

/* =====================================================
   FUNÇÃO: calculateBounceAngle
   ===================================================== 
   Calcula o ângulo de rebatida baseado em onde a bola 
   atingiu a raquete.
   
   Quanto mais longe do centro, maior o ângulo.
   Isso dá mais realismo e variedade ao jogo!
   
   Parâmetros:
   - ball: objeto da bola
   - paddle: objeto da raquete
   
   Retorna:
   - number: entre -1 e 1, representando o ângulo vertical
     * 0 = rebate reto (horizontal)
     * positivo = bola vai para baixo
     * negativo = bola vai para cima
*/
export function calculateBounceAngle(ball, paddle) {
    // --- 1. CALCULAR O CENTRO DA RAQUETE ---
    const paddleCenterY = paddle.y + paddle.height / 2;

    // --- 2. CALCULAR O CENTRO DA BOLA ---
    const ballCenterY = ball.y + ball.size / 2;

    // --- 3. CALCULAR A POSIÇÃO RELATIVA ---
    // Distância do centro da raquete ao centro da bola
    // Dividido pela metade da altura da raquete (normaliza entre -1 e 1)
    const relativeY = (ballCenterY - paddleCenterY) / (paddle.height / 2);

    // --- 4. LIMITAR O ÂNGULO ---
    // Garante que o ângulo não ultrapasse -1 ou 1
    // Isso evita ângulos "estranhos" quando a bola bate nas bordas
    return Math.max(-1, Math.min(1, relativeY));
}

/* =====================================================
   FUNÇÃO: correctBallPosition
   ===================================================== 
   Corrige a posição da bola quando ela colide com a raquete.
   Isso evita que a bola "entre" na raquete (bug visual).
   
   Parâmetros:
   - ball: objeto da bola
   - paddle: objeto da raquete
   - direction: 1 (direita) ou -1 (esquerda)
*/
export function correctBallPosition(ball, paddle, direction) {
    // Coloca a bola ao lado da raquete, não dentro dela
    if (direction === 1) {
        // Colisão pela direita: bola fica à direita da raquete
        ball.x = paddle.x + paddle.width;
    } else {
        // Colisão pela esquerda: bola fica à esquerda da raquete
        ball.x = paddle.x - ball.size;
    }
}

/* =====================================================
   FUNÇÃO: checkWallCollision
   ===================================================== 
   Verifica se a bola colidiu com as paredes superior/inferior.
   Retorna true se colidiu, false caso contrário.
*/
export function checkWallCollision(ball, canvasHeight) {
    const ballTop = ball.y;
    const ballBottom = ball.y + ball.size;

    // Colidiu com o topo?
    if (ballTop <= 0) {
        ball.y = 0; // Corrige posição
        return true;
    }

    // Colidiu com a base?
    if (ballBottom >= canvasHeight) {
        ball.y = canvasHeight - ball.size; // Corrige posição
        return true;
    }

    return false;
}

/* =====================================================
   FUNÇÃO: detectGoal
   ===================================================== 
   Verifica se a bola saiu pela lateral (gol).
   Retorna:
   - 1: gol do jogador 1 (bola saiu pela direita)
   - -1: gol do jogador 2 (bola saiu pela esquerda)
   - 0: sem gol
*/
export function detectGoal(ball, canvasWidth) {
    if (ball.x < 0) {
        return -1; // Gol do jogador 2
    }
    if (ball.x > canvasWidth) {
        return 1; // Gol do jogador 1
    }
    return 0; // Sem gol
}

/* =====================================================
   FUNÇÃO: increaseBallSpeed
   ===================================================== 
   Aumenta a velocidade da bola a cada rebatida.
   Isso torna o jogo mais desafiador com o tempo!
   
   Parâmetros:
   - ball: objeto da bola
   - increment: fator de aumento (ex: 1.05 = 5% mais rápido)
*/
export function increaseBallSpeed(ball, increment = 1.05) {
    // Aplica o fator de aumento
    ball.speedX *= increment;
    ball.speedY *= increment;

    // Limita a velocidade máxima para não ficar impossível
    const MAX_SPEED = 10;
    if (Math.abs(ball.speedX) > MAX_SPEED) {
        ball.speedX = Math.sign(ball.speedX) * MAX_SPEED;
    }
    if (Math.abs(ball.speedY) > MAX_SPEED) {
        ball.speedY = Math.sign(ball.speedY) * MAX_SPEED;
    }
}