import React from 'react';
import { Link } from 'react-router-dom';
import { Layers, ShieldCheck, Database, ArrowRight } from 'lucide-react';

export const PlatformPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)' }}>
      {/* Hero */}
      <section style={{ padding: '5rem 2.5rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 30%, #2f0d1a 0%, #18090f 75%)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <span className="badge badge-crimson" style={{ marginBottom: '1.25rem' }}>
            System Architecture
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            The Crimson Anatomy Engine
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-muted-pink)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            A high-performance biomedical platform that transforms disparate medical records, continuous wearable telemetry, and exome sequences into an organic, interactive 3D digital twin.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/twin" className="btn btn-primary btn-lg">
              Explore 3D Digital Twin <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Grid of technical specs */}
      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="surface-card">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(197, 40, 72, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-heart-red)' }}>
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Multi-Layer Anatomical Meshes</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              GPU-accelerated physiological model with dual mode fidelity: natural human personal skin rendering and certified internal multi-organ structures.
            </p>
          </div>

          <div className="surface-card">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(215, 131, 156, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-brain-rose)' }}>
              <Database size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>FHIR & HL7 Ingestion Node</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              Standardized semantic binding with Epic Systems, Cerner, and Labcorp diagnostics. Certified longitudinal record reconciliation in sub-second response times.
            </p>
          </div>

          <div className="surface-card">
            <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(143, 32, 56, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--color-heart-red)' }}>
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Hardware Enclave Zero-Knowledge</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              End-to-end cryptographic sealing with patient-held private keys. Zero unencrypted telemetry stored on multi-tenant nodes.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PlatformPage;
