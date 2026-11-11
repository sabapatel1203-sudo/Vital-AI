import React from 'react';
import { ShieldCheck, Lock, Key, FileCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const SecurityPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-clinical-white)' }}>
      <section style={{ background: 'linear-gradient(165deg, var(--color-midnight-navy), var(--color-deep-blue))', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(22, 163, 106, 0.15)', border: '1px solid rgba(22, 163, 106, 0.3)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', color: '#4ade80', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            <ShieldCheck size={14} /> Zero-Knowledge Cryptographic Vault
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            HIPAA, SOC 2 Type II & GDPR Sovereign Architecture
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Your biometric telemetry and genetic signatures belong exclusively to you. Every packet is encrypted at the device edge using AES-256-GCM before transport.
          </p>
          <Link to="/register" className="btn btn-primary">
            Provision Your Sovereign Twin
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <Key size={28} color="var(--color-teal)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Client-Side Key Generation</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Encryption keys are generated inside the patient's local hardware Secure Enclave. Vitalis servers never receive unencrypted private keys.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <Lock size={28} color="var(--color-cyan)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Immutable Audit Ledger</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Every clinical query, doctor record inspection, and AI inference is logged to a tamper-proof cryptographic audit trail.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <FileCheck size={28} color="var(--color-violet)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Granular Consent Controls</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Patients can grant or revoke clinician and researcher access with fine-grained temporal permissions down to specific organ systems.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SecurityPage;
