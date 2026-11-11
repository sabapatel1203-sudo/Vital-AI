import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import { Activity, Menu, X, ArrowUpRight, LogOut, User as UserIcon } from 'lucide-react';
import NextMedicationPill from './NextMedicationPill';
import './Navbar.css';

const NAV_ITEMS = [
  { label: '3D Anatomy', to: '/twin' },
  { label: 'Medical Reports', to: '/reports' },
  { label: 'Disease Explorer', to: '/explorer' },
  { label: 'AI Assistant', to: '/assistant' },
  { label: 'Imaging', to: '/imaging' },
  { label: 'For Doctors', to: '/doctor' },
];

export const Navbar: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <nav className="crimson-navbar" id="crimson-main-nav">
      {/* Brand Crest */}
      <Link to="/" className="crimson-navbar__brand">
        <div className="crimson-navbar__crest">
          <Activity size={16} color="#FFF7F7" />
        </div>
        <span className="crimson-navbar__logo-text">VITALIS AI</span>
        <span className="crimson-navbar__logo-tag">BIO-TWIN</span>
      </Link>

      {/* Center Nav Links: VITALIS AI | Platform | For Doctors | For Patients | Research */}
      <ul className="crimson-navbar__links">
        {NAV_ITEMS.map((item) => (
          <li key={item.to}>
            <Link
              to={item.to}
              className={`crimson-navbar__link ${location.pathname === item.to ? 'active' : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Right Actions */}
      <div className="crimson-navbar__actions">
        {/* Live Dose Alarm & Countdown Pill */}
        <NextMedicationPill />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/dashboard" className="crimson-navbar__user-pill" style={{ textDecoration: 'none' }}>
              <div className="crimson-navbar__avatar-dot">
                {getInitials(user.name)}
              </div>
              <span className="crimson-navbar__user-name">{user.name}</span>
            </Link>
            <button
              onClick={handleLogout}
              className="btn btn-ghost btn-sm"
              title="Sign Out"
              style={{ padding: '0.35rem 0.6rem' }}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link to="/login" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-warm-white)' }}>
              Sign In
            </Link>
            <Link to="/twin" className="btn btn-primary btn-sm">
              Explore Digital Twin <ArrowUpRight size={14} />
            </Link>
          </div>
        )}

        {/* Mobile menu toggle */}
        <button
          className="crimson-navbar__hamburger"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="crimson-navbar__mobile">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="crimson-navbar__link"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--color-oxblood)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {user ? (
              <>
                <Link to="/dashboard" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>
                  <UserIcon size={16} /> Open Dashboard ({user.name})
                </Link>
                <button className="btn btn-ghost" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  <LogOut size={16} /> Sign Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link to="/twin" className="btn btn-primary" onClick={() => setMobileOpen(false)}>
                  Explore Digital Twin
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
