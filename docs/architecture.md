# 🏗️ Arquitetura do Pong Multiplayer

## Visão Geral

Este documento explica a estrutura do projeto e por que cada decisão foi tomada.

## Filosofia: Arquitetura em Camadas

### O que é arquitetura em camadas?

É como organizar um prédio em andares:
- **Térreo** (UI): O que o usuário vê
- **1º andar** (Core): A lógica do negócio
- **2º andar** (Network): Comunicação com o mundo
- **Subsolo** (Utils): Ferramentas úteis para todos

### Por que usar camadas?

1. **Separação de responsabilidades**: Cada arquivo faz uma coisa só
2. **Facilidade de testes**: Pode testar cada camada separadamente
3. **Manutenibilidade**: 6 meses depois, você sabe onde está cada código
4. **Escalabilidade**: Fácil adicionar novas funcionalidades

---

## 📁 Estrutura de Pastas
```
client/public/
├── js/
│ ├── core/ # Lógica do jogo (não depende de UI)
│ │ ├── entities/ # Objetos do jogo (Paddle, Ball)
│ │ ├── game.js # Orquestração do jogo
│ │ └── physics.js # Física e colisões
│ ├── network/ # Comunicação com servidor
│ │ └── socket.js # Cliente WebSocket
│ ├── ui/ # Interface do usuário
│ │ └── renderer.js # Desenho no canvas
│ └── utils/ # Funções auxiliares
│ └── helpers.js # Utilitários
├── css/
│ └── style.css # Estilos da página
└── index.html # Página principal
```

---

## 🔄 Fluxo de Dados

### 1. Jogo Local (Fase 1)
```
[Teclado] → [Game.update()] → [Game.draw()] → [Renderer] → [Canvas]
↓
[Entidades]
(Paddle, Ball)
```


### 2. Jogo Online (Fase 3 - Futuro)
```
[Cliente 1] → [Teclado] → [Socket] → [Servidor] → [Socket] → [Cliente 2]
↓
[Game State]
(Estado do jogo)
```

---

## 📚 Termos Importantes

### Canvas
- Elemento HTML que permite desenho via JavaScript
- Ex: `<canvas id="gameCanvas"></canvas>`

### Contexto (ctx)
- A "caneta" que desenha no canvas
- Ex: `ctx.fillRect(x, y, w, h)`

### Game Loop
- O coração do jogo
- `update()` → calcula física
- `draw()` → renderiza na tela
- Roda ~60 vezes por segundo

### requestAnimationFrame
- Função que sincroniza o loop com o monitor
- Mais eficiente que `setInterval`

### Entidades
- Objetos do jogo (raquete, bola)
- Cada um tem posição, tamanho, velocidade

### Renderer
- Responsável por desenhar as entidades
- Separa a lógica de desenho da lógica do jogo

### WebSocket (Futuro)
- Canal de comunicação persistente entre cliente e servidor
- Permite comunicação em tempo real

---

## 🧠 Por que isso é importante?

Entender essa arquitetura te prepara para:
- Projetos maiores e mais complexos
- Trabalho em equipe (cada pessoa em uma camada)
- Debug mais fácil (sabe onde procurar o erro)
- Reutilização de código (pode usar a física em outro projeto)

## 🔗 Relação com Redes

A arquitetura em camadas é um conceito que se repete em redes:

| Camada de Software | Camada de Rede (OSI) |
|-------------------|---------------------|
| UI (interface)    | Aplicação (HTTP)    |
| Core (lógica)     | Transporte (TCP)    |
| Network (comunicação) | Rede (IP)         |
| Utils (ferramentas) | Enlace (Ethernet) |

Entender uma ajuda a entender a outra!