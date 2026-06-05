import type { ChangeEvent, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  setField,
  blurField,
  validateAll,
  setStatus,
  resetForm,
  selectContactValid,
  type ContactField,
} from '../../store/slices/contactSlice';
import Button from '../../components/ui/Button';
import { CONTACT_DETAILS } from '../../data/content';
import styles from './ContactForm.module.css';

const FORMSPREE_ID = import.meta.env.VITE_FORMSPREE_ID;

export default function ContactForm() {
  const dispatch = useAppDispatch();
  const { fields, touched, errors, status, statusMessage } = useAppSelector((s) => s.contact);
  const valid = useAppSelector((s) => selectContactValid(s.contact));

  const change =
    (field: ContactField) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      dispatch(setField({ field, value: e.target.value }));
  const blur = (field: ContactField) => () => dispatch(blurField(field));

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    dispatch(validateAll());
    if (!valid) {
      dispatch(setStatus({ status: 'error', message: 'Please fix the highlighted fields.' }));
      return;
    }

    if (FORMSPREE_ID) {
      dispatch(setStatus({ status: 'sending' }));
      try {
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(e.currentTarget),
        });
        if (!res.ok) throw new Error('Submission failed. Please email me directly.');
        dispatch(setStatus({ status: 'success', message: 'Thanks! Your message has been sent.' }));
        dispatch(resetForm());
      } catch (err) {
        dispatch(setStatus({ status: 'error', message: (err as Error).message }));
      }
    } else {
      // Backend-free default for a static site: open a prefilled mail draft.
      const name = `${fields.firstName} ${fields.lastName}`.trim();
      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(
        `${fields.message}\n\n— ${name}\n${fields.email}${fields.phone ? `\n${fields.phone}` : ''}`,
      );
      window.location.href = `mailto:${CONTACT_DETAILS.email}?subject=${subject}&body=${body}`;
      dispatch(setStatus({ status: 'success', message: 'Opening your email app…' }));
    }
  }

  const fieldError = (f: ContactField) => (touched[f] && errors[f] ? errors[f] : undefined);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.heading}>Contact Form</h2>

      {status === 'success' || status === 'error' ? (
        <div
          className={`${styles.toast} ${status === 'success' ? styles.toastOk : styles.toastErr}`}
          role="status"
          aria-live="polite"
        >
          {statusMessage}
        </div>
      ) : null}

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

      <input type="hidden" name="formName" value="Portfolio Contact" />

      <Button type="submit" disabled={status === 'sending'} className={styles.submit}>
        {status === 'sending' ? 'Sending…' : 'Submit'}
      </Button>
    </form>
  );
}
