import type { Middleware } from '@reduxjs/toolkit';

const KEY = 'sv_prefs';

export interface PersistedPrefs {
  animationsEnabled: boolean;
}

/** Read persisted preferences (called from uiSlice initialState). SSR/disabled-storage safe. */
export function loadPrefs(): Partial<PersistedPrefs> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Partial<PersistedPrefs>) : {};
  } catch {
    return {};
  }
}

/** Persist UI preferences to localStorage whenever a `ui/` action changes them. */
export const persistMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action);
  const type = (action as { type?: unknown }).type;
  if (typeof type === 'string' && type.startsWith('ui/')) {
    try {
      const state = store.getState() as { ui: { animationsEnabled: boolean } };
      const prefs: PersistedPrefs = { animationsEnabled: state.ui.animationsEnabled };
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      /* storage unavailable — ignore */
    }
  }
  return result;
};
