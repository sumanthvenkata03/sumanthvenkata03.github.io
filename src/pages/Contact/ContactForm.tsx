import { useState, type ChangeEvent, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setField,
  blurField,
  validateAll,
  setStatus,
  resetForm,
  selectContactValid,
  validateField,
  type ContactField,
} from '../../store/slices/contactSlice';
import Button from '../../components/ui/Button';
import { useAnimationsActive } from '../../hooks/useAnimationsActive';
import { CONTACT_DETAILS } from '../../data/content';
import styles from './ContactForm.module.css';

// Public Formspree form id — ships in the client bundle by design (no env wiring,
// so there's no risk of a silent mailto fallback in production).
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xqalngpk';

const FIELD_ORDER: ContactField[] = ['firstName', 'lastName', 'email', 'phone', 'message'];

export default function ContactForm() {
  const dispatch = useAppDispatch();
  const { fields, touched, errors, status, statusMessage } = useAppSelector((s) => s.contact);
  const valid = useAppSelector((s) => selectContactValid(s.contact));
  const animate = useAnimationsActive();

  // Honeypot is local (never sent / stored) — bots fill it, humans never see it.
  const [honeypot, setHoneypot] = useState('');

  const change =
    (field: ContactField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      dispatch(setField({ field, value: e.target.value }));
  const blur = (field: ContactField) => () => dispatch(blurField(field));
  const fieldError = (f: ContactField) => (touched[f] && errors[f] ? errors[f] : undefined);

  function focusFirstError() {
    for (const f of FIELD_ORDER) {
      if (validateField(f, fields[f])) {
        document.getElementById(f)?.focus();
        return;
      }
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(validateAll());
    if (!valid) {
      focusFirstError();
      return; // do not submit
    }

    // Honeypot tripped → treat as a successful no-op (silently drop the bot).
    if (honeypot.trim() !== '') {
      dispatch(resetForm()); // resetForm sets status back to idle, so set success AFTER
      dispatch(setStatus({ status: 'success' }));
      return;
    }

    dispatch(setStatus({ status: 'sending' }));
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          firstName: fields.firstName,
          lastName: fields.lastName,
          email: fields.email,
          phone: fields.phone,
          message: fields.message,
          _subject: `Portfolio contact — ${fields.firstName} ${fields.lastName}`.trim(),
        }), // Formspree uses the "email" field as the reply-to address
      });
      if (res.ok) {
        dispatch(resetForm()); // clear fields; set success AFTER (reset → idle)
        dispatch(setStatus({ status: 'success' }));
      } else {
        const data = (await res.json().catch(() => null)) as {
          errors?: { message?: string }[];
        } | null;
        const msg =
          data?.errors?.[0]?.message || 'Your message could not be sent. Please try again.';
        dispatch(setStatus({ status: 'error', message: msg }));
      }
    } catch {
      dispatch(setStatus({ status: 'error', message: 'Something went wrong sending your message.' }));
    }
  }

  function sendAnother() {
    setHoneypot('');
    dispatch(resetForm());
  }

  // ---- SUCCESS: replace the form with a confirmation ----
  if (status === 'success') {
    const confirmation = (
      <>
        <span className={styles.successIcon} aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <p className={styles.successTitle}>Thanks — your message is on its way.</p>
        <p className={styles.successText}>I’ll get back to you soon.</p>
        <Button type="button" variant="ghost" onClick={sendAnother} className={styles.sendAnother}>
          Send another
        </Button>
      </>
    );
    return (
      <div className={styles.panel}>
        <h2 className={styles.heading}>Contact Form</h2>
        {animate ? (
          <motion.div
            className={styles.success}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: [0.22, 0.61, 0.36, 1] }}
          >
            {confirmation}
          </motion.div>
        ) : (
          <div className={styles.success} role="status" aria-live="polite">
            {confirmation}
          </div>
        )}
      </div>
    );
  }

  // ---- IDLE / SENDING / ERROR: the form ----
  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Contact Form</h2>

      {status === 'error' ? (
        <div className={styles.errorBanner} role="alert" aria-live="assertive">
          {statusMessage || 'Your message could not be sent. Please try again.'}
          <span className={styles.errorFallback}>
            You can also email me directly at{' '}
            <a className={styles.errorLink} href={`mailto:${CONTACT_DETAILS.email}`}>
              {CONTACT_DETAILS.email}
            </a>
          </span>
        </div>
      ) : null}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.srOnly} htmlFor="firstName">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={styles.input}
              placeholder="First name"
              value={fields.firstName}
              onChange={change('firstName')}
              onBlur={blur('firstName')}
              aria-invalid={!!fieldError('firstName')}
              aria-describedby={fieldError('firstName') ? 'firstName-err' : undefined}
              required
            />
            {fieldError('firstName') ? (
              <span id="firstName-err" className={styles.error}>{errors.firstName}</span>
            ) : null}
          </div>
          <div className={styles.group}>
            <label className={styles.srOnly} htmlFor="lastName">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={styles.input}
              placeholder="Last name"
              value={fields.lastName}
              onChange={change('lastName')}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.group}>
            <label className={styles.srOnly} htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.input}
              placeholder="Email"
              value={fields.email}
              onChange={change('email')}
              onBlur={blur('email')}
              aria-invalid={!!fieldError('email')}
              aria-describedby={fieldError('email') ? 'email-err' : undefined}
              required
            />
            {fieldError('email') ? (
              <span id="email-err" className={styles.error}>{errors.email}</span>
            ) : null}
          </div>
          <div className={styles.group}>
            <label className={styles.srOnly} htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className={styles.input}
              placeholder="Phone"
              value={fields.phone}
              onChange={change('phone')}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label className={styles.srOnly} htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            className={styles.input}
            rows={4}
            placeholder="Message"
            value={fields.message}
            onChange={change('message')}
            onBlur={blur('message')}
            aria-invalid={!!fieldError('message')}
            aria-describedby={fieldError('message') ? 'message-err' : undefined}
            required
          />
          {fieldError('message') ? (
            <span id="message-err" className={styles.error}>{errors.message}</span>
          ) : null}
        </div>

        {/* Honeypot — hidden from sighted users and screen readers. */}
        <div className={styles.honeypot} aria-hidden="true">
          <label htmlFor="_gotcha">Leave this field empty</label>
          <input
            id="_gotcha"
            name="_gotcha"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={status === 'sending'} className={styles.submit}>
          {status === 'sending' ? 'Sending…' : 'Submit'}
        </Button>
      </form>
    </div>
  );
}
