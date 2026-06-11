// Gestion de l'interface utilisateur
class UIManager {
  constructor() {
    this.currentScreen = 'setup';
    this.playerCount = GAME_CONFIG.DEFAULT_PLAYER_COUNT;
  }

  showScreen(screenName) {
    ['setup', 'game', 'win'].forEach(name => {
      const screen = document.getElementById(`screen-${name}`);
      screen.classList.toggle('hidden', name !== screenName);
    });
    this.currentScreen = screenName;
  }

  renderSetupScreen() {
    this.renderCountButtons();
    this.renderNameInputs();
  }

  renderCountButtons() {
    const container = document.getElementById('count-row');
    container.innerHTML = GAME_CONFIG.PLAYER_COUNTS.map(n =>
      `<button class="count-btn${n === this.playerCount ? ' active' : ''}" data-count="${n}">${n}</button>`
    ).join('');
  }

  renderNameInputs() {
    const container = document.getElementById('names-grid');
    const prev = Array.from(container.querySelectorAll('input')).map(i => i.value);
    container.innerHTML = '';
    for (let i = 0; i < this.playerCount; i++) {
      const inp = document.createElement('input');
      inp.className = 'name-input';
      inp.placeholder = `Joueur ${i + 1}`;
      inp.value = prev[i] || '';
      inp.maxLength = 20;
      container.appendChild(inp);
    }
  }

  renderGameScreen() {
    this.renderGameHeader();
    this.renderStats();
    this.renderScoreboard();
    this.renderRoundInputs();
    this.renderHistory();
    this.updateUndoButton();
  }

  renderGameHeader() {
    document.getElementById('round-label').textContent = `Manche ${gameState.round}`;
    document.getElementById('limit-label').textContent = `Limite : ${gameState.limit} 🐮`;
  }

  renderStats() {
    const grid = document.getElementById('stats-grid');
    const minScore = Math.min(...gameState.scores);
    grid.innerHTML = `
      <div class="stat-card" style="animation-delay: 0s">
        <div class="stat-label">Manche</div>
        <div class="stat-value">${gameState.round}</div>
      </div>
      <div class="stat-card" style="animation-delay: 0.1s">
        <div class="stat-label">En tête</div>
        <div class="stat-value">${minScore}🐮</div>
      </div>
    `;
  }

  renderScoreboard() {
    const ranked = gameState.getRanked();
    const sb = document.getElementById('scoreboard');
    sb.innerHTML = ranked.map((p, rank) => {
      const pct = Math.min((p.score / gameState.limit) * 100, 100);
      let gradient;
      if (pct > 90) gradient = COLORS.SCORE_GRADIENTS.critical;
      else if (pct > 75) gradient = COLORS.SCORE_GRADIENTS.warning;
      else if (pct > 50) gradient = COLORS.SCORE_GRADIENTS.caution;
      else gradient = COLORS.SCORE_GRADIENTS.safe;

      return `<div class="score-row">
        <span class="score-rank">${rank + 1}</span>
        <span class="score-name" title="${p.name}">${p.name}</span>
        <div class="bar-wrap"><div class="bar" style="width:${pct}%;background:${gradient}"></div></div>
        <span class="score-val">${p.score}</span>
      </div>`;
    }).join('');
  }

  renderRoundInputs() {
    const ri = document.getElementById('round-inputs');
    ri.innerHTML = gameState.players.map((name, i) =>
      `<div class="round-input-row">
        <span class="round-name">${name}</span>
        <input class="round-input" type="number" id="ri-${i}" min="0" placeholder="0" />
        <span>🐮</span>
      </div>`
    ).join('');
    document.getElementById('ri-0')?.focus();
  }

  renderHistory() {
    const head = document.getElementById('history-head');
    const body = document.getElementById('history-body');
    head.innerHTML = `<tr><th>M.</th>${gameState.players.map(n => `<th>${n.substring(0, 4)}</th>`).join('')}</tr>`;
    body.innerHTML = gameState.history.map(h =>
      `<tr><td>${h.round}</td>${h.gains.map(g =>
        `<td${g > 0 ? ' class="neg"' : ''}>${g > 0 ? '+' + g : '—'}</td>`
      ).join('')}</tr>`
    ).join('');
  }

  updateUndoButton() {
    document.getElementById('btn-undo').disabled = gameState.history.length === 0;
  }

  renderWinScreen() {
    const ranked = gameState.getRanked();
    const winner = ranked[0];
    const duration = gameState.getDuration();

    document.getElementById('win-title').textContent = `${winner.name} gagne !`;
    document.getElementById('win-sub').textContent = 
      `⏱️ ${duration.minutes}m ${duration.seconds}s • Manche ${gameState.round - 1}`;

    const stats = document.getElementById('win-stats');
    const totalPoints = ranked.reduce((sum, p) => sum + p.score, 0);
    stats.innerHTML = `
      <div class="stat-card" style="animation-delay: 0s">
        <div class="stat-label">Manches</div>
        <div class="stat-value">${gameState.round - 1}</div>
      </div>
      <div class="stat-card" style="animation-delay: 0.1s">
        <div class="stat-label">Points totaux</div>
        <div class="stat-value">${totalPoints}</div>
      </div>
    `;

    const fs = document.getElementById('final-scores');
    fs.innerHTML = ranked.map((p, i) =>
      `<div class="final-row${i === 0 ? ' first' : ''}">
        <span class="final-rank">${COLORS.MEDALS[i] || (i + 1)}</span>
        <span class="final-name">${p.name}</span>
        <span class="final-score">${p.score}🐮</span>
      </div>`
    ).join('');
  }

  showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    setTimeout(() => {
      toast.classList.remove('show');
    }, GAME_CONFIG.TOAST_DURATION);
  }

  showModal(title, text, onConfirm) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-text').textContent = text;
    document.getElementById('modal').classList.add('active');
    document.getElementById('modal-confirm').onclick = () => {
      this.closeModal();
      onConfirm();
    };
  }

  closeModal() {
    document.getElementById('modal').classList.remove('active');
  }

  setPlayerCount(count) {
    this.playerCount = count;
    document.querySelectorAll('.count-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.count == count);
    });
    this.renderNameInputs();
  }

  getPlayerNames() {
    return Array.from(document.querySelectorAll('#names-grid input'))
      .map((inp, i) => inp.value.trim() || `Joueur ${i + 1}`);
  }

  getScoreInputs() {
    return gameState.players.map((_, i) =>
      Math.max(0, parseInt(document.getElementById(`ri-${i}`)?.value) || 0)
    );
  }

  setLimitFromInput() {
    const value = parseInt(document.getElementById('limit-input').value);
    if (value >= 1) {
      gameState.limit = value;
      document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    }
  }

  setLimitFromPill(limit) {
    gameState.limit = limit;
    document.getElementById('limit-input').value = limit;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    event.target.classList.add('active');
  }
}

const ui = new UIManager();
