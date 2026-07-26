# 🚀 Como Rodar o Projeto

## Pré-requisitos

- Node.js (versão 16 ou superior)
- Navegador moderno (Chrome, Firefox, Edge)

---

## 🖥️ Rodando o Jogo Local (Fase 1)

### Método 1: Servidor HTTP Simples (Recomendado)

```bash
# 1. Instale o live-server (uma vez só)
npm install -g live-server

# 2. Navegue até a pasta do projeto
cd pong-multiplayer/client/public

# 3. Inicie o servidor
live-server
```
# O jogo vai abrir automaticamente no navegador
```

### Método 2: VS Code Live Server
```bash
    Instale a extensão "Live Server" no VS Code
```
```bash
    Clique com o botão direito no index.html

    Selecione "Open with Live Server"
```

### Método 3: Python (se tiver Python instalado)
```bash
cd pong-multiplayer/client/public
python -m http.server 8000

# Acesse: http://localhost:8000

```

## 🖥️ Rodando o Servidor (Fase 2 - Futuro)
```bash
# 1. Instale as dependências
cd server
npm install

# 2. Inicie o servidor
npm start

# 3. Acesse: http://localhost:3000
```

## 🐛 Debug

### Abrir o Console do Navegador

- Chrome/Edge: F12 ou Ctrl+Shift+I

- Firefox: F12 ou Ctrl+Shift+I

- Safari: Cmd+Option+I

### Comandos Úteis no Console

- Ver o estado do jogo

- Pausar

- Continuar