import React, { useState } from 'react';
import HumanTwin3D, { type TwinMode } from '../components/HumanTwin3D';
import { 
  Heart, 
  Brain, 
  Wind, 
  Activity, 
  CheckCircle2, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  Calendar, 
  Pill, 
  Stethoscope, 
  Layers, 
  Info, 
  Eye,
  BellRing
} from 'lucide-react';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import MedicationAlarmWidget from '../components/MedicationAlarmWidget';
import './HumanWorkspace.css';

interface OrganRecordData {
  id: string;
  name: string;
  system: string;
  recordedDocCount: number;
  diagnoses: { code: string; title: string; verifiedDate: string; clinician: string }[];
  treatments: { name: string; dosage: string; frequency: string; status: string }[];
  diagnostics: { test: string; result: string; date: string; refRange: string }[];
  timelineEvents: { title: string; date: string; summary: string }[];
  aiExplanation: string;
}

const CLINICAL_ORGAN_RECORDS: Record<string, OrganRecordData> = {
  heart: {
    id: 'heart',
    name: 'Cardiovascular Core (Heart & Great Vessels)',
    system: 'Cardiovascular System',
    recordedDocCount: 5,
    diagnoses: [
      {
        code: 'ICD-10 I10',
        title: 'Primary Essential Hypertension (Controlled)',
        verifiedDate: 'Aug 14, 2025',
        clinician: 'Dr. James Chen, MD (Cardiology)',
      },
      {
        code: 'ICD-10 I25.10',
        title: 'Atherosclerotic Vascular Surveillance (Subclinical)',
        verifiedDate: 'Sep 04, 2026',
        clinician: 'Dr. James Chen, MD (Cardiology)',
      },
    ],
    treatments: [
      { name: 'Lisinopril', dosage: '10 mg PO', frequency: 'Daily • 08:00 AM', status: 'Active • 98% Adherent' },
      { name: 'Atorvastatin', dosage: '20 mg PO', frequency: 'Daily • 21:00 PM', status: 'Active • Cardioprotective' },
    ],
    diagnostics: [
      { test: 'Transthoracic Echocardiogram (2D/Doppler)', result: 'LVEF 62% • No regional wall motion defect', date: 'Sep 04, 2026', refRange: '55 - 70%' },
      { test: 'Coronary Artery Calcium (CAC) Scan', result: 'Agatston Score: 0 (Zero calcification)', date: 'Jan 12, 2026', refRange: '0 (Normal)' },
      { test: 'High-Sensitivity Troponin I (hs-cTnI)', result: '< 3.2 ng/L (Within normal limits)', date: 'Oct 18, 2026', refRange: '< 14 ng/L' },
    ],
    timelineEvents: [
      { title: 'Cardiology Longitudinal Review', date: 'Sep 04, 2026', summary: 'Ambulatory 24-hr BP cuff confirmed optimal 118/78 mmHg control.' },
      { title: 'Coronary Calcium CT Protocol', date: 'Jan 12, 2026', summary: 'Confirmed absence of calcified coronary atheroma.' },
    ],
    aiExplanation: 'AI Twin Insight: Sarah\'s myocardial oxygen demand is well-buffered by normal systemic vascular resistance. Projected 10-year major adverse cardiovascular event (MACE) risk is calculated at 4.8% (Framingham/ACC cohort standard). Maintain current ACE-inhibitor timing.',
  },
  lungs: {
    id: 'lungs',
    name: 'Pulmonary System (Bilateral Lungs)',
    system: 'Respiratory System',
    recordedDocCount: 3,
    diagnoses: [
      {
        code: 'ICD-10 R09.89',
        title: 'No Active Pulmonary Pathology',
        verifiedDate: 'Sep 04, 2026',
        clinician: 'Dr. James Chen, MD',
      },
    ],
    treatments: [],
    diagnostics: [
      { test: 'Resting Pulse Oximetry (SpO2)', result: '98.5% on ambient air', date: 'Oct 29, 2026', refRange: '95 - 100%' },
      { test: 'Spirometry Baseline (FEV1 / FVC)', result: '82% of predicted capacity', date: 'Jun 10, 2025', refRange: '> 75%' },
    ],
    timelineEvents: [
      { title: 'Annual Pulmonary Function Screen', date: 'Jun 10, 2025', summary: 'Negative for obstructive or restrictive ventilatory defects.' },
    ],
    aiExplanation: 'AI Twin Insight: Alveolar gas exchange dynamics demonstrate healthy ventilation-perfusion matching (V/Q ratio = 0.84). No respiratory vulnerability indicated.',
  },
  brain: {
    id: 'brain',
    name: 'Cerebral Cortex & Central Nervous System',
    system: 'Nervous System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 G44.2',
        title: 'Tension-Type Cephalalgia (Episodic, Stress-Related)',
        verifiedDate: 'Mar 18, 2026',
        clinician: 'Dr. Karen Vance, MD (Neurology)',
      },
    ],
    treatments: [
      { name: 'Magnesium Glycinate', dosage: '400 mg PO', frequency: 'Nightly', status: 'Nutritional Support' },
    ],
    diagnostics: [
      { test: 'Quantitative Sleep Architecture (REM Ratio)', result: '24.2% (Deep recovery stage intact)', date: 'Oct 27, 2026', refRange: '20 - 25%' },
      { test: 'Autonomic HRV RMSSD Index', result: '46 ms (Optimal parasympathetic tone)', date: 'Oct 29, 2026', refRange: '> 35 ms' },
    ],
    timelineEvents: [
      { title: 'Neurological Consultation', date: 'Mar 18, 2026', summary: 'Brain MRI (3 Tesla) without contrast showed no white matter lesions or microbleeds.' },
    ],
    aiExplanation: 'AI Twin Insight: Alpha-rhythm spectral density (9.8 Hz) reflects low allostatic stress load. Cortical neurovascular coupling is fully intact.',
  },
  liver: {
    id: 'liver',
    name: 'Hepatic Parenchyma (Liver)',
    system: 'Digestive & Metabolic System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 R74.01',
        title: 'Borderline Alanine Aminotransferase (ALT) Elevation',
        verifiedDate: 'Oct 18, 2026',
        clinician: 'Quest Diagnostics Lab Verified',
      },
    ],
    treatments: [],
    diagnostics: [
      { test: 'Serum ALT (Alanine Aminotransferase)', result: '38 U/L (Mild elevation)', date: 'Oct 18, 2026', refRange: '7 - 35 U/L' },
      { test: 'Serum AST (Aspartate Aminotransferase)', result: '32 U/L (Normal)', date: 'Oct 18, 2026', refRange: '8 - 33 U/L' },
    ],
    timelineEvents: [
      { title: 'Comprehensive Metabolic Panel', date: 'Oct 18, 2026', summary: 'Isolated mild transaminase elevation; synthetic hepatic liver panel (Albumin, Bilirubin) normal.' },
    ],
    aiExplanation: 'AI Twin Insight: Transient transaminase elevation correlates with recent dietary sucrose surplus. Predicted resolution within 45 days under Mediterranean dietary adjustments.',
  },
  kidneys: {
    id: 'kidneys',
    name: 'Renal Glomerular Filtration System',
    system: 'Urinary & Renal System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 N28.9',
        title: 'Normal Bilateral Renal Function',
        verifiedDate: 'Oct 18, 2026',
        clinician: 'Dr. James Chen, MD',
      },
    ],
    treatments: [],
    diagnostics: [
      { test: 'Estimated GFR (CKD-EPI Equation)', result: '98 mL/min/1.73m²', date: 'Oct 18, 2026', refRange: '> 90 mL/min' },
      { test: 'Serum Creatinine', result: '0.82 mg/dL', date: 'Oct 18, 2026', refRange: '0.6 - 1.1 mg/dL' },
    ],
    timelineEvents: [
      { title: 'Renal Function Monitoring on ACE-Inhibitor', date: 'Oct 18, 2026', summary: 'Stable glomerular filtration confirmed with Lisinopril therapy.' },
    ],
    aiExplanation: 'AI Twin Insight: Normal glomerular filtration rate with zero protein leak. Renal protective index is high.',
  },
  skeletal: {
    id: 'skeletal',
    name: 'Spinal Column & Osteo-Articular Frame',
    system: 'Skeletal System',
    recordedDocCount: 1,
    diagnoses: [
      {
        code: 'ICD-10 M54.5',
        title: 'Mild Postural Lumbar Strain (Resolved)',
        verifiedDate: 'Nov 02, 2025',
        clinician: 'Physical Therapy Discharge',
      },
    ],
    treatments: [
      { name: 'Core Strengthening Protocol', dosage: 'Exercise Therapy', frequency: '3x Weekly', status: 'Completed' },
    ],
    diagnostics: [
      { test: 'DEXA Bone Mineral Density (T-Score)', result: '+0.4 Lumbar Spine (Normal)', date: 'May 14, 2025', refRange: '> -1.0' },
    ],
    timelineEvents: [
      { title: 'DEXA Bone Densitometry', date: 'May 14, 2025', summary: 'Optimal bone density for chronological age group.' },
    ],
    aiExplanation: 'AI Twin Insight: Skeletal mineral architecture is strong. No osteopenia or vertebral compression markers present.',
  },
  pancreas: {
    id: 'pancreas',
    name: 'Endocrine Pancreas (Islets of Langerhans)',
    system: 'Endocrine System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 R73.09',
        title: 'Normoglycemic Insulin Sensitivity',
        verifiedDate: 'Oct 18, 2026',
        clinician: 'Quest Diagnostics',
      },
    ],
    treatments: [],
    diagnostics: [
      { test: 'Hemoglobin A1c', result: '5.4% (Optimal Non-Diabetic)', date: 'Oct 18, 2026', refRange: '< 5.7%' },
      { test: 'Fasting Plasma Glucose', result: '94 mg/dL', date: 'Oct 18, 2026', refRange: '65 - 99 mg/dL' },
    ],
    timelineEvents: [
      { title: 'Glycemic Biomarker Panel', date: 'Oct 18, 2026', summary: 'Robust pancreatic beta-cell secretory function confirmed.' },
    ],
    aiExplanation: 'AI Twin Insight: Glycated hemoglobin of 5.4% confirms optimal 90-day glucose homeostasis without insulin resistance.',
  },
  thyroid: {
    id: 'thyroid',
    name: 'Thyroid Endocrine Gland',
    system: 'Endocrine System',
    recordedDocCount: 1,
    diagnoses: [
      {
        code: 'ICD-10 E07.9',
        title: 'Euthyroid Basal Metabolic State',
        verifiedDate: 'Apr 22, 2026',
        clinician: 'Dr. James Chen, MD',
      },
    ],
    treatments: [],
    diagnostics: [
      { test: 'Thyroid Stimulating Hormone (TSH)', result: '1.85 mIU/L', date: 'Apr 22, 2026', refRange: '0.45 - 4.5 mIU/L' },
      { test: 'Free Thyroxine (FT4)', result: '1.2 ng/dL', date: 'Apr 22, 2026', refRange: '0.8 - 1.8 ng/dL' },
    ],
    timelineEvents: [
      { title: 'Endocrine Screening', date: 'Apr 22, 2026', summary: 'Intact pituitary-thyroid feedback axis.' },
    ],
    aiExplanation: 'AI Twin Insight: Basal metabolic rate regulation is healthy. Zero thyroid autoantibodies detected.',
  },
  stomach: {
    id: 'stomach',
    name: 'Gastric & Gastrointestinal Tract',
    system: 'Digestive System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 K29.70',
        title: 'Mild Superficial Gastritis (Stress-Induced, In Remission)',
        verifiedDate: 'Feb 11, 2026',
        clinician: 'Dr. Anita Patel, MD (Gastroenterology)',
      },
    ],
    treatments: [
      { name: 'Famotidine', dosage: '20 mg PO', frequency: 'PRN As Needed', status: 'Intermittent' },
    ],
    diagnostics: [
      { test: 'H. pylori Urea Breath Test', result: 'Negative (0.2 delta over baseline)', date: 'Feb 11, 2026', refRange: 'Negative (< 2.4)' },
      { test: 'Fecal Occult Blood Test (FIT)', result: 'Negative / Non-Reactive', date: 'Feb 11, 2026', refRange: 'Negative' },
    ],
    timelineEvents: [
      { title: 'Upper Endoscopy Consultation', date: 'Feb 11, 2026', summary: 'No mucosal ulceration or Barretts metaplasia identified. Mild antral erythema resolved.' },
    ],
    aiExplanation: 'AI Twin Insight: Mucosal barrier integrity is intact with normal gastric acid homeostasis. No markers for active peptic ulceration or Helicobacter pylori infection.',
  },
  muscular: {
    id: 'muscular',
    name: 'Musculoskeletal Myofascial Framework',
    system: 'Muscular System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 M79.1',
        title: 'Trapezius & Cervicothoracic Myofascial Strain',
        verifiedDate: 'Mar 18, 2026',
        clinician: 'Dr. Karen Vance, MD (Neurology)',
      },
    ],
    treatments: [
      { name: 'Ergonomic Desk & Cervical Posture Therapy', dosage: 'Physical Therapy Protocol', frequency: 'Daily Active Breaks', status: 'Active • 94% Adherent' },
      { name: 'Magnesium Glycinate', dosage: '400 mg PO', frequency: 'Nightly', status: 'Muscle Recovery' },
    ],
    diagnostics: [
      { test: 'Surface Electromyography (sEMG) Baseline', result: 'Normal Motor Unit Action Potentials (MUAP)', date: 'Mar 18, 2026', refRange: 'Normal' },
      { test: 'Serum Creatine Kinase (CK Total)', result: '88 U/L (Zero myopathy)', date: 'Oct 18, 2026', refRange: '26 - 192 U/L' },
    ],
    timelineEvents: [
      { title: 'Neuromuscular Assessment', date: 'Mar 18, 2026', summary: 'Confirmed absence of inflammatory myopathy or radiculopathy; cervical strain resolved with ergonomics.' },
    ],
    aiExplanation: 'AI Twin Insight: Normal serum creatine kinase (88 U/L) confirms excellent muscular recovery without statin-associated muscle symptoms (SAMS). Myofascial tone is balanced under active exercise routine.',
  },
  eyes: {
    id: 'eyes',
    name: 'Ocular Globes & Bilateral Optic Pathway',
    system: 'Ophthalmic / Nervous System',
    recordedDocCount: 3,
    diagnoses: [
      {
        code: 'ICD-10 H52.13',
        title: 'Mild Compound Myopic Astigmatism (Refractive Stability)',
        verifiedDate: 'May 14, 2026',
        clinician: 'Dr. Elena Rostova, OD (Ophthalmology)',
      },
    ],
    treatments: [
      { name: 'Blue-Light Filter Corrective Lenses', dosage: '-1.50 OD / -1.25 OS', frequency: 'Continuous Digital VDT Use', status: 'Active' },
    ],
    diagnostics: [
      { test: 'Intraocular Pressure (Goldmann Tonometry)', result: '14 mmHg OD / 15 mmHg OS (Normotensive)', date: 'May 14, 2026', refRange: '10 - 21 mmHg' },
      { test: 'Macular Optical Coherence Tomography (OCT)', result: 'Central foveal thickness 258 µm; RNFL intact bilaterally', date: 'May 14, 2026', refRange: 'Normal architecture' },
      { test: 'Best-Corrected Visual Acuity (BCVA)', result: '20/20 OD, 20/20 OS', date: 'May 14, 2026', refRange: '20/20' },
    ],
    timelineEvents: [
      { title: 'Comprehensive Dilated Fundus Examination', date: 'May 14, 2026', summary: 'Cup-to-disc ratio 0.3 symmetrical. Macula flat and dry. No diabetic or hypertensive microvascular lesions.' },
    ],
    aiExplanation: 'AI Twin Insight: Symmetrical retinal nerve fiber layer (RNFL) thickness rules out subclinical optic neuropathy or glaucomatous cupping. Retinal vasculature confirms healthy microcirculation.',
  },
  nervous: {
    id: 'nervous',
    name: 'Peripheral Nervous System & Sciatic Plexus Trunks',
    system: 'Peripheral Nervous System',
    recordedDocCount: 2,
    diagnoses: [
      {
        code: 'ICD-10 G57.0',
        title: 'Subclinical Sciatic Nerve Radiance Surveillance',
        verifiedDate: 'Mar 18, 2026',
        clinician: 'Dr. Karen Vance, MD (Neurology)',
      },
    ],
    treatments: [
      { name: 'Core Lumbar Stabilization & Piriformis Mobility', dosage: 'Physiotherapy Active Plan', frequency: '3x Weekly', status: 'Active • Complete Remission' },
    ],
    diagnostics: [
      { test: 'Lower Extremity Nerve Conduction Velocity (NCV)', result: 'Tibial 49.2 m/s, Peroneal 51.0 m/s (Normal velocity)', date: 'Mar 18, 2026', refRange: '> 44.0 m/s' },
      { test: 'Deep Tendon Reflexes (Patellar / Achilles)', result: '2+ Symmetrical bilaterally without clonus', date: 'Mar 18, 2026', refRange: '2+ (Normal)' },
    ],
    timelineEvents: [
      { title: 'Lumbar Spine & Peripheral Neuropathy Protocol', date: 'Mar 18, 2026', summary: 'L4-L5 exit foramina patent bilaterally. Sensory evoked potentials demonstrate robust bilateral transmission.' },
    ],
    aiExplanation: 'AI Twin Insight: Electrophysiological metrics establish normal peripheral axonal conduction across all 31 spinal root segments and lumbosacral plexus.',
  },
};

export const HumanWorkspacePage: React.FC = () => {
  const { openAlarmModal } = useMedicationAlarm();
  const [selectedOrganId, setSelectedOrganId] = useState<string | null>('heart');
  const [twinMode, setTwinMode] = useState<TwinMode>('anatomy');
  const [searchQuery, setSearchQuery] = useState('');

  const activeRecord = selectedOrganId ? CLINICAL_ORGAN_RECORDS[selectedOrganId] : null;

  const organList = [
    { id: 'heart', name: 'Cardiovascular Core', system: 'Circulatory', count: 5, icon: Heart },
    { id: 'lungs', name: 'Pulmonary Lobes', system: 'Respiratory', count: 3, icon: Wind },
    { id: 'brain', name: 'Cerebral Cortex', system: 'Nervous', count: 2, icon: Brain },
    { id: 'eyes', name: 'Ocular & Optic Pathways', system: 'Ophthalmic', count: 3, icon: Eye },
    { id: 'nervous', name: 'Peripheral Nerve Trunks', system: 'Nervous', count: 2, icon: Brain },
    { id: 'liver', name: 'Hepatic Parenchyma', system: 'Digestive', count: 2, icon: Activity },
    { id: 'kidneys', name: 'Renal System', system: 'Urinary', count: 2, icon: ShieldCheck },
    { id: 'skeletal', name: 'Spinal Ribcage', system: 'Skeletal', count: 1, icon: Layers },
    { id: 'muscular', name: 'Musculoskeletal Groups', system: 'Muscular', count: 2, icon: Activity },
    { id: 'stomach', name: 'Gastric System', system: 'Digestive', count: 2, icon: Activity },
    { id: 'pancreas', name: 'Endocrine Pancreas', system: 'Endocrine', count: 2, icon: Sparkles },
    { id: 'thyroid', name: 'Thyroid Gland', system: 'Endocrine', count: 1, icon: Activity },
  ];

  const filteredOrgans = organList.filter(
    (o) =>
      o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.system.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="workspace-container">
      {/* ── LEFT COLUMN: Patient Profile, Search & System Selector ── */}
      <aside className="workspace-left-col">
        {/* Patient Profile Card */}
        <div className="workspace-patient-card">
          <div className="workspace-patient-badge">
            <CheckCircle2 size={12} /> Verified Bio-Digital Twin
          </div>
          <h2 className="workspace-patient-name">Sarah Mitchell</h2>
          <div className="workspace-patient-meta">
            <span>Age: 42 • Female</span>
            <span>•</span>
            <span>Blood: O+</span>
            <span>•</span>
            <span>MRN: #4092-SM</span>
          </div>
          <div style={{ marginTop: '0.65rem', fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
            Attending: <strong style={{ color: 'var(--color-warm-white)' }}>Dr. James Chen, MD</strong> (Cardiology)
          </div>
        </div>

        {/* Anatomical Search Filter */}
        <div style={{ padding: '0.85rem 1.25rem 0.25rem' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search organ or system..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.2rem', fontSize: '0.8rem', padding: '0.55rem 0.75rem 0.55rem 2.2rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '10px', color: 'var(--color-muted-pink)' }} />
          </div>
        </div>

        {/* Organ Selection List */}
        <div className="workspace-section-title">Anatomical Structures</div>
        <div className="workspace-organ-list">
          {filteredOrgans.map((organ) => {
            const Icon = organ.icon;
            const isActive = selectedOrganId === organ.id;
            return (
              <button
                key={organ.id}
                className={`workspace-organ-item ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedOrganId(organ.id)}
              >
                <div className="workspace-organ-name">
                  <Icon size={16} color={isActive ? 'var(--color-heart-red)' : 'var(--color-muted-pink)'} />
                  <div>
                    <div>{organ.name}</div>
                    <div style={{ fontSize: '0.675rem', color: 'var(--color-muted-pink)', opacity: 0.8 }}>
                      {organ.system}
                    </div>
                  </div>
                </div>
                <span className="workspace-organ-count">{organ.count} records</span>
              </button>
            );
          })}
        </div>

        {/* Medical History Filter Tags */}
        <div className="workspace-section-title" style={{ marginTop: '1rem' }}>
          Clinical Chart Filters
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', padding: '0 1.25rem 1.5rem' }}>
          <span className="badge badge-crimson" style={{ cursor: 'pointer' }}>Diagnoses (2)</span>
          <span className="badge badge-rose" style={{ cursor: 'pointer' }}>Rx Meds (2)</span>
          <span className="badge badge-neutral" style={{ cursor: 'pointer' }}>Labs (10)</span>
          <span className="badge badge-neutral" style={{ cursor: 'pointer' }}>Genomics (2)</span>
        </div>
      </aside>

      {/* ── CENTER COLUMN: Large Interactive 3D Human Body Model ── */}
      <main className="workspace-center-col">
        <HumanTwin3D
          mode={twinMode}
          onModeChange={setTwinMode}
          selectedOrganId={selectedOrganId}
          onSelectOrgan={setSelectedOrganId}
        />
      </main>

      {/* ── RIGHT COLUMN: Contextual Verified Medical History ── */}
      <aside className="workspace-right-col">
        {activeRecord ? (
          <>
            {/* Header */}
            <div className="workspace-detail-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <span className="workspace-detail-system">{activeRecord.system}</span>
                <span className="badge badge-crimson">{activeRecord.recordedDocCount} Verified Records</span>
              </div>
              <h3 className="workspace-detail-title">{activeRecord.name}</h3>
            </div>

            {/* Records Content Body */}
            <div className="workspace-records-body">
              {/* Dynamic Next Dose Alarm Widget */}
              <MedicationAlarmWidget compact={true} />

              {/* 1. Documented Clinical Diagnoses */}
              <div className="workspace-record-group">
                <div className="workspace-group-heading">
                  <Stethoscope size={14} color="var(--color-heart-red)" /> Documented Clinical Diagnoses
                </div>
                {activeRecord.diagnoses.length > 0 ? (
                  activeRecord.diagnoses.map((diag, i) => (
                    <div key={i} className="workspace-record-card">
                      <div className="workspace-record-tag">{diag.code}</div>
                      <div className="workspace-record-title">{diag.title}</div>
                      <div className="workspace-record-meta">
                        Verified: {diag.verifiedDate} • {diag.clinician}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                    No recorded diagnoses for this anatomical structure.
                  </div>
                )}
              </div>

              {/* 2. Active Treatments & Prescriptions */}
              <div className="workspace-record-group">
                <div className="workspace-group-heading">
                  <Pill size={14} color="var(--color-brain-rose)" /> Active Pharmacotherapy & Treatments
                </div>
                {activeRecord.treatments.length > 0 ? (
                  activeRecord.treatments.map((tx, i) => (
                    <div key={i} className="workspace-record-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div className="workspace-record-title">
                          {tx.name} <span style={{ color: 'var(--color-heart-red)', fontWeight: 600 }}>({tx.dosage})</span>
                        </div>
                        <div className="workspace-record-meta">
                          {tx.frequency} • <strong style={{ color: 'var(--color-success)' }}>{tx.status}</strong>
                        </div>
                      </div>
                      <button
                        onClick={() => openAlarmModal(tx.name.toLowerCase().includes('lisinopril') ? 'med-lisinopril' : 'med-atorvastatin')}
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '0.7rem', padding: '0.3rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                        title="Set or adjust alarm for this medicine"
                      >
                        <BellRing size={12} color="var(--color-heart-red)" />
                        <span>Alarm</span>
                      </button>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', fontStyle: 'italic', padding: '0.5rem 0' }}>
                    No current prescriptions targeting this structure.
                  </div>
                )}
              </div>

              {/* 3. Clinical Diagnostics & Verified Labs */}
              <div className="workspace-record-group">
                <div className="workspace-group-heading">
                  <Activity size={14} color="var(--color-soft-tissue)" /> Verified Lab & Imaging Biomarkers
                </div>
                {activeRecord.diagnostics.map((diag, i) => (
                  <div key={i} className="workspace-record-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
                      <span>{diag.date}</span>
                      <span>Ref: {diag.refRange}</span>
                    </div>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--color-warm-white)', marginTop: '0.2rem' }}>
                      {diag.test}
                    </div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--color-brain-rose)', fontWeight: 700, marginTop: '0.15rem' }}>
                      {diag.result}
                    </div>
                  </div>
                ))}
              </div>

              {/* 4. AI-Assisted Clinical Twin Explanation */}
              <div className="workspace-ai-insight-box">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-heart-red)', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  <Sparkles size={14} /> AI Twin Hemodynamic Synthesis
                </div>
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.5, color: 'var(--color-warm-white)' }}>
                  {activeRecord.aiExplanation}
                </p>
                <div style={{ marginTop: '0.5rem', fontSize: '0.675rem', color: 'var(--color-muted-pink)', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Info size={11} /> AI generated explanation based on verified EHR timeline. Not autonomous diagnosis.
                </div>
              </div>

              {/* 5. Documented Timeline Events */}
              <div className="workspace-record-group">
                <div className="workspace-group-heading">
                  <Calendar size={14} color="var(--color-muted-pink)" /> Clinical Timeline
                </div>
                {activeRecord.timelineEvents.map((evt, i) => (
                  <div key={i} style={{ borderLeft: '2px solid var(--color-crimson)', paddingLeft: '0.75rem', margin: '0.25rem 0' }}>
                    <div style={{ fontSize: '0.725rem', color: 'var(--color-heart-red)', fontWeight: 700 }}>
                      {evt.date} • {evt.title}
                    </div>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.775rem', color: 'var(--color-muted-pink)' }}>
                      {evt.summary}
                    </p>
                  </div>
                ))}
              </div>

              {/* 6. Contextual Action Suite */}
              <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid rgba(143, 32, 56, 0.25)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="/reports"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>Upload & Explain Reports for {activeRecord.name.split(' ')[0]}</span>
                  <span>→</span>
                </a>
                <a
                  href="/explorer"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>Explore Associated Diseases & Complications</span>
                  <span>→</span>
                </a>
                <a
                  href="/assistant"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>Ask AI Assistant About This Structure</span>
                  <span>→</span>
                </a>
                <a
                  href="/imaging"
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'space-between' }}
                >
                  <span>View Diagnostic Scans & Slices</span>
                  <span>→</span>
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="workspace-empty-state">
            <Info size={32} color="var(--color-crimson)" />
            <h4 style={{ color: 'var(--color-warm-white)' }}>No Anatomical Selection</h4>
            <p style={{ fontSize: '0.85rem' }}>
              Click on any organ on the 3D human body or choose an anatomical structure from the left sidebar to inspect verified medical records.
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export default HumanWorkspacePage;
