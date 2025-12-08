# 🍅 Pomodoro Garden

A playful, single‑file web app that helps you focus using the Pomodoro technique while growing a virtual garden of trees, flowers, and butterflies. Multilingual UI (ES/PT/EN), responsive layout, and data saved locally.

---

## 🇺🇸 English

### Overview
- Focus timer with three modes: `Focus`, `Short Break`, `Long Break`.
- Visual rewards when a timer completes: `Tree` (with fruits), `Flower`, `Butterfly`.
- Multilingual interface (Spanish, Portuguese, English) with quick language toggles.
- Fully client‑side; no build step; uses Tailwind via CDN.

### Quick Start
- Open `index.html` in a modern browser.
- Choose a mode and press `Start`.
- When time reaches `00:00`, a reward is added to your garden.
- Your garden and language preference persist in `localStorage`.
- Use `Reset Garden` to clear all saved items.
- See live demo: https://pomodorogarden.netlify.app/

### Features
- Modes and rewards (`index.html:215`):
  - `Focus` → 25 min → `Tree`
  - `Short Break` → 5 min → `Flower`
  - `Long Break` → 15 min → `Butterfly`
- Animated garden:
  - Trees get random fruit clusters; flowers bloom; butterflies flutter across the sky.
- Name your trees by clicking them.
- Responsive grid layout (`grid-cols-4 sm:grid-cols-6 md:grid-cols-8`).

### How It Works
- State and persistence:
  - Garden items are stored in `localStorage` under `pomodoroGarden` (`index.html:615`).
  - Language stored in `pomodoroLang` and applied via `I18N` (`index.html:264`, `index.html:363`).
  - Theme key `pomodoroTheme` is read on load; `.dark` class is currently forced (`index.html:8`, `index.html:475`).
- Timer lifecycle (`index.html:513`–`index.html:594`):
  - `startTimer` → counts down each second.
  - `pauseTimer` → stops counting.
  - `resetTimer` → restores selected mode duration.
  - `completeCycle` → plays a sound, adds a reward, shows an alert, auto‑resets.
- Rewards and rendering:
  - Rewards decided by `MODES[currentMode].reward` (`index.html:587`).
  - `addRewardToGarden` pushes an item with an emoji and id (`index.html:602`–`index.html:612`).
  - `renderGarden` places items: ground grid for trees/flowers; sky layer for butterflies (`index.html:618`–`index.html:680`).
  - Trees: fruit generation and placement (`index.html:699`–`index.html:715`).
- UI controls:
  - Language buttons (`index.html:137`–`index.html:141`).
  - Mode selector (`index.html:145`–`index.html:149`).
  - Start/Pause toggle (`index.html:165`).
  - Timer reset (`index.html:168`).
  - Garden reset (`index.html:184`, `index.html:748`–`index.html:754`).
- Progress ring: SVG circumference math and updates (`index.html:478`–`index.html:503`).

### Customization Guide
- Change durations and reward mapping in `MODES` (`index.html:215`–`index.html:219`).
- Add or replace emojis in `ASSETS` (`index.html:221`–`index.html:225`).
- Tweak fruit types in `FRUITS_GENERAL` / `FRUITS_PALM` (`index.html:227`–`index.html:229`).
- Replace the alarm sound by editing the `<source src>` URL (`index.html:125`).
- Adjust grid density via Tailwind classes on `#garden-grid` (`index.html:203`).
- Theme: remove or toggle the `.dark` class behavior if you prefer light mode.

### Data Model
- Base item: `{ type, emoji, id, delay }`.
- Trees add `{ fruits: string[], fruitPositions: {left, top}[], name?: string }`.
- Butterflies add `{ left: number, top: number }` percentages for sky placement.

### Browser Support & Privacy
- Works on modern Chromium, Firefox, Safari.
- Uses `localStorage` for persistence and optional `Notification.requestPermission()`.
- All data stays in your browser.

---

## 🇧🇷 Português

### Visão Geral
- Timer de foco com três modos: `Foco`, `Pausa Curta`, `Pausa Longa`.
- Recompensas visuais ao concluir: `Árvore` (com frutos), `Flor`, `Borboleta`.
- Interface multilíngue (ES/PT/EN) com alternância rápida de idioma.
- 100% no cliente; sem build; Tailwind via CDN.

### Como Usar
- Abra `index.html` em um navegador moderno.
- Escolha um modo e clique em `Começar`.
- Ao chegar em `00:00`, uma recompensa é adicionada ao jardim.
- O jardim e o idioma ficam salvos em `localStorage`.
- Use `Reiniciar Jardim` para apagar tudo.
- Veja a demo ao vivo: https://pomodorogarden.netlify.app/

### Recursos
- Modos e recompensas (`index.html:215`):
  - `Foco` → 25 min → `Árvore`
  - `Pausa Curta` → 5 min → `Flor`
  - `Pausa Longa` → 15 min → `Borboleta`
- Jardim animado:
  - Árvores recebem frutos aleatórios; flores desabrocham; borboletas voam.
- Dê nome às árvores clicando nelas.
- Layout responsivo em grade.

### Como Funciona
- Estado e persistência:
  - Itens do jardim em `localStorage` (`pomodoroGarden`) (`index.html:615`).
  - Idioma em `pomodoroLang` aplicado via `I18N` (`index.html:264`, `index.html:363`).
  - Tema lido de `pomodoroTheme`; `.dark` é aplicado por padrão (`index.html:8`, `index.html:475`).
- Ciclo do timer (`index.html:513`–`index.html:594`):
  - `startTimer`, `pauseTimer`, `resetTimer`, `completeCycle`.
- Recompensas e renderização:
  - Decididas por `MODES[currentMode].reward` (`index.html:587`).
  - `addRewardToGarden` cria item com emoji e id (`index.html:602`–`index.html:612`).
  - `renderGarden` posiciona no solo ou no céu (`index.html:618`–`index.html:680`).
  - Árvores: criação e posicionamento de frutos (`index.html:699`–`index.html:715`).
- Controles de UI: idiomas, modos, iniciar/pausar, reset do timer e do jardim.
- Anel de progresso: cálculo e atualização do SVG (`index.html:478`–`index.html:503`).

### Personalização
- Ajuste durações e recompensas em `MODES` (`index.html:215`–`index.html:219`).
- Troque emojis em `ASSETS` (`index.html:221`–`index.html:225`).
- Edite tipos de frutos em `FRUITS_GENERAL` / `FRUITS_PALM` (`index.html:227`–`index.html:229`).
- Mude o som do alarme (`index.html:125`).
- Ajuste a densidade da grade (`index.html:203`).
- Tema: altere o uso da classe `.dark` conforme preferir.

### Modelo de Dados
- Item base: `{ type, emoji, id, delay }`.
- Árvores: `{ fruits[], fruitPositions[], name? }`.
- Borboletas: `{ left, top }` em porcentagem.

### Suporte & Privacidade
- Funciona nos principais navegadores modernos.
- Usa `localStorage` e, opcionalmente, `Notification`.
- Todos os dados ficam no seu navegador.

---

## 🇪🇸 Español

### Descripción
- Temporizador Pomodoro con tres modos: `Enfoque`, `Descanso Corto`, `Descanso Largo`.
- Recompensas visuales al completar: `Árbol` (con frutas), `Flor`, `Mariposa`.
- Interfaz multilingüe (ES/PT/EN) con botones de idioma.
- App 100% del lado del cliente; Tailwind por CDN.

### Uso Rápido
- Abre `index.html` en un navegador moderno.
- Elige modo y pulsa `Comenzar`.
- Al llegar a `00:00`, se añade una recompensa al jardín.
- El jardín y el idioma se guardan en `localStorage`.
- Usa `Reiniciar Jardín` para borrar todo.
- Ver demo en vivo: https://pomodorogarden.netlify.app/

### Funcionalidades
- Modos y recompensas (`index.html:215`):
  - `Enfoque` → 25 min → `Árbol`
  - `Descanso Corto` → 5 min → `Flor`
  - `Descanso Largo` → 15 min → `Mariposa`
- Jardín animado con frutas aleatorias, flores y mariposas volando.
- Puedes nombrar tus árboles haciendo clic.
- Diseño responsivo en rejilla.

### Funcionamiento Interno
- Estado y persistencia:
  - `pomodoroGarden` en `localStorage` (`index.html:615`).
  - Idioma en `pomodoroLang` aplicado con `I18N` (`index.html:264`, `index.html:363`).
  - Tema: se lee `pomodoroTheme`, y `.dark` se aplica por defecto (`index.html:8`, `index.html:475`).
- Ciclo de temporizador (`index.html:513`–`index.html:594`).
- Recompensas y renderizado (`index.html:587`, `index.html:602`–`index.html:680`).
- Árboles: frutas y posiciones (`index.html:699`–`index.html:715`).
- Anillo de progreso: cálculo y actualización (`index.html:478`–`index.html:503`).

### Personalización
- Duraciones y recompensas en `MODES` (`index.html:215`–`index.html:219`).
- Emojis en `ASSETS` (`index.html:221`–`index.html:225`).
- Frutas en `FRUITS_GENERAL` / `FRUITS_PALM` (`index.html:227`–`index.html:229`).
- Cambia el sonido del timbre (`index.html:125`).
- Ajusta la rejilla del jardín (`index.html:203`).
- Tema: modifica el uso de `.dark` si prefieres modo claro.

### Soporte & Privacidad
- Funciona en navegadores modernos.
- Usa `localStorage` y `Notification` opcional.
- Todos los datos permanecen en tu navegador.

Feito com 💙 pelo [@aleqcodes](https://instagram.com/aleqcodes) • GitHub: [@aleqcodes](https://github.com/aleqcodes)

