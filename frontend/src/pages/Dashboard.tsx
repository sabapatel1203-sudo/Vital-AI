import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import HumanTwin3D from '../components/HumanTwin3D';
import { 
  Activity, 
  FileText, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Pill, 
  ArrowRight, 
  TrendingUp,
  Share2,
  Download,
  ShieldCheck,
  X,
  BellRing
} from 'lucide-react';
import MedicationAlarmWidget from '../components/MedicationAlarmWidget';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import './Dashboard.css';

interface MedicationItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  indication: string;
  takenToday: boolean;
}

const INITIAL_MEDS: MedicationItem[] = [
  { id: 'm1', name: 'Lisinopril', dosage: '10 mg PO', frequency: 'Daily • 08:00 AM', indication: 'Arterial Pressure', takenToday: true },
  { id: 'm2', name: 'Atorvastatin', dosage: '20 mg PO', frequency: 'Nightly • 21:00 PM', indication: 'Lipid Stabilization', takenToday: true },
  { id: 'm3', name: 'Omega-3 EPA/DHA', dosage: '1,000 mg', frequency: 'Daily with food', indication: 'Cardioprotection', takenToday: false },
];

export const DashboardPage: React.FC = () => {
  const { openAlarmModal } = useMedicationAlarm();
  const [meds, setMeds] = useState(INITIAL_MEDS);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState('doctor@vitalis.ai');
  const [shareScope, setShareScope] = useState<'all' | 'cardio' | 'labs'>('all');
  const [shareSuccess, setShareSuccess] = useState(false);

  const toggleMed = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, takenToday: !m.takenToday } : m))
    );
  };

  const handleExportRecords = () => {
    const exportData = {
      patient: 'Sarah Mitchell',
      mrn: '#4092-SM',
      exportedAt: new Date().toISOString(),
      activeDiagnoses: ['Primary Essential Hypertension (ICD-10 I10)', 'Atherosclerotic Vascular Surveillance (ICD-10 I25.10)'],
      medications: meds,
      biomarkers: {
        ldl: '104 mg/dL',
        hba1c: '5.4%',
        egfr: '98 mL/min',
        alt: '38 U/L',
      },
      security: 'HIPAA & GDPR Sovereign Export Token #VTL-94820-2026',
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Sarah_Mitchell_Vitalis_EHR_Export.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateShareToken = (e: React.FormEvent) => {
    e.preventDefault();
    setShareSuccess(true);
    setTimeout(() => {
      setShareSuccess(false);
      setShareModalOpen(false);
    }, 2500);
  };

  return (
    <div className="patient-dash-page">
      {/* ── Top Clinical Header Bar ── */}
      <header className="patient-dash-header">
        <div className="patient-dash-header__inner">
          <div className="patient-dash-user-row">
            <div className="patient-dash-avatar">
              SM
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <h1 className="patient-dash-title">Sarah Mitchell</h1>
                <span className="badge badge-crimson">Patient Twin #4092</span>
              </div>
              <div className="patient-dash-meta">
                <span>Age: 42 • Female</span>
                <span>•</span>
                <span>Blood: O Rh+</span>
                <span>•</span>
                <span>Attending: <strong>Dr. James Chen, MD (Cardiology)</strong></span>
                <span>•</span>
                <span style={{ color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                  <CheckCircle2 size={13} /> Digital Twin Active
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShareModalOpen(true)}>
              <Share2 size={14} /> Share with Doctor
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleExportRecords}>
              <Download size={14} /> Export Records
            </button>
            <Link to="/reports" className="btn btn-secondary btn-sm">
              <FileText size={14} /> Reports & AI
            </Link>
            <Link to="/twin" className="btn btn-primary btn-sm">
              Launch 3D Anatomy Lab <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Clinical Content Grid ── */}
      <main className="patient-dash-main">
        {/* Left Column: 3D Body Preview & Certified Clinical EHR */}
        <div>
          {/* 3D Body Preview Widget */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <Activity size={16} color="var(--color-heart-red)" />
                <span>Synchronized 3D Physiological Avatar</span>
              </div>
              <Link to="/twin" className="btn btn-ghost btn-sm" style={{ color: 'var(--color-brain-rose)' }}>
                Full-Height Viewport →
              </Link>
            </div>

            <div style={{ height: '380px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <HumanTwin3D compact={true} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0.65rem 0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--color-muted-pink)' }}>Heart Sinus Rhythm:</span>{' '}
                <strong style={{ color: 'var(--color-warm-white)' }}>72 BPM</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted-pink)' }}>Blood Pressure:</span>{' '}
                <strong style={{ color: 'var(--color-warm-white)' }}>118 / 78 mmHg</strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-muted-pink)' }}>SpO2 Oximetry:</span>{' '}
                <strong style={{ color: 'var(--color-warm-white)' }}>98.5%</strong>
              </div>
            </div>
          </div>

          {/* Documented Medical Conditions (ICD-10) */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <FileText size={16} color="var(--color-crimson)" />
                <span>Documented Medical Conditions</span>
              </div>
              <span className="badge badge-neutral">EHR Certified</span>
            </div>

            <div className="data-row-item">
              <div>
                <div className="data-row-label">Primary Essential Hypertension (ICD-10 I10)</div>
                <div className="data-row-subtext">Diagnosed Aug 2025 • Stabilized under Lisinopril 10mg daily</div>
              </div>
              <span className="badge badge-success">Controlled</span>
            </div>

            <div className="data-row-item">
              <div>
                <div className="data-row-label">Atherosclerotic Vascular Surveillance (ICD-10 I25.10)</div>
                <div className="data-row-subtext">Annual Cardiology review • Agatston Calcium score: 0</div>
              </div>
              <span className="badge badge-success">Optimal</span>
            </div>

            <div className="data-row-item">
              <div>
                <div className="data-row-label">Borderline Hepatic Transaminase (ICD-10 R74.01)</div>
                <div className="data-row-subtext">ALT 38 U/L (Quest Diagnostics Oct 18, 2026) • Dietary review advised</div>
              </div>
              <span className="badge badge-warning">Surveillance</span>
            </div>
          </div>

          {/* Recent Certified Laboratory Biomarkers */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <TrendingUp size={16} color="var(--color-heart-red)" />
                <span>Recent Diagnostic Lab Panels</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>Oct 18, 2026</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>LDL-C Cholesterol</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warm-white)', margin: '0.2rem 0' }}>
                  104 <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>mg/dL</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)' }}>Target: &lt; 100 mg/dL</div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>Hemoglobin A1c</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warm-white)', margin: '0.2rem 0' }}>
                  5.4 <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>%</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>Optimal Non-Diabetic</div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>Estimated GFR (Renal)</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warm-white)', margin: '0.2rem 0' }}>
                  98 <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>mL/min</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>Stage 1 Preserved Function</div>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>hs-CRP Inflammation</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warm-white)', margin: '0.2rem 0' }}>
                  0.8 <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>mg/L</span>
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-success)' }}>Low Vascular Risk Tier</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Medications, Appointments, Timeline & Alerts */}
        <div>
          {/* Current Prescriptions & Daily Adherence */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <Pill size={16} color="var(--color-heart-red)" />
                <span>Recorded Medications & Dose Alarms</span>
              </div>
              <button
                onClick={() => openAlarmModal()}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.725rem', padding: '0.25rem 0.6rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <BellRing size={12} color="var(--color-heart-red)" />
                <span>Manage Alarms</span>
              </button>
            </div>

            {/* Next Dose Alarm Widget */}
            <MedicationAlarmWidget />

            {meds.map((med) => (
              <div key={med.id} className="med-row-card">
                <div>
                  <div className="med-row-name">
                    {med.name} <span style={{ color: 'var(--color-heart-red)' }}>({med.dosage})</span>
                  </div>
                  <div className="med-row-meta">
                    {med.frequency} • {med.indication}
                  </div>
                </div>
                <button
                  className={`btn btn-sm ${med.takenToday ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => toggleMed(med.id)}
                  style={{ fontSize: '0.75rem' }}
                >
                  {med.takenToday ? '✓ Completed' : 'Mark Taken'}
                </button>
              </div>
            ))}
          </div>

          {/* Upcoming Clinical Appointments */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <Calendar size={16} color="var(--color-brain-rose)" />
                <span>Upcoming Clinical Encounters</span>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'rgba(59, 16, 30, 0.5)', border: '1px solid rgba(143, 32, 56, 0.35)', borderRadius: 'var(--radius-sm)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warm-white)' }}>
                    Bi-Annual Cardiology Review
                  </div>
                  <div style={{ fontSize: '0.775rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                    Dr. James Chen, MD, FACC • Cardiology Specialists Suite 402
                  </div>
                </div>
                <span className="badge badge-crimson">Nov 14, 2026</span>
              </div>
              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(143, 32, 56, 0.25)', fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
                Agenda: 24-hour ambulatory BP reconciliation and lipid panel adjustment.
              </div>
            </div>
          </div>

          {/* Longitudinal Health History Timeline */}
          <div className="clinical-panel">
            <div className="clinical-panel-header">
              <div className="clinical-panel-title">
                <Clock size={16} color="var(--color-muted-pink)" />
                <span>Recent Medical Timeline</span>
              </div>
            </div>

            <div className="clinical-timeline">
              <div className="timeline-entry">
                <div className="timeline-bullet" />
                <div className="timeline-date">Oct 18, 2026</div>
                <div className="timeline-heading">Comprehensive Metabolic Panel</div>
                <div className="timeline-body-text">
                  Quest Diagnostics lab draw synced via FHIR HL7. eGFR at 98 mL/min; HbA1c optimal.
                </div>
              </div>

              <div className="timeline-entry">
                <div className="timeline-bullet" />
                <div className="timeline-date">Sep 04, 2026</div>
                <div className="timeline-heading">2D Transthoracic Echocardiogram</div>
                <div className="timeline-body-text">
                  Left ventricular ejection fraction confirmed at 62% with normal diastolic filling.
                </div>
              </div>

              <div className="timeline-entry">
                <div className="timeline-bullet" />
                <div className="timeline-date">Jan 12, 2026</div>
                <div className="timeline-heading">Coronary Artery Calcium CT</div>
                <div className="timeline-body-text">
                  Zero coronary calcification detected (Agatston = 0).
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Share with Doctor Modal ── */}
      {shareModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10, 3, 6, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.4)', borderRadius: 'var(--radius-lg)', maxWidth: '540px', width: '100%', padding: '2rem', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={18} color="var(--color-heart-red)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>Authorize Clinical Record Access</h3>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setShareModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--color-muted-pink)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
              Grant time-delimited, patient-controlled access to your 3D digital twin, laboratory panels, and diagnostic imaging. You can revoke access at any moment.
            </p>

            {shareSuccess ? (
              <div style={{ padding: '1.25rem', background: 'rgba(78, 170, 131, 0.15)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <CheckCircle2 size={32} color="var(--color-success)" style={{ margin: '0 auto 0.5rem' }} />
                <div style={{ fontWeight: 700, color: 'var(--color-warm-white)', fontSize: '0.95rem' }}>Access Token Generated & Dispatched</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.25rem' }}>
                  Secure cryptographic token #VTL-AUTH-8492 transmitted to <strong>{doctorEmail}</strong>.
                </div>
              </div>
            ) : (
              <form onSubmit={handleGenerateShareToken} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Attending Physician Email or NPI</label>
                  <input
                    type="text"
                    className="input-field"
                    value={doctorEmail}
                    onChange={(e) => setDoctorEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Record Scope Authorization</label>
                  <select
                    className="input-field"
                    value={shareScope}
                    onChange={(e) => setShareScope(e.target.value as any)}
                  >
                    <option value="all">Full Digital Twin (Anatomy, Labs, Imaging, Notes)</option>
                    <option value="cardio">Cardiovascular Specific (Heart, ECG, Echo)</option>
                    <option value="labs">Diagnostic Chemistry Panels Only</option>
                  </select>
                </div>

                <div style={{ padding: '0.75rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>
                  <ShieldCheck size={14} color="var(--color-success)" style={{ display: 'inline', marginRight: '4px' }} />
                  Access tokens are single-tenant, end-to-end encrypted under HIPAA Security Rule § 164.312.
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setShareModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Generate Sovereign Share Token
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
