// Constantes du jeu
const GAME_CONFIG = {
  PLAYER_COUNTS: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  DEFAULT_PLAYER_COUNT: 4,
  DEFAULT_LIMIT: 33,
  PRESET_LIMITS: [33, 66, 100],
  TOAST_DURATION: 3000,
  STORAGE_KEY: '6quiprend_state',
};

const COLORS = {
  SCORE_GRADIENTS: {
    critical: 'linear-gradient(90deg, #e74c3c, #c0392b)',
    warning: 'linear-gradient(90deg, #e67e22, #d35400)',
    caution: 'linear-gradient(90deg, #f39c12, #e67e22)',
    safe: 'linear-gradient(90deg, #4caf50, #43a047)',
  },
  MEDALS: ['🥇', '🥈', '🥉'],
};
