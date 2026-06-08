import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loadPrefs } from '../middleware/persist';

export type SectionId = 'home' | 'about' | 'work' | 'projects' | 'contact';

export interface UiState {
  /** Mobile hamburger menu open/closed. */
  mobileNavOpen: boolean;
  /** Mirrors the OS `prefers-reduced-motion` media query (read on mount + change). */
  reducedMotion: boolean;
  /** User-controlled animation toggle, persisted to localStorage. */
  animationsEnabled: boolean;
  /** Synced from the active route — drives nav highlight + per-route meta. */
  activeSection: SectionId;
}

const prefs = loadPrefs();

const initialState: UiState = {
  mobileNavOpen: false,
  reducedMotion: false,
  // Seed the toggle's DEFAULT from the OS on first visit only (no stored pref yet):
  // OS reduce-motion ON → start OFF (respectful default), but the toggle can turn
  // it ON and that choice persists to localStorage. After that, OS no longer gates.
  animationsEnabled:
    prefs.animationsEnabled ??
    !(typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  activeSection: 'home',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMobileNav(state) {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNavOpen(state, action: PayloadAction<boolean>) {
      state.mobileNavOpen = action.payload;
    },
    closeMobileNav(state) {
      state.mobileNavOpen = false;
    },
    setReducedMotion(state, action: PayloadAction<boolean>) {
      state.reducedMotion = action.payload;
    },
    setAnimationsEnabled(state, action: PayloadAction<boolean>) {
      state.animationsEnabled = action.payload;
    },
    toggleAnimations(state) {
      state.animationsEnabled = !state.animationsEnabled;
    },
    setActiveSection(state, action: PayloadAction<SectionId>) {
      state.activeSection = action.payload;
    },
  },
});

export const {
  toggleMobileNav,
  setMobileNavOpen,
  closeMobileNav,
  setReducedMotion,
  setAnimationsEnabled,
  toggleAnimations,
  setActiveSection,
} = uiSlice.actions;

export default uiSlice.reducer;
