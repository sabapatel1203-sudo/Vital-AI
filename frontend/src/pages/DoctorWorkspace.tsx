import React, { useState } from 'react';
import HumanTwin3D from '../components/HumanTwin3D';
import { 
  Search, 
  FileText, 
  Activity, 
  CheckCircle2, 
  Pill, 
  Edit3, 
  ShieldCheck, 
  Layers, 
  Save 
} from 'lucide-react';

interface PatientRecord {
  id: string;
  name: string;
  age: number;
  gender: string;
  mrn: string;
  diagnosis: string;
  status: 'stable' | 'attention' | 'critical';
  lastEncounter: string;
  bp: string;
  hr: number;
}

const AUTHORIZED_PATIENTS: PatientRecord[] = [
  { id: 'p1', name: 'Sarah Mitchell', age: 42, gender: 'Female', mrn: '#4092-SM', diagnosis: 'Essential Hypertension (Controlled)', status: 'stable', lastEncounter: 'Sep 04, 2026', bp: '118/78', hr: 72 },
  { id: 'p2', name: 'David Vance', age: 58, gender: 'Male', mrn: '#3180-DV', diagnosis: 'Coronary Plaque Calcification (Agatston 142)', status: 'attention', lastEncounter: 'Oct 12, 2026', bp: '136/88', hr: 78 },
  { id: 'p3', name: 'Elena Rostova', age: 37, gender: 'Female', mrn: '#5102-ER', diagnosis: 'Post-Pericarditis Follow-Up', status: 'stable', lastEncounter: 'Oct 22, 2026', bp: '112/74', hr: 68 },
];

export const DoctorWorkspacePage: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord>(AUTHORIZED_PATIENTS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chart' | 'anatomy' | 'notes' | 'prescribe' | 'compare'>('chart');
  const [prescriptions, setPrescriptions] = useState([
    { id: 'rx-1', name: 'Lisinopril 10 mg Tablet', sig: '1 tab PO daily in AM', indication: 'Primary Hypertension', refills: 3 },
    { id: 'rx-2', name: 'Atorvastatin Calcium 20 mg', sig: '1 tab PO nightly', indication: 'Hyperlipidemia', refills: 3 },
  ]);
  const [newRx, setNewRx] = useState({ name: '', sig: '', indication: '', refills: 2 });
  const [rxSuccess, setRxSuccess] = useState(false);

  const [annotations, setAnnotations] = useState([
    { id: 'ann-1', organ: 'Heart & Aorta', clinician: 'Dr. James Chen, MD', text: 'LVEF 62% confirmed. Stable wall motion on echo. Continue Lisinopril 10mg.', date: 'Sep 04, 2026' },
    { id: 'ann-2', organ: 'Hepatic Parenchyma', clinician: 'Dr. James Chen, MD', text: 'ALT 38 U/L (mild transaminase elevation). Advised Mediterranean lifestyle adjustments.', date: 'Oct 18, 2026' },
  ]);
  const [newAnnOrgan, setNewAnnOrgan] = useState('heart');
  const [newAnnText, setNewAnnText] = useState('');

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRx.name.trim()) return;
    setPrescriptions((prev) => [...prev, { id: `rx-${Date.now()}`, ...newRx }]);
    setNewRx({ name: '', sig: '', indication: '', refills: 2 });
    setRxSuccess(true);
    setTimeout(() => setRxSuccess(false), 3000);
  };

  const handleAddAnnotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnText.trim()) return;
    setAnnotations((prev) => [
      ...prev,
      {
        id: `ann-${Date.now()}`,
        organ: newAnnOrgan.toUpperCase(),
        clinician: 'Dr. James Chen, MD',
        text: newAnnText.trim(),
        date: 'Today • Nov 08, 2026',
      },
    ]);
    setNewAnnText('');
  };
  const [clinicalNote, setClinicalNote] = useState(
    'Patient Sarah Mitchell reviewed for bi-annual cardiology monitoring. Resting blood pressure at 118/78 mmHg on Lisinopril 10mg daily. Ambulatory monitoring confirms adequate diurnal dip without post-dose orthostatic hypotension. Transaminases mildly elevated (ALT 38 U/L) on routine panel; advise low-glycemic dietary lifestyle adjustments and repeat hepatic panel in 60 days. Continue current cardioprotective pharmacotherapy.'
  );
  const [noteSaved, setNoteSaved] = useState(false);

  const filteredPatients = AUTHORIZED_PATIENTS.filter(
    (p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.mrn.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSaveNote = () => {
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2500);
  };

  return (
    <div style={{ paddingTop: '64px', minHeight: '100vh', background: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)', display: 'flex', flexDirection: 'column' }}>
      {/* ── Top Clinician Header ── */}
      <header style={{ padding: '1.25rem 2.5rem', background: 'var(--color-bg-surface)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, var(--color-heart-red), var(--color-crimson))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>
            JC
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>Dr. James Chen, MD, FACC</h2>
              <span className="badge badge-crimson">Attending Cardiologist</span>
            </div>
            <div style={{ fontSize: '0.775rem', color: 'var(--color-muted-pink)', marginTop: '0.15rem' }}>
              Cardiology Associates • NPI: #1892049182 • 3 Active Patient Digital Twins
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-success)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <CheckCircle2 size={14} /> HL7 FHIR Sovereign Node Active
          </span>
        </div>
      </header>

      {/* ── Workspace 2-Column Split ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 140px)' }}>
        {/* Left: Patient Roster & Search */}
        <aside style={{ width: '320px', background: 'rgba(34, 13, 22, 0.85)', borderRight: '1px solid rgba(143, 32, 56, 0.25)', padding: '1.25rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brain-rose)', marginBottom: '0.75rem' }}>
            Authorized Patient Roster
          </div>

          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search by name or MRN..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '0.8rem', padding: '0.55rem 0.75rem 0.55rem 2.2rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-muted-pink)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
            {filteredPatients.map((patient) => {
              const isSelected = selectedPatient.id === patient.id;
              return (
                <div
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    background: isSelected ? 'rgba(197, 40, 72, 0.2)' : 'var(--color-bg-surface-elevated)',
                    border: `1px solid ${isSelected ? 'var(--color-heart-red)' : 'rgba(143, 32, 56, 0.25)'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.9rem', color: isSelected ? 'var(--color-warm-white)' : 'var(--color-warm-white)' }}>
                      {patient.name}
                    </strong>
                    <span className={`badge badge-${patient.status === 'stable' ? 'success' : 'warning'}`} style={{ fontSize: '0.625rem' }}>
                      {patient.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                    {patient.mrn} • {patient.age}y {patient.gender[0]}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-brain-rose)', marginTop: '0.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {patient.diagnosis}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right: Selected Patient Clinical Detail Area */}
        <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Patient Header Banner */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.75rem', background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.3)', borderRadius: 'var(--radius-lg)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>{selectedPatient.name}</h2>
                <span className="badge badge-crimson">{selectedPatient.mrn}</span>
                <span className="badge badge-neutral">Age: {selectedPatient.age} • {selectedPatient.gender}</span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', marginTop: '0.35rem' }}>
                Primary Indication: <strong style={{ color: 'var(--color-warm-white)' }}>{selectedPatient.diagnosis}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', textAlign: 'right' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)', textTransform: 'uppercase' }}>Blood Pressure</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-warm-white)' }}>{selectedPatient.bp} mmHg</div>
              </div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)', textTransform: 'uppercase' }}>Heart Rate</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-heart-red)' }}>{selectedPatient.hr} BPM</div>
              </div>
            </div>
          </div>

          {/* Clinician Action Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', paddingBottom: '0.5rem', flexWrap: 'wrap' }}>
            <button
              className={`btn btn-sm ${activeTab === 'chart' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('chart')}
            >
              <FileText size={15} /> Clinical Chart & Labs
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'anatomy' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('anatomy')}
            >
              <Layers size={15} /> 3D Digital Twin & Annotations
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'prescribe' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('prescribe')}
            >
              <Pill size={15} /> Electronic Prescribing (e-Rx)
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'compare' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('compare')}
            >
              <Activity size={15} /> Longitudinal Lab Comparison
            </button>
            <button
              className={`btn btn-sm ${activeTab === 'notes' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('notes')}
            >
              <Edit3 size={15} /> Attending Clinical Notes
            </button>
          </div>

          {/* TAB 1: Chart & Verified Labs */}
          {activeTab === 'chart' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              {/* Lab Panel Table */}
              <div className="surface-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} color="var(--color-heart-red)" />
                  Verified Diagnostic Chemistry Panel
                </h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid rgba(143, 32, 56, 0.3)', color: 'var(--color-muted-pink)', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Analyte</th>
                        <th style={{ padding: '0.5rem' }}>Value</th>
                        <th style={{ padding: '0.5rem' }}>Reference</th>
                        <th style={{ padding: '0.5rem' }}>Clinical Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                        <td style={{ padding: '0.55rem', fontWeight: 600 }}>LDL-C (Calculated)</td>
                        <td style={{ padding: '0.55rem', fontWeight: 700 }}>104 mg/dL</td>
                        <td style={{ padding: '0.55rem', color: 'var(--color-muted-pink)' }}>&lt; 100</td>
                        <td style={{ padding: '0.55rem' }}><span className="badge badge-warning">Borderline</span></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                        <td style={{ padding: '0.55rem', fontWeight: 600 }}>HDL-C Cholesterol</td>
                        <td style={{ padding: '0.55rem', fontWeight: 700 }}>56 mg/dL</td>
                        <td style={{ padding: '0.55rem', color: 'var(--color-muted-pink)' }}>&gt; 50</td>
                        <td style={{ padding: '0.55rem' }}><span className="badge badge-success">Normal</span></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                        <td style={{ padding: '0.55rem', fontWeight: 600 }}>hs-CRP (Cardio Risk)</td>
                        <td style={{ padding: '0.55rem', fontWeight: 700 }}>0.8 mg/L</td>
                        <td style={{ padding: '0.55rem', color: 'var(--color-muted-pink)' }}>&lt; 1.0</td>
                        <td style={{ padding: '0.55rem' }}><span className="badge badge-success">Optimal</span></td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                        <td style={{ padding: '0.55rem', fontWeight: 600 }}>eGFR (CKD-EPI)</td>
                        <td style={{ padding: '0.55rem', fontWeight: 700 }}>98 mL/min</td>
                        <td style={{ padding: '0.55rem', color: 'var(--color-muted-pink)' }}>&gt; 90</td>
                        <td style={{ padding: '0.55rem' }}><span className="badge badge-success">Normal</span></td>
                      </tr>
                      <tr>
                        <td style={{ padding: '0.55rem', fontWeight: 600 }}>ALT Transaminase</td>
                        <td style={{ padding: '0.55rem', fontWeight: 700 }}>38 U/L</td>
                        <td style={{ padding: '0.55rem', color: 'var(--color-muted-pink)' }}>7 - 35</td>
                        <td style={{ padding: '0.55rem' }}><span className="badge badge-warning">Attention</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Active Pharmacotherapy */}
              <div className="surface-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill size={18} color="var(--color-brain-rose)" />
                  Active Prescriptions
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ padding: '0.75rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                    <div style={{ fontWeight: 700 }}>Lisinopril 10 mg Tablet</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                      Sig: 1 tab PO daily in AM • Indication: Primary Hypertension • Disp: #90 (3 Refills)
                    </div>
                  </div>
                  <div style={{ padding: '0.75rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                    <div style={{ fontWeight: 700 }}>Atorvastatin Calcium 20 mg</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                      Sig: 1 tab PO nightly • Indication: Hyperlipidemia • Disp: #90 (3 Refills)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Synchronized 3D Anatomy with Clinical Annotations */}
          {activeTab === 'anatomy' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ height: '520px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(143, 32, 56, 0.3)' }}>
                <HumanTwin3D compact={false} />
              </div>

              {/* Clinical Annotations List & Add Form */}
              <div className="surface-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Edit3 size={16} color="var(--color-heart-red)" />
                    Clinical Annotations Linked to 3D Anatomy
                  </h3>
                  <span className="badge badge-crimson">{annotations.length} Active Annotations</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  {annotations.map((ann) => (
                    <div key={ann.id} style={{ padding: '0.85rem 1rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                        <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>{ann.organ}</span>
                        <span style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>{ann.date} • {ann.clinician}</span>
                      </div>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.825rem', color: 'var(--color-warm-white)' }}>
                        {ann.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Annotation Form */}
                <form onSubmit={handleAddAnnotation} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <select
                    className="input-field"
                    value={newAnnOrgan}
                    onChange={(e) => setNewAnnOrgan(e.target.value)}
                    style={{ width: '180px', padding: '0.55rem' }}
                  >
                    <option value="heart">Heart & Aorta</option>
                    <option value="liver">Liver & Biliary</option>
                    <option value="lungs">Pulmonary Lobes</option>
                    <option value="kidneys">Renal System</option>
                    <option value="brain">Cerebral Cortex</option>
                    <option value="skeletal">Lumbar Spine</option>
                  </select>

                  <input
                    type="text"
                    className="input-field"
                    placeholder="Enter clinical annotation text for this organ..."
                    value={newAnnText}
                    onChange={(e) => setNewAnnText(e.target.value)}
                    style={{ flex: 1, minWidth: '240px', padding: '0.55rem 0.85rem' }}
                  />

                  <button type="submit" className="btn btn-primary btn-sm">
                    Pin Annotation to 3D Model
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: Electronic Prescribing */}
          {activeTab === 'prescribe' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
              <div className="surface-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill size={18} color="var(--color-heart-red)" />
                  Active EHR Prescriptions
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {prescriptions.map((rx) => (
                    <div key={rx.id} style={{ padding: '0.85rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{rx.name}</span>
                        <span className="badge badge-success" style={{ fontSize: '0.625rem' }}>Active</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                        Sig: {rx.sig} • Indication: {rx.indication} • Refills: {rx.refills}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* New Prescription Form */}
              <div className="surface-card">
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={16} color="var(--color-brain-rose)" /> Issue New Electronic Prescription
                </h3>

                {rxSuccess && (
                  <div style={{ padding: '0.75rem', background: 'rgba(78, 170, 131, 0.2)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: '#8de8c1', fontSize: '0.8rem', marginBottom: '1rem' }}>
                    ✓ Prescription digitally signed and transmitted via Surescripts e-Rx network.
                  </div>
                )}

                <form onSubmit={handleAddRx} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Medication & Strength</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. CoQ10 Ubiquinol 100 mg"
                      value={newRx.name}
                      onChange={(e) => setNewRx({ ...newRx, name: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Instructions (Sig)</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 1 capsule PO daily with breakfast"
                      value={newRx.sig}
                      onChange={(e) => setNewRx({ ...newRx, sig: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>Clinical Indication</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Statin-induced coenzyme support"
                      value={newRx.indication}
                      onChange={(e) => setNewRx({ ...newRx, indication: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm" style={{ marginTop: '0.5rem' }}>
                    <Save size={14} /> Transmit & Add to EHR
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 4: Longitudinal Lab Comparison */}
          {activeTab === 'compare' && (
            <div className="surface-card">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Activity size={18} color="var(--color-heart-red)" />
                Longitudinal Biomarker Comparison (Baseline vs Current)
              </h3>

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid rgba(143, 32, 56, 0.3)', color: 'var(--color-muted-pink)', textAlign: 'left' }}>
                      <th style={{ padding: '0.6rem' }}>Biomarker</th>
                      <th style={{ padding: '0.6rem' }}>Jan 12, 2026 (Baseline)</th>
                      <th style={{ padding: '0.6rem' }}>Oct 18, 2026 (Current)</th>
                      <th style={{ padding: '0.6rem' }}>Net Delta</th>
                      <th style={{ padding: '0.6rem' }}>Physiological Evaluation</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>LDL-C Cholesterol</td>
                      <td style={{ padding: '0.65rem' }}>128 mg/dL</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--color-success)' }}>104 mg/dL</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-success)' }}>-24 mg/dL (-18.7%)</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-muted-pink)' }}>Significant lipid lowering under Atorvastatin 20mg.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>Systolic Blood Pressure</td>
                      <td style={{ padding: '0.65rem' }}>138 mmHg</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--color-success)' }}>118 mmHg</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-success)' }}>-20 mmHg (-14.5%)</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-muted-pink)' }}>Normotensive control achieved under Lisinopril 10mg.</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>ALT Transaminase</td>
                      <td style={{ padding: '0.65rem' }}>26 U/L</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--color-warning)' }}>38 U/L</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-warning)' }}>+12 U/L</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-muted-pink)' }}>Mild isolated fluctuation. Surveillance in 60 days advised.</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.65rem', fontWeight: 700 }}>eGFR (Renal Filtration)</td>
                      <td style={{ padding: '0.65rem' }}>96 mL/min</td>
                      <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--color-success)' }}>98 mL/min</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-success)' }}>+2 mL/min</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-muted-pink)' }}>Stable Stage 1 filtration with preserved kidney function.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: Attending Clinical Notes Editor */}
          {activeTab === 'notes' && (
            <div className="surface-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Edit3 size={18} color="var(--color-heart-red)" />
                  Attending Physician Clinical Encounter Note
                </h3>
                <button className="btn btn-primary btn-sm" onClick={handleSaveNote}>
                  <Save size={14} /> {noteSaved ? '✓ Note Saved to EHR' : 'Sign & Commit to Chart'}
                </button>
              </div>

              <textarea
                value={clinicalNote}
                onChange={(e) => setClinicalNote(e.target.value)}
                rows={10}
                className="input-field"
                style={{ width: '100%', fontFamily: 'monospace', fontSize: '0.85rem', lineHeight: 1.6 }}
              />

              <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--color-muted-pink)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <ShieldCheck size={14} color="var(--color-success)" />
                <span>Digitally countersigned with NPI cryptographic token under HIPAA Omnibus Rules.</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorWorkspacePage;
