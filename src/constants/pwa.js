export const PWA_TOAST_TIMEOUTS_MS = {
  updateReady: 12000,
  offlineReady: 6000,
};

export const PWA_EVENTS = {
  updateReady: 'gympal:pwa-update-ready',
  offlineReady: 'gympal:pwa-offline-ready',
};

export const PWA_GLOBALS = {
  applyUpdate: 'gympalApplyPwaUpdate',
};

export const PWA_STORAGE_KEYS = {
  installPromptDismissedAt: 'gympal_install_prompt_dismissed_at',
};

export const PWA_INSTALL_PROMPT = {
  dismissCooldownMs: 1000 * 60 * 60 * 24 * 3,
};
