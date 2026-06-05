import { NavLink } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { toggleMobileNav, closeMobileNav } from '../../store/slices/uiSlice';
import styles from './Navbar.module.css';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About', end: false },
  { to: '/work', label: 'Work', end: false },
  { to: '/projects', label: 'Projects', end: false },
  { to: '/contact', label: 'Contact', end: false },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const open = useAppSelector((s) => s.ui.mobileNavOpen);
  const close = () => dispatch(closeMobileNav());

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Primary">
        <div className={styles.inner}>
          <NavLink to="/" end className={styles.brand} onClick={close}>
            Sumanth Venkata
          </NavLink>

          <button
            type="button"
            className={styles.toggle}
            aria-expanded={open}
            aria-controls="primary-menu"
            aria-label="Toggle navigation"
            onClick={() => dispatch(toggleMobileNav())}
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>

          <ul id="primary-menu" className={`${styles.menu} ${open ? styles.menuOpen : ''}`}>
            {LINKS.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.end}
                  onClick={close}
                  className={({ isActive }) =>
                    isActive ? `${styles.link} ${styles.active}` : styles.link
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
            <li>
              <a
                className={styles.resume}
                href="/assets/resume/sumanth_venkata_resume.pdf"
                target="_blank"
                rel="noopener"
                onClick={close}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M12 15V3" />
                </svg>
                Resume
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
