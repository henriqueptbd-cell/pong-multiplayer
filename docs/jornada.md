# 🎮 Jornada do Pong Multiplayer

> Diário de bordo do projeto - Aprendendo redes através do primeiro jogo da história

---

## 📖 Sobre Este Documento

Este documento registra **toda a jornada** de construção do Pong Multiplayer. 
Aqui estão:
- As decisões técnicas que tomamos
- Os conceitos que aprendemos em cada fase
- Os "porquês" por trás de cada escolha
- O que cada parte do código significa

**Use este documento como seu "caderno de anotações"** para revisitar conceitos
sempre que precisar.

---

## 🏗️ Fase 1: Pong Local (Completa)

### Objetivo
Construir um jogo Pong totalmente funcional no navegador, com dois jogadores no mesmo teclado.

### Conceitos Aprendidos

#### 1. HTML Canvas
- **O que é**: Um elemento HTML que permite desenhar gráficos com JavaScript.
- **Como funciona**: Você pega o "contexto" do canvas e usa métodos como `fillRect()` para desenhar formas.
- **Analogia**: O canvas é uma "tela de pintura" e o contexto é o "pincel".

```javascript
// Exemplo prático
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100); // Desenha um quadrado vermelho
```

#### 2. Game Loop (requestAnimationFrame)
- **O que é**: O coração de qualquer jogo - um loop que roda ~60 vezes por segundo.
- **Por que usar**: Sincroniza com o monitor, é mais eficiente que `setInterval`.
- **Estrutura**: `update()` (lógica) + `draw()` (renderização) + `requestAnimationFrame()`.

```javascript
// Estrutura do Game Loop
function gameLoop() {
    update(); // Calcula física, movimentos
    draw();   // Desenha na tela
    requestAnimationFrame(gameLoop); // Chama o próximo frame
}
```

#### 3. Entidades (Paddle, Ball)
- **O que são**: Objetos que representam elementos do jogo.
- **Por que usar classes**: Organiza o código, cada entidade tem suas próprias propriedades e métodos.
- **Benefício**: Fácil de adicionar novas entidades no futuro.

```javascript
// Exemplo de entidade
class Paddle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    move(direction) {
        this.y += direction * this.speed;
    }
}
```

#### 4. Detecção de Colisão (AABB)
- **O que é**: Axis-Aligned Bounding Box - verifica se dois retângulos se sobrepõem.
- **Como funciona**: Compara os limites (topo, base, esquerda, direita) de dois objetos.
- **Importância**: Permite que a bola "rebata" nas raquetes.

```javascript
// Colisão AABB
function checkCollision(ball, paddle) {
    const collidesX = ball.x + ball.size > paddle.x && 
                     ball.x < paddle.x + paddle.width;
    const collidesY = ball.y + ball.size > paddle.y && 
                     ball.y < paddle.y + paddle.height;
    return collidesX && collidesY;
}
```

#### 5. Arquitetura em Camadas
- **O que é**: Organizar o código em camadas com responsabilidades diferentes.
- **Por que usar**: Facilita manutenção, testes e escalabilidade.

```
client/public/js/
├── core/          # Lógica do jogo (não depende da UI)
│   ├── entities/  # Objetos (Paddle, Ball)
│   ├── game.js    # Orquestração do jogo
│   └── physics.js # Física e colisões
├── network/       # Comunicação com servidor
├── ui/            # Interface (renderização no canvas)
└── utils/         # Funções auxiliares
```

---

## 🚀 Fase 2: Servidor WebSocket (Completa)

### Objetivo
Criar um servidor que permita comunicação em tempo real entre o jogo e a internet.

### Conceitos Aprendidos

#### 1. Servidores HTTP
- **O que é**: Um programa que "escuta" requisições e entrega respostas.
- **Analogia**: É como um garçom - você faz um pedido (requisição) e ele traz a comida (resposta).
- **Como funciona**: Cliente (navegador) → Requisição → Servidor → Resposta → Cliente.

#### 2. Node.js e Express
- **Node.js**: JavaScript rodando no servidor (não no navegador).
- **Express**: Framework que facilita criar servidores HTTP.
- **Por que usar**: Mais fácil que criar um servidor do zero.

#### 3. WebSocket
- **O que é**: Um canal de comunicação **persistente** entre cliente e servidor.
- **Diferença do HTTP**: HTTP é "liga e desliga" (cada requisição é uma conexão nova). WebSocket mantém a conexão aberta.
- **Analogia**: HTTP é como enviar cartas (abre, escreve, envia, fecha). WebSocket é como um telefone (linha aberta para conversar).

HTTP:        Cliente ──(Requisição HTTP)──> Servidor ──(Resposta HTTP)──> FIM
WebSocket:   Cliente <══════════(Canal Bidirecional Aberto)══════════> Servidor

#### 4. Eventos e Mensagens (JSON)
- **O que é**: O formato estruturado para enviar informações na rede.
- **Como funciona**: Como a conexão está aberta, enviamos "eventos" no formato JSON (ex: jogador moveu, bola rebateu) para que o outro lado saiba o que fazer.
- **Analogia**: É como mandar mensagens de chat padronizadas em um grupo.

```javascript
// Exemplo de envio de dados
const mensagem = JSON.stringify({
    type: 'player_move',
    y: 250
});
socket.send(mensagem);
```

---

## 🌐 Fase 3: Jogo Multiplayer Online (Concluída com Ressalvas)

### Objetivo
Conectar o cliente do jogo (Fase 1) ao servidor WebSocket (Fase 2) para permitir que duas pessoas em computadores diferentes joguem o Pong juntas em tempo real.

### URL da Aplicação
O deploy público foi realizado com sucesso e está disponível em:
👉 **[https://pong-multiplayer-iaua.onrender.com/](https://pong-multiplayer-iaua.onrender.com/)**

### Conceitos Aprendidos

#### 1. Arquitetura Autorizativa (Authoritative Server)
- **O que é**: O servidor é o "juiz supremo" do jogo. Ele calcula a física da bola e a pontuação, enquanto os clientes apenas enviam comandos e mostram o que o servidor mandar.
- **Por que usar**: Evita trapaças (hacks) e garante que ambos os jogadores vejam exatamente a mesma partida.
- **Analogia**: Em um tribunal, o juiz decide o resultado final, e os advogados apenas apresentam os argumentos.

#### 2. Sincronização de Estado (State Synchronization)
- **O que é**: O processo de enviar continuamente a posição de todas as entidades do servidor para todos os clientes conectados.
- **Desafio**: Frequência de atualizações (Tick Rate). Se o servidor enviar dados de menos, o jogo fica travado (laggy). Se enviar de mais, sobrecarrega a rede.
- **Fórmula comum**: Enviar atualizações a uma taxa de 20 a 30 vezes por segundo (ticks por segundo).

#### 3. Interpolação e Predição (Tratamento de Latência)
- **Predição do Cliente (Client Prediction)**: O cliente move a raquete imediatamente ao pressionar a tecla, sem esperar a confirmação do servidor, deixando o jogo responsivo.
- **Interpolação de Clientes (Client Interpolation)**: Suaviza o movimento dos outros elementos (como a bola ou o outro jogador) "desenhando" a transição suave entre a última posição recebida e a nova posição.
- **Por que usar**: Para mascarar a latência natural da internet (ping).

### ⚠️ Status Atual e Ressalvas

Embora a missão principal tenha sido cumprida (o jogo funciona online e está em produção), temos as seguintes ressalvas a serem resolvidas no futuro:

1. **Latência de Rede**: A transmissão de dados fica lenta em alguns momentos, fazendo com que o jogo perca fluidez e pareça travado. Ajustes finos de predição no cliente e otimização do tick rate são necessários para melhorar a jogabilidade.
2. **Interface e Usabilidade**: Faltam botões claros e organizados na tela para criar, entrar e, especialmente, **sair das salas** de forma amigável.
3. **Múltiplas Salas**: A infraestrutura para rodar e gerenciar mais de uma sala simultaneamente com qualidade ainda precisa de melhorias e testes para evitar que a conexão de um jogo interfira no outro.

---

## 🛠️ Como Contribuir para Este Diário
1. **Seja prático**: Sempre inclua analogias do dia a dia e pequenos trechos de código explicativos.
2. **Mantenha atualizado**: Conforme avançamos pelas fases do projeto, atualize o status (ex: de "Em Andamento" para "Completa").
3. **Registre os bugs**: Adicione uma seção de "Desafios Superados" ao final de cada fase quando encontrar erros difíceis de resolver.