import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type ContactField = 'firstName' | 'lastName' | 'email' | 'phone' | 'message';
export type ContactStatus = 'idle' | 'sending' | 'success' | 'error';

export interface ContactState {
  fields: Record<ContactField, string>;
  touched: Partial<Record<ContactField, boolean>>;
  errors: Partial<Record<ContactField, string>>;
  status: ContactStatus;
  /** Optional message shown alongside an error status. */
  statusMessage: string;
}

const initialState: ContactState = {
  fields: { firstName: '', lastName: '', email: '', phone: '', message: '' },
  touched: {},
  errors: {},
  status: 'idle',
  statusMessage: '',
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate a single field; returns an error string or undefined. */
export function validateField(field: ContactField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case 'firstName':
      return v ? undefined : 'First name is required.';
    case 'email':
      if (!v) return 'Email is required.';
      return EMAIL_RE.test(v) ? undefined : 'Enter a valid email address.';
    case 'message':
      return v ? undefined : 'Message is required.';
    default:
      return undefined; // lastName, phone are optional
  }
}

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    setField(state, action: PayloadAction<{ field: ContactField; value: string }>) {
      const { field, value } = action.payload;
      state.fields[field] = value;
      // live-revalidate a field the user has already interacted with
      if (state.touched[field]) {
        state.errors[field] = validateField(field, value);
      }
    },
    blurField(state, action: PayloadAction<ContactField>) {
      const field = action.payload;
      state.touched[field] = true;
      state.errors[field] = validateField(field, state.fields[field]);
    },
    validateAll(state) {
      const fields: ContactField[] = ['firstName', 'lastName', 'email', 'phone', 'message'];
      for (const f of fields) {
        state.touched[f] = true;
        state.errors[f] = validateField(f, state.fields[f]);
      }
    },
    setStatus(state, action: PayloadAction<{ status: ContactStatus; message?: string }>) {
      state.status = action.payload.status;
      state.statusMessage = action.payload.message ?? '';
    },
    resetForm() {
      return initialState;
    },
  },
});

export const { setField, blurField, validateAll, setStatus, resetForm } = contactSlice.actions;
export default contactSlice.reducer;

/** True when all required fields pass validation. */
export function selectContactValid(state: ContactState): boolean {
  return (
    !validateField('firstName', state.fields.firstName) &&
    !validateField('email', state.fields.email) &&
    !validateField('message', state.fields.message)
  );
}
