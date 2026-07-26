class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear() {
        this.ctx.fillStyle = '#0a0a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawPaddle(paddle) {
        this.ctx.fillStyle = '#33ff33';
        this.ctx.shadowColor = '#33ff33';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
        this.ctx.shadowBlur = 0;
    }

    drawBall(ball) {
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#ffffff';
        this.ctx.shadowBlur = 15;
        this.ctx.fillRect(ball.x, ball.y, ball.size, ball.size);
        this.ctx.shadowBlur = 0;
    }

    drawScore(score1, score2) {
        this.ctx.fillStyle = '#33ff33';
        this.ctx.font = '32px "Courier New", monospace';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(score1, this.width * 0.25, 50);
        this.ctx.fillText(score2, this.width * 0.75, 50);
        this.ctx.textAlign = 'left';
    }

    drawCenterLine() {
        this.ctx.strokeStyle = '#33ff33';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([10, 15]);
        this.ctx.beginPath();
        this.ctx.moveTo(this.width / 2, 0);
        this.ctx.lineTo(this.width / 2, this.height);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    drawPauseOverlay(state, countdownTimer) {
        const ctx = this.ctx;
        const centerX = this.width / 2;
        const centerY = this.height / 2;

        // ==========================================
        // ESTADO: IDLE (Tela inicial - sem fundo extra)
        // ==========================================
        if (state === 'IDLE') {
            ctx.fillStyle = '#FFD700';
            ctx.font = '64px "Courier New", monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('🎮 PONG', centerX, centerY - 60);

            ctx.fillStyle = '#AAAAAA';
            ctx.font = '24px "Courier New", monospace';
            ctx.fillText('Pressione P para começar', centerX, centerY + 30);

            ctx.font = '18px "Courier New", monospace';
            ctx.fillText('W/S (Jogador 1) | Setas (Jogador 2)', centerX, centerY + 80);

            ctx.textAlign = 'left';
            ctx.textBaseline = 'alphabetic';
            return;
        }

        // ==========================================
        // DEMAIS ESTADOS: Fundo semi-transparente
        // ==========================================
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // ==========================================
        // ESTADO: COUNTDOWN_START (Iniciando)
        // ==========================================
        if (state === 'COUNTDOWN_START') {
            const seconds = Math.ceil(countdownTimer);

            ctx.fillStyle = '#51CF66';
            ctx.font = '72px "Courier New", monospace';
            ctx.fillText(seconds > 0 ? seconds : 'VAI!', centerX, centerY - 20);

            ctx.fillStyle = '#AAAAAA';
            ctx.font = '24px "Courier New", monospace';
            ctx.fillText(seconds > 0 ? 'Preparar...' : '🎮', centerX, centerY + 60);
        }

        // ==========================================
        // ESTADO: PAUSED
        // ==========================================
        else if (state === 'PAUSED') {
            ctx.fillStyle = '#FFD700';
            ctx.font = '48px "Courier New", monospace';
            ctx.fillText('⏸️ PAUSADO', centerX, centerY - 30);

            ctx.fillStyle = '#AAAAAA';
            ctx.font = '20px "Courier New", monospace';
            ctx.fillText('Pressione P para retomar (3s)', centerX, centerY + 30);
        }

        // ==========================================
        // ESTADO: COUNTDOWN_RESUME
        // ==========================================
        else if (state === 'COUNTDOWN_RESUME') {
            const seconds = Math.ceil(countdownTimer);

            ctx.fillStyle = '#51CF66';
            ctx.font = '72px "Courier New", monospace';
            ctx.fillText(seconds, centerX, centerY - 20);

            ctx.fillStyle = '#AAAAAA';
            ctx.font = '24px "Courier New", monospace';
            ctx.fillText('Retomando...', centerX, centerY + 60);

            ctx.fillStyle = '#FF6B6B';
            ctx.font = '16px "Courier New", monospace';
            ctx.fillText('Pressione P para cancelar', centerX, centerY + 100);
        }

        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';
    }
}

export default Renderer;