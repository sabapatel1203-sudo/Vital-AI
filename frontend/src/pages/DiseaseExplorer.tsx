import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DISEASE_CATALOG, type DiseaseCondition } from '../data/diseasesData';
import { 
  Search, 
  Activity, 
  Sparkles, 
  Layers, 
  Info,
  CheckCircle2
} from 'lucide-react';

export const DiseaseExplorerPage: React.FC = () => {
  const [conditions] = useState<DiseaseCondition[]>(DISEASE_CATALOG);
  const [selectedCondition, setSelectedCondition] = useState<DiseaseCondition>(DISEASE_CATALOG[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'progression' | 'treatments' | 'questions'>('overview');

  const filteredConditions = conditions.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.icd10.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.primarySystem.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)' }}>
      {/* Header Banner */}
      <div style={{ padding: '2rem 2.5rem 1.5rem', background: 'var(--color-bg-surface)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-crimson" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={12} /> Evidence-Grounded Disease & Pathophysiology Explorer
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              AI Health Impact & Disease Education
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', margin: '0.25rem 0 0' }}>
              Explore how medical conditions influence human anatomy, examine progression stages, and review established clinical treatments.
            </p>
          </div>

          <Link to="/twin" className="btn btn-primary">
            <Layers size={16} /> Open 3D Anatomy Lab
          </Link>
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 2.5rem', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.75rem' }}>
        {/* Left Column: Condition Search & Roster */}
        <aside>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search condition or ICD-10 code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-muted-pink)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredConditions.map((cond) => {
              const isSelected = selectedCondition.id === cond.id;
              return (
                <div
                  key={cond.id}
                  onClick={() => setSelectedCondition(cond)}
                  style={{
                    padding: '1rem',
                    background: isSelected ? 'rgba(197, 40, 72, 0.2)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--color-heart-red)' : 'rgba(143, 32, 56, 0.3)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>{cond.icd10}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-brain-rose)' }}>{cond.category.split(' ')[0]}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warm-white)', marginBottom: '0.2rem' }}>
                    {cond.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
                    Primary: {cond.primarySystem}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Disease Detail */}
        <main>
          {selectedCondition && (
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.3)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.25rem', borderBottom: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-crimson">{selectedCondition.icd10}</span>
                    <span className="badge badge-neutral">{selectedCondition.category}</span>
                    <span className="badge badge-rose">Primary Target: {selectedCondition.primaryOrganId.toUpperCase()}</span>
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0.2rem 0' }}>
                    {selectedCondition.name}
                  </h2>
                </div>

                <Link to="/twin" className="btn btn-secondary btn-sm">
                  <Layers size={14} /> View {selectedCondition.primaryOrganId.toUpperCase()} in 3D
                </Link>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '0.5rem', margin: '1.25rem 0', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', paddingBottom: '0.5rem' }}>
                <button
                  className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('overview')}
                >
                  Overview & Mechanisms
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'progression' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('progression')}
                >
                  Progression Stages
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'treatments' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('treatments')}
                >
                  Established Treatments
                </button>
                <button
                  className={`btn btn-sm ${activeTab === 'questions' ? 'btn-primary' : 'btn-ghost'}`}
                  onClick={() => setActiveTab('questions')}
                >
                  Questions for Your Doctor
                </button>
              </div>

              {/* TAB 1: Overview & Pathophysiology */}
              {activeTab === 'overview' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-brain-rose)', marginBottom: '0.5rem' }}>
                      What is this condition?
                    </h3>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.7, color: 'var(--color-warm-white)' }}>
                      {selectedCondition.overview}
                    </p>
                  </div>

                  <div style={{ padding: '1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-heart-red)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={15} /> Biological Pathophysiology & Tissue Impact
                    </h4>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--color-muted-pink)' }}>
                      {selectedCondition.pathophysiology}
                    </p>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div style={{ padding: '1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-warm-white)', marginBottom: '0.65rem' }}>
                        Common Clinical Symptoms
                      </h4>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
                        {selectedCondition.commonSymptoms.map((sym, i) => (
                          <li key={i}>{sym}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ padding: '1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-warm-white)', marginBottom: '0.65rem' }}>
                        Known Epidemiological Risk Factors
                      </h4>
                      <ul style={{ paddingLeft: '1.2rem', fontSize: '0.8rem', color: 'var(--color-muted-pink)', lineHeight: 1.6 }}>
                        {selectedCondition.riskFactors.map((rf, i) => (
                          <li key={i}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Progression Stages */}
              {activeTab === 'progression' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Anatomical Disease Progression Stages
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {selectedCondition.stages.map((stg, i) => (
                      <div key={i} style={{ padding: '1.25rem', background: 'var(--color-bg-surface-elevated)', borderLeft: '3px solid var(--color-heart-red)', borderRadius: '0 var(--radius-md) var(--radius-md) 0' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-heart-red)', marginBottom: '0.25rem' }}>
                          {stg.stage}
                        </div>
                        <p style={{ fontSize: '0.825rem', color: 'var(--color-warm-white)', margin: '0 0 0.5rem' }}>
                          {stg.description}
                        </p>
                        <div style={{ fontSize: '0.775rem', color: 'var(--color-muted-pink)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Layers size={13} color="var(--color-brain-rose)" />
                          <span><strong>Tissue Impact:</strong> {stg.anatomicalImpact}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(34, 13, 22, 0.85)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
                    <Info size={13} style={{ display: 'inline', marginRight: '4px' }} />
                    Note: Progression stages are educational visualizations of typical clinical courses and do not predict an individual's personal trajectory without physician evaluation.
                  </div>
                </div>
              )}

              {/* TAB 3: Established Treatments */}
              {activeTab === 'treatments' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Established Clinical & Evidence-Based Treatments
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    {selectedCondition.establishedTreatments.map((tx, i) => (
                      <div key={i} style={{ padding: '1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                        <span className="badge badge-crimson" style={{ fontSize: '0.65rem', marginBottom: '0.4rem' }}>{tx.type}</span>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warm-white)', marginBottom: '0.35rem' }}>
                          {tx.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', lineHeight: 1.5 }}>
                          {tx.details}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(78, 170, 131, 0.1)', border: '1px solid rgba(78, 170, 131, 0.3)', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CheckCircle2 size={16} /> Prevention & Health Mastery
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-warm-white)', lineHeight: 1.5 }}>
                      {selectedCondition.preventionInfo}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 4: Questions for Doctor */}
              {activeTab === 'questions' && (
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
                    Recommended Questions to Ask Your Attending Physician
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedCondition.questionsForDoctor.map((q, i) => (
                      <div key={i} style={{ padding: '1rem 1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)', fontSize: '0.85rem', color: 'var(--color-warm-white)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--color-heart-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>
                          {i + 1}
                        </span>
                        <span>{q}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DiseaseExplorerPage;
