import React from 'react';
import { Link } from 'react-router-dom';
import { Dna, Cpu, Activity, ArrowRight } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', backgroundColor: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)' }}>
      <section style={{ padding: '5rem 2.5rem', textAlign: 'center', background: 'radial-gradient(circle at 50% 30%, #320d1c 0%, #18090f 75%)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <span className="badge badge-crimson" style={{ marginBottom: '1.25rem' }}>
            Genomic & Population Health
          </span>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
            Clinical Research & In Silico Trials
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--color-muted-pink)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Vitalis AI empowers clinical researchers to model disease trajectories and drug efficacy in cohort-wide computational digital twins before advancing to human phase trials.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/twin" className="btn btn-primary btn-lg">
              Inspect Patient Genomic Twin <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: '1280px', margin: '0 auto', padding: '5rem 2.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div className="surface-card">
            <Dna size={26} color="var(--color-brain-rose)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Pharmacogenomic Allele Indexing</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              Quantify adverse drug reaction predisposition across large cohorts, establishing individualized CYP2C19, CYP2D6, and SLCO1B1 pharmacodynamic models.
            </p>
          </div>

          <div className="surface-card">
            <Cpu size={26} color="var(--color-heart-red)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>Biomechanical In Silico Trials</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              Simulate coronary stent hemodynamics, cardiac contractility, and renal clearance across synthetic patient twins to accelerate translational medicine.
            </p>
          </div>

          <div className="surface-card">
            <Activity size={26} color="var(--color-soft-tissue)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.65rem' }}>72-Hour Anomaly Prediction</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
              Statistical modeling of multi-parameter telemetry to identify pre-symptomatic physiological stress in intensive care and post-operative cohorts.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ResearchPage;
