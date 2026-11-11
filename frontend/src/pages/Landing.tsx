import React from 'react';
import { Link } from 'react-router-dom';
import HumanTwin3D from '../components/HumanTwin3D';
import { 
  Activity, 
  Heart, 
  Brain, 
  Wind, 
  Dna, 
  ShieldCheck, 
  Cpu, 
  Stethoscope, 
  ArrowRight, 
  Sparkles,
  Layers
} from 'lucide-react';
import './Landing.css';

export const LandingPage: React.FC = () => {
  return (
    <div className="crimson-landing">
      {/* ── Edge-to-Edge Hero Section ── */}
      <section className="crimson-hero">
        <div className="crimson-hero__spotlight" />

        <div className="crimson-hero__grid">
          {/* Left Text Area */}
          <div className="crimson-hero__text-col">
            <div className="crimson-hero__badge">
              <Sparkles size={13} color="var(--color-heart-red)" />
              <span>Bio-Computational Digital Twin</span>
            </div>

            <h1 className="crimson-hero__headline">
              YOUR BODY.<br />
              <span className="crimson-hero__headline-accent">YOUR HEALTH STORY.</span>
            </h1>

            <p className="crimson-hero__subtext">
              An intelligent medical experience connecting personalized anatomy, clinical history, and AI-assisted health insights.
            </p>

            <div className="crimson-hero__actions">
              <Link to="/onboarding" className="btn btn-primary btn-lg">
                Create Your Digital Self <ArrowRight size={17} />
              </Link>
              <Link to="/twin" className="btn btn-secondary btn-lg">
                Explore 3D Anatomy Lab
              </Link>
            </div>

            {/* Restrained Clinical Evidence Counters */}
            <div className="crimson-hero__stats-row">
              <div className="crimson-stat-item">
                <div className="crimson-stat-val">
                  <Heart size={20} color="var(--color-heart-red)" /> 72 <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-pink)' }}>BPM</span>
                </div>
                <div className="crimson-stat-label">Continuous Sinus Telemetry</div>
              </div>

              <div className="crimson-stat-item">
                <div className="crimson-stat-val">
                  6 <span style={{ fontSize: '0.85rem', color: 'var(--color-muted-pink)' }}>Systems</span>
                </div>
                <div className="crimson-stat-label">3D Anatomical Organs</div>
              </div>

              <div className="crimson-stat-item">
                <div className="crimson-stat-val" style={{ color: 'var(--color-brain-rose)' }}>
                  100%
                </div>
                <div className="crimson-stat-label">FHIR HL7 Interoperable</div>
              </div>
            </div>
          </div>

          {/* Right 3D Human Centered Showcase (Occupies 50-60% Visual Area) */}
          <div className="crimson-hero__visual-wrap">
            <HumanTwin3D compact={false} />

            {/* Elegant Anatomical Callout Markers */}
            <div className="hero-marker-card hero-marker--heart">
              <div className="hero-marker-label">
                <Heart size={12} color="var(--color-heart-red)" /> Cardiovascular Core
              </div>
              <div className="hero-marker-value">LVEF 62% • Sinus Rhythm</div>
              <div className="hero-marker-desc">Normal myocardial perfusion. ACE-inhibitor regimen stabilized.</div>
            </div>

            <div className="hero-marker-card hero-marker--brain">
              <div className="hero-marker-label">
                <Brain size={12} color="var(--color-brain-rose)" /> Cerebral Cortex
              </div>
              <div className="hero-marker-value">Alpha 9.8 Hz • Low Load</div>
              <div className="hero-marker-desc">Intact neurovascular coupling. Sleep architecture optimal.</div>
            </div>

            <div className="hero-marker-card hero-marker--lungs">
              <div className="hero-marker-label">
                <Wind size={12} color="var(--color-soft-tissue)" /> Pulmonary Lobes
              </div>
              <div className="hero-marker-value">98.5% SpO2 • 14 Br/min</div>
              <div className="hero-marker-desc">Alveolar gas exchange normal. Clear lung fields bilaterally.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clinical Platform Pillars ── */}
      <section className="crimson-section">
        <div className="crimson-section-header">
          <span className="crimson-section-tag">Scientific Foundation</span>
          <h2 className="crimson-section-title">
            Precision Medicine Driven by Physiological Simulation
          </h2>
          <p className="crimson-section-subtitle">
            Engineered for tertiary clinical environments, specialist physicians, and empowered patients seeking true preventative mastery over their biology.
          </p>
        </div>

        <div className="crimson-pillars-grid">
          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <Layers size={24} />
            </div>
            <h3 className="crimson-pillar-title">Personalized 3D Anatomical Twin</h3>
            <p className="crimson-pillar-desc">
              Multi-layered anatomical visualization with realistic tissue shaders. Seamlessly switch between the external personal patient avatar and interior multi-organ systems.
            </p>
          </div>

          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <Cpu size={24} />
            </div>
            <h3 className="crimson-pillar-title">Ontology-Grounded AI Intelligence</h3>
            <p className="crimson-pillar-desc">
              Directly synthesized with SNOMED-CT, RxNorm, and ICD-11 medical graphs to produce provable, citation-backed differential hypotheses without LLM hallucinations.
            </p>
          </div>

          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <Activity size={24} />
            </div>
            <h3 className="crimson-pillar-title">Continuous Biometric Streaming</h3>
            <p className="crimson-pillar-desc">
              Synchronizes edge telemetry from medical wearables, ambulatory cuffs, and continuous blood glucose monitors with millisecond anomaly detection.
            </p>
          </div>

          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <Dna size={24} />
            </div>
            <h3 className="crimson-pillar-title">Pharmacogenomic Screening</h3>
            <p className="crimson-pillar-desc">
              Maps CYP450 enzyme variants against intended drug prescriptions, systematically eradicating adverse drug events and predicting individual metabolic clearances.
            </p>
          </div>

          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <Stethoscope size={24} />
            </div>
            <h3 className="crimson-pillar-title">Collaborative Care Portal</h3>
            <p className="crimson-pillar-desc">
              Physician-patient video consultations with real-time 3D twin model sharing, verified electronic prescribing, and transparent adherence tracking.
            </p>
          </div>

          <div className="crimson-pillar-card">
            <div className="crimson-pillar-icon">
              <ShieldCheck size={24} />
            </div>
            <h3 className="crimson-pillar-title">Zero-Knowledge Sovereign Vault</h3>
            <p className="crimson-pillar-desc">
              HIPAA & GDPR grade hardware enclave encryption. Biological telemetry keys remain exclusively with the patient and authorized attending physicians.
            </p>
          </div>
        </div>
      </section>

      {/* ── Ready to Experience Section ── */}
      <section style={{ background: 'linear-gradient(180deg, var(--color-bg-burgundy) 0%, #200813 100%)', padding: '6rem 2.5rem', textAlign: 'center', borderTop: '1px solid rgba(143, 32, 56, 0.25)' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Experience Your Personalized Digital Twin
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--color-muted-pink)', lineHeight: 1.7, marginBottom: '2.5rem' }}>
            Enter the interactive anatomy laboratory, inspect verified clinical records organ by organ, and examine real-time physiological predictions.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/twin" className="btn btn-primary btn-lg">
              Launch 3D Human Workspace <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg">
              Access Clinician Portal
            </Link>
          </div>
        </div>
      </section>

      {/* ── Minimalist Luxury Footer ── */}
      <footer className="crimson-footer">
        <div className="crimson-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '4px', background: 'var(--color-heart-red)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={13} color="#FFF7F7" />
            </div>
            <span style={{ fontSize: '0.95rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--color-warm-white)' }}>
              VITALIS AI
            </span>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
            © {new Date().getFullYear()} VITALIS Health Technologies Inc. HIPAA, SOC 2 Type II & GDPR Sovereign Architecture.
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem', flexWrap: 'wrap' }}>
            <Link to="/onboarding">Create Avatar</Link>
            <Link to="/twin">3D Anatomy</Link>
            <Link to="/reports">Reports & AI</Link>
            <Link to="/explorer">Disease Explorer</Link>
            <Link to="/assistant">Ask Your Body</Link>
            <Link to="/imaging">Imaging</Link>
            <Link to="/doctor">Doctor Center</Link>
            <Link to="/security">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
