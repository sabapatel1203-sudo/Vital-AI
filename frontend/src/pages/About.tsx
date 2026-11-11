import React from 'react';
import { Compass, Users, Award, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--color-clinical-white)' }}>
      <section style={{ background: 'linear-gradient(165deg, var(--color-midnight-navy), var(--color-deep-blue))', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.75rem', fontWeight: 800, marginBottom: '1.25rem' }}>
            Empowering Human Health Through Living Digital Twins
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: '2rem' }}>
            Vitalis AI was founded by medical physicians, computational biophysicists, and AI researchers with a single objective: to transform fragmented healthcare data into an intuitive, computable, predictive digital twin.
          </p>
          <Link to="/register" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            Join the Clinical Revolution <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <Compass size={28} color="var(--color-teal)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Our Mission</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Shift global medicine from episodic, reactive treatment to continuous, predictive, and preventative physiological optimization.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <Users size={28} color="var(--color-cyan)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Doctor-Patient Union</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Bridge the communication gap between busy clinicians and patients with visual 3D anatomical twin models that make complex pathology instantly comprehensible.
            </p>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
            <Award size={28} color="var(--color-violet)" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Evidence-Based Rigor</h3>
            <p style={{ color: 'var(--color-secondary-text)', fontSize: '0.875rem', lineHeight: 1.6 }}>
              Every algorithm is validated against peer-reviewed clinical cohorts and certified for safety under medical device software standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
