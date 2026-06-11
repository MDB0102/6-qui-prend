// Gestion de l'état du jeu
class GameState {
  constructor() {
    this.reset();
  }

  reset() {
    this.limit = GAME_CONFIG.DEFAULT_LIMIT;
    this.players = [];
    this.scores = [];
    this.round = 1;
    this.history = [];
    this.startTime = null;
  }

  initialize(players, limit) {
    this.players = players;
    this.limit = limit;
    this.scores = players.map(() => 0);
    this.round = 1;
    this.history = [];
    this.startTime = Date.now();
  }

  addRound(gains) {
    this.history.push({
      round: this.round,
      gains: [...gains],
      scoresBefore: [...this.scores],
    });
    this.scores = this.scores.map((s, i) => s + gains[i]);
    this.round++;
  }

  undoRound() {
    if (this.history.length === 0) return false;
    const last = this.history.pop();
    this.scores = last.scoresBefore;
    this.round = last.round;
    return true;
  }

  getLoser() {
    const loserIdx = this.scores.findIndex(s => s >= this.limit);
    return loserIdx !== -1 ? loserIdx : null;
  }

  getRanked() {
    return this.players
      .map((name, i) => ({ name, score: this.scores[i], idx: i }))
      .sort((a, b) => a.score - b.score);
  }

  getDuration() {
    if (!this.startTime) return { minutes: 0, seconds: 0 };
    const duration = Math.floor((Date.now() - this.startTime) / 1000);
    return {
      minutes: Math.floor(duration / 60),
      seconds: duration % 60,
    };
  }

  save() {
    localStorage.setItem(GAME_CONFIG.STORAGE_KEY, JSON.stringify(this));
  }

  load() {
    try {
      const saved = localStorage.getItem(GAME_CONFIG.STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        Object.assign(this, data);
        return true;
      }
    } catch (e) {
      console.error('Erreur lors du chargement de l\'état:', e);
    }
    return false;
  }
}

const gameState = new GameState();
