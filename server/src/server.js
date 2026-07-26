// =====================================================
// 1. CARREGAR VARIÁVEIS DE AMBIENTE (.env)
// =====================================================

require('dotenv').config();

// =====================================================
// 2. IMPORTAÇÕES
// =====================================================

const express = require('express');
const path = require('path');

// =====================================================
// 3. CONFIGURAÇÃO DO SERVIDOR
// =====================================================

const app = express();

const PORT = process.env.PORT || 3000;

const NODE_ENV = process.env.NODE_ENV || 'development';

// =====================================================
// 4. MIDDLEWARE
// =====================================================

// Servir arquivos estáticos da pasta client/public
// path.join resolve o caminho independente do SO
app.use(express.static(path.join(__dirname, '../../client/public')));

// =====================================================
// 5. ROTAS
// =====================================================

// Rota principal: entrega o index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/public/index.html'));
});

// Rota de teste /ping
app.get('/ping', (req, res) => {
    res.json({
        message: 'pong',
        timestamp: new Date().toISOString(),
        status: 'Server is running!',
        environment: NODE_ENV, // Mostra qual ambiente está rodando
        port: PORT
    });
});

// =====================================================
// 6. INICIA O SERVIDOR
// =====================================================

app.listen(PORT, () => {
    console.log('========================================');
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    console.log(`🌍 Ambiente: ${NODE_ENV}`);
    console.log('========================================');
    console.log(`📁 Servindo arquivos da pasta: client/public`);
    console.log(`🔄 Pressione Ctrl+C para parar o servidor`);
    console.log('========================================');
    console.log(`🧪 Teste as rotas:`);
    console.log(`   - http://localhost:${PORT}/ → Jogo Pong`);
    console.log(`   - http://localhost:${PORT}/ping → Teste do servidor`);
    console.log('========================================');
});