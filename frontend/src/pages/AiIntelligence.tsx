import React from 'react';
import { Cpu, Dna, Activity, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AiIntelligencePage: React.FC = () => {
  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-clinical-white)' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(165deg, var(--color-midnight-navy), var(--color-deep-blue))', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '840px', margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(19,184,166,0.15)', border: '1px solid rgba(19,184,166,0.3)', padding: '0.35rem 1rem', borderRadius: 'var(--radius-full)', color: 'var(--color-cyan)', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.25rem' }}>
            <Sparkles size={14} /> Clinical Intelligence Architecture
          </div>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            AI Built on High-Fidelity Medical Ontologies
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Unlike generic LLMs that hallucinate medical facts, VITALIS AI binds continuous mathematical bio-simulation with SNOMED-CT, RxNorm, and ICD-11 knowledge graphs for provable clinical reliability.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Explore AI Copilot in Digital Twin <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* 3 Pillars */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(19, 184, 166, 0.1)', color: 'var(--color-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Cpu size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Differential Diagnostic Engine</h3>
            <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6, fontSize: '0.9rem' }}>
              Synthesizes real-time wearable telemetry, subjective patient-reported symptoms, and historical lab panels into Bayesian probability distributions across 14,000+ medical conditions.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(139, 124, 255, 0.1)', color: 'var(--color-violet)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Dna size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>Pharmacogenomic Precision</h3>
            <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6, fontSize: '0.9rem' }}>
              Calculates patient-specific drug response profiles based on CYP2D6, CYP2C19, and VKORC1 alleles, proactively avoiding adverse drug reactions and ensuring first-time dosing efficacy.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(86, 216, 245, 0.1)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Activity size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem' }}>72-Hour Deterioration Forecast</h3>
            <p style={{ color: 'var(--color-secondary-text)', lineHeight: 1.6, fontSize: '0.9rem' }}>
              Monitors micro-variations in autonomic heart rate variability, nocturnal respiration, and vascular tone to alert clinical care teams 72 hours prior to acute clinical deterioration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiIntelligencePage;
