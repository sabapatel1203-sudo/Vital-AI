import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import HumanTwin3D from '../components/HumanTwin3D';
import { Activity, UserCheck, Stethoscope, Sparkles } from 'lucide-react';
import './Auth.css';

export const LoginPage: React.FC = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const ok = await login(email, password);
      if (ok) {
        navigate('/dashboard');
      } else {
        setError('Invalid credentials. Select one of the verified demo accounts below for instant access.');
      }
    } catch {
      setError('An authentication error occurred. Please verify network access.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastDemoLogin = async (demoEmail: string, demoPass: string, defaultPath: string = '/dashboard') => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setError('');
    const ok = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    if (ok) {
      navigate(defaultPath);
    }
  };

  return (
    <div className="crimson-login-split">
      {/* ── LEFT SIDE: Realistic 3D Anatomical Visual against Burgundy Background ── */}
      <div className="crimson-login-visual">
        <div className="crimson-login-visual-inner">
          <HumanTwin3D compact={false} />

          <div className="crimson-login-floating-badge">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
              <span className="crimson-pin-dot" />
              <strong style={{ fontSize: '0.8rem', color: 'var(--color-warm-white)' }}>
                Sarah Mitchell • Patient Twin #4092
              </strong>
            </div>
            <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>
              Cardiovascular telemetry active: 72 BPM Sinus Rhythm • Blood Pressure 118/78 mmHg
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT SIDE: Clean, Elegant Authentication Form ── */}
      <div className="crimson-login-form-wrap">
        <div className="crimson-login-card">
          {/* Logo & Welcome */}
          <div style={{ marginBottom: '2rem' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--color-heart-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Activity size={16} color="#FFF7F7" />
              </div>
              <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-warm-white)' }}>
                VITALIS AI
              </span>
            </Link>

            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warm-white)', marginBottom: '0.4rem' }}>
              Welcome back
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)' }}>
              Sign in to access your synchronized medical digital twin or authorized clinical workspace.
            </p>
          </div>

          {error && (
            <div style={{ padding: '0.75rem 1rem', background: 'rgba(197, 40, 72, 0.15)', border: '1px solid rgba(197, 40, 72, 0.35)', borderRadius: 'var(--radius-sm)', color: '#ff94a8', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
                Email address
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="name@vitalis.ai or hospital email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)' }}>
                  Password
                </label>
                <a href="#forgot" style={{ fontSize: '0.75rem', color: 'var(--color-brain-rose)' }}>
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign in to Digital Twin'}
            </button>
          </form>

          {/* Instant Clinical Demo Switcher */}
          <div style={{ marginTop: '2rem', padding: '1.1rem', background: 'rgba(34, 13, 22, 0.75)', border: '1px solid rgba(143, 32, 56, 0.35)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.725rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-heart-red)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sparkles size={13} /> Instant Verified Demo Profiles
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleFastDemoLogin('patient@vitalis.ai', 'patient123', '/dashboard')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={15} color="var(--color-heart-red)" />
                  <span><strong>Sarah Mitchell</strong> (Patient Twin)</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)' }}>patient@vitalis.ai →</span>
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleFastDemoLogin('doctor@vitalis.ai', 'doctor123', '/doctor')}
                style={{ justifyContent: 'space-between', textAlign: 'left', width: '100%' }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Stethoscope size={15} color="var(--color-brain-rose)" />
                  <span><strong>Dr. James Chen</strong> (Attending Cardiologist)</span>
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)' }}>doctor@vitalis.ai →</span>
              </button>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--color-muted-pink)' }}>
            Need to provision a new digital twin?{' '}
            <Link to="/register" style={{ fontWeight: 600, color: 'var(--color-heart-red)' }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
