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

---

## 🗺️ As 4 Fases do Projeto

| Fase | Objetivo | Status |
|------|----------|--------|
| **1. Pong Local** | Jogo funcionando no navegador, dois jogadores no mesmo teclado | ✅ COMPLETA |
| **2. Servidor WebSocket** | Servidor Node.js que recebe e envia mensagens em tempo real | ✅ COMPLETA |
| **3. Pong Online** | Servidor como "juiz" do jogo (modelo autoritativo), duas abas se enfrentando | 🔄 EM ANDAMENTO |
| **4. Salas e Deploy** | Sistema de salas, tela de espera, deploy público para jogar com um amigo | ⬜ Pendente |

---

## 🏗️ Tecnologias

- **Frontend:** HTML5 Canvas, JavaScript vanilla (sem frameworks — quero entender cada pixel)
- **Backend:** Node.js + Socket.IO
- **Deploy:** Railway ou Render (servidor) + GitHub Pages (cliente)
- **Gestão:** GitHub Projects (Kanban) + GitHub Issues

---

## 📝 Diário de Bordo

### [DATA DE HOJE] — Fundação do Projeto

Hoje o projeto nasceu. Ainda não tem código, mas tem direção. Criei este repositório com uma estrutura de Kanban e um README que explica o "porquê" antes do "como". 

A primeira tarefa será montar o canvas e o loop principal do jogo — um retângulo que se move com o teclado. Parece pouco, mas é a semente de tudo que virá depois.

*"Um jogo de 1972 está prestes a me ensinar sobre a internet de 2024. Vamos nessa."*

---

## 📌 Links

- [Quadro Kanban do Projeto](LINK EM PRODUÇÂO)
- [Pong original (1972) — História](https://pt.wikipedia.org/wiki/Pong)
- [Tennis for Two (1958) — O avô dos videogames](https://pt.wikipedia.org/wiki/Tennis_for_Two)

---

*Projeto de aprendizado em desenvolvimento web e redes. Feedbacks são bem-vindos!*
