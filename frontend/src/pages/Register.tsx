import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext, type UserRole } from '../auth/AuthContext';
import { Activity, UserCheck, Stethoscope, Microscope } from 'lucide-react';
import './Auth.css';

export const RegisterPage: React.FC = () => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const ok = await register(name, email, password, role);
      if (ok) {
        navigate(role === 'doctor' ? '/doctor' : '/onboarding');
      } else {
        setError('Provisioning failed. Please check input parameters.');
      }
    } catch {
      setError('An error occurred during account initialization.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-bg-burgundy)', padding: '2rem 1.5rem' }}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.35)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '4px', background: 'var(--color-heart-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={16} color="#FFF7F7" />
            </div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-warm-white)' }}>
              VITALIS AI
            </span>
          </Link>
          <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
            Initialize Medical Twin
          </h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--color-muted-pink)' }}>
            Provision your personalized 3D physiological avatar and sovereign health chart.
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(197, 40, 72, 0.15)', border: '1px solid rgba(197, 40, 72, 0.35)', borderRadius: 'var(--radius-sm)', color: '#ff94a8', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
              Legal Full Name / Clinical Title
            </label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Sarah Mitchell or Dr. Alex Mercer"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
              Official Email Address
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="name@hospital.org or personal email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
              Cryptographic Password
            </label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--color-warm-white)', marginBottom: '0.5rem' }}>
              Select Clinical Role Profile
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${role === 'patient' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('patient')}
                style={{ flexDirection: 'column', gap: '0.25rem', padding: '0.65rem 0.5rem' }}
              >
                <UserCheck size={16} />
                <span>Patient</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${role === 'doctor' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('doctor')}
                style={{ flexDirection: 'column', gap: '0.25rem', padding: '0.65rem 0.5rem' }}
              >
                <Stethoscope size={16} />
                <span>Doctor</span>
              </button>
              <button
                type="button"
                className={`btn btn-sm ${role === 'researcher' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('researcher')}
                style={{ flexDirection: 'column', gap: '0.25rem', padding: '0.65rem 0.5rem' }}
              >
                <Microscope size={16} />
                <span>Researcher</span>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ width: '100%', marginTop: '0.5rem', padding: '0.85rem' }}>
            {isSubmitting ? 'Provisioning Twin...' : 'Synthesize Digital Twin'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--color-muted-pink)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ fontWeight: 600, color: 'var(--color-heart-red)' }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
