# 🎾 Do Osciloscópio ao Multiplayer

> Recriando o primeiro jogo da história para entender como a internet funciona de verdade.

---

## 💡 A Ideia

Tudo começou com uma lembrança: o primeiro jogo eletrônico foi uma simulação de tênis — o *Tennis for Two* (1958), seguido pelo icônico **Pong** (1972). Dois retângulos, uma bola, e a semente de toda uma indústria.

Me peguei pensando: "E se eu pegasse esse conceito mais primitivo de jogo e o trouxesse para a era da internet?" Não para fazer o próximo Fortnite, mas para **entender na prática** como dois computadores conversam em tempo real.

Este projeto é essa jornada. Vou construir um Pong multiplayer, passo a passo, documentando cada descoberta. No final, quero olhar para trás e saber explicar exatamente o que acontece quando alguém aperta uma tecla e outra pessoa, do outro lado da cidade, vê a raquete se mover.

---

## 🧠 Por Que Isso Importa (Além do Jogo)

A tecnologia que faz um Pong online funcionar é a mesma que sustenta:

- Salas de bate-papo (chat em tempo real)
- Colaboração em documentos (Google Docs)
- Notificações ao vivo (apps de mensagem, entregas)
- Jogos multiplayer de qualquer escala

No coração de tudo isso está um protocolo chamado **WebSocket** — um canal de comunicação permanente entre cliente e servidor. Entender esse fluxo é entender a espinha dorsal da web moderna. E nada melhor que um jogo para tornar esse aprendizado concreto e visual.

---

## 📋 Metodologia: Pensando Antes de Codificar

Fazer um projeto sozinho exige disciplina diferente de um time. Sem ninguém para cobrar presença na daily, o risco de começar animado e abandonar é real.

Por isso, antes da primeira linha de código, defini **como** vou trabalhar:

**Personal Kanban + Scrumban (híbrido)**

- **Quadro Kanban** no GitHub Projects com 4 colunas: `Backlog | Ready (3) | In Progress (1) | Done`
- **Limite de WIP (Work in Progress):** no máximo **1 tarefa por vez**. Sem multitarefa, sem abrir 5 abas de tutorial ao mesmo tempo.
- **Revisão quinzenal:** a cada duas semanas, paro para jogar o que construí e me pergunto: "Está divertido? O que aprendi? O que travei?"
- **Commits atômicos e documentados:** cada commit fecha uma issue e conta uma micro-história do progresso.

Essa abordagem não foi inventada aqui — o Personal Kanban tem método e livro próprios (Jim Benson), e o Scrumban é documentado por Corey Ladas. A diferença é que estou adaptando ambas para um contexto solo, priorizando clareza e constância.

## 🗺️ As 4 Fases do Projeto

| Fase | Objetivo | Status |
|------|----------|--------|
| **1. Pong Local** | Jogo funcionando no navegador, dois jogadores no mesmo teclado | ✅ COMPLETA |
| **2. Servidor WebSocket** | Servidor Node.js que recebe e envia mensagens em tempo real | ✅ COMPLETA |
| **3. Pong Online** | Servidor como "juiz" do jogo (modelo autoritativo) | ✅ COMPLETA (com ressalvas) |
| **4. Salas e Deploy** | Sistema de salas, tela de espera, deploy público para jogar com um amigo | ✅ COMPLETA |

> ⚠️ **Ressalvas Importantes:** O projeto foi concluído com sucesso e está em produção, porém existem oportunidades de melhoria mapeadas: otimização da latência na transmissão de rede, botões amigáveis para sair de salas e melhoria na concorrência de lobbies múltiplos.

---

## 🏗️ Tecnologias

- **Frontend:** HTML5 Canvas, Vanilla CSS, JavaScript ES Modules (sem frameworks para entender cada detalhe)
- **Backend:** Node.js + Express + Socket.IO
- **Deploy:** Render (servidor e cliente integrados)

---

## 📝 Diário de Bordo

O registro completo do projeto e dos conceitos aprendidos pode ser conferido em:
👉 **[Jornada do Pong Multiplayer (docs/jornada.md)](docs/jornada.md)**

---

## 📌 Links

- **Jogue Agora:** [https://pong-multiplayer-iaua.onrender.com/](https://pong-multiplayer-iaua.onrender.com/)
- [Pong original (1972) — História](https://pt.wikipedia.org/wiki/Pong)
- [Tennis for Two (1958) — O avô dos videogames](https://pt.wikipedia.org/wiki/Tennis_for_Two)

---

*Projeto de aprendizado em desenvolvimento web e redes. Feedbacks são bem-vindos!*
