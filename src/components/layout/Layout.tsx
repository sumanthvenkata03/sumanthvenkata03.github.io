import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import SkipLink from './SkipLink';

// Phase 1: static shell. Route transitions + focus management added in Phase 3.
export default function Layout() {
  return (
    <>
      <SkipLink />
      <Navbar />
      <main id="main" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
