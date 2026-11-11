// In-Memory Persistent Store with Synthetic Demo Clinical Records
// Ensures 100% functionality without requiring external PostgreSQL service

export interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  role: 'patient' | 'doctor' | 'admin';
  emailVerified: boolean;
  avatarUrl?: string;
  createdAt: string;
}

export interface StoredRecord {
  id: string;
  patientId: string;
  organId?: string;
  type: string;
  title: string;
  content: string;
  date: string;
  source: string;
  verificationStatus: string;
  verifiedBy?: string;
  verifiedAt?: string;
  metadata?: any;
}

export interface StoredReport {
  id: string;
  patientId: string;
  type: string;
  title: string;
  originalFileUrl: string;
  originalFileName: string;
  mimeType: string;
  fileSize: number;
  parsedContent?: any;
  ocrText?: string;
  processingStatus: string;
  uploadedAt: string;
  findings: Array<{
    id: string;
    organId?: string;
    name: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: string;
    notes?: string;
  }>;
}

export interface StoredAppointment {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  type: string;
  status: string;
  notes?: string;
  location?: string;
}

export interface StoredTimelineEvent {
  id: string;
  patientId: string;
  organId?: string;
  type: string;
  title: string;
  date: string;
  description: string;
}

export interface StoredAnnotation {
  id: string;
  patientId: string;
  doctorId: string;
  organId?: string;
  content: string;
  position?: any;
  createdAt: string;
}

class MemoryStore {
  public users: StoredUser[] = [];
  public records: StoredRecord[] = [];
  public reports: StoredReport[] = [];
  public appointments: StoredAppointment[] = [];
  public timelineEvents: StoredTimelineEvent[] = [];
  public annotations: StoredAnnotation[] = [];

  constructor() {
    this.seed();
  }

  public seed() {
    // 1. Initial Users
    this.users = [
      {
        id: 'u-patient-001',
        email: 'patient@vitalis.ai',
        // pre-hashed or plain check (bcrypt hashed 'patient123')
        passwordHash: '$2a$12$e7k1U98kZ1f0e4h6yG5k4e3J4uV21e0xXb/e8q1234567890abcde',
        name: 'Sarah Mitchell',
        role: 'patient',
        emailVerified: true,
        createdAt: '2025-08-01T00:00:00.000Z',
      },
      {
        id: 'u-doctor-001',
        email: 'doctor@vitalis.ai',
        passwordHash: '$2a$12$e7k1U98kZ1f0e4h6yG5k4e3J4uV21e0xXb/e8q1234567890abcde',
        name: 'Dr. James Chen',
        role: 'doctor',
        emailVerified: true,
        createdAt: '2025-05-10T00:00:00.000Z',
      },
    ];

    // 2. Verified Records
    this.records = [
      {
        id: 'rec-001',
        patientId: 'u-patient-001',
        organId: 'heart',
        type: 'DIAGNOSIS',
        title: 'Primary Essential Hypertension (Controlled)',
        content: 'Blood pressure stabilized under Lisinopril 10mg daily. Resting average 118/78 mmHg.',
        date: '2026-09-04T10:00:00.000Z',
        source: 'CLINICIAN_ENTERED',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. James Chen, MD (Cardiology)',
        verifiedAt: '2026-09-04T10:30:00.000Z',
      },
      {
        id: 'rec-002',
        patientId: 'u-patient-001',
        organId: 'heart',
        type: 'IMAGING',
        title: 'Transthoracic Echocardiogram (2D/Doppler)',
        content: 'Left ventricular ejection fraction confirmed at 62%. Normal wall thickness, no regional hypokinesis.',
        date: '2026-09-04T11:00:00.000Z',
        source: 'CLINICIAN_ENTERED',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. James Chen, MD (Cardiology)',
        verifiedAt: '2026-09-04T11:15:00.000Z',
      },
      {
        id: 'rec-003',
        patientId: 'u-patient-001',
        organId: 'liver',
        type: 'LAB_REPORT',
        title: 'Comprehensive Metabolic Panel - Transaminases',
        content: 'Mild ALT elevation (38 U/L). Bilirubin and Albumin normal.',
        date: '2026-10-18T08:30:00.000Z',
        source: 'LAB_DIRECT',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Quest Diagnostics',
        verifiedAt: '2026-10-18T14:00:00.000Z',
      },
      {
        id: 'rec-004',
        patientId: 'u-patient-001',
        organId: 'kidneys',
        type: 'LAB_REPORT',
        title: 'Renal Function Screen (eGFR & Creatinine)',
        content: 'eGFR 98 mL/min/1.73m², Serum Creatinine 0.82 mg/dL. Preserved stage 1 renal physiology.',
        date: '2026-10-18T08:30:00.000Z',
        source: 'LAB_DIRECT',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Quest Diagnostics',
        verifiedAt: '2026-10-18T14:00:00.000Z',
      },
      {
        id: 'rec-005',
        patientId: 'u-patient-001',
        organId: 'lungs',
        type: 'PROCEDURE',
        title: 'Resting Pulse Oximetry & Spirometry Screen',
        content: 'SpO2 98.5% on room air. FEV1/FVC ratio 82% of predicted capacity. No obstructive airway defect.',
        date: '2026-10-29T09:15:00.000Z',
        source: 'CLINICIAN_ENTERED',
        verificationStatus: 'VERIFIED',
        verifiedBy: 'Dr. James Chen, MD',
        verifiedAt: '2026-10-29T09:30:00.000Z',
      },
    ];

    // 3. Medical Reports with Findings
    this.reports = [
      {
        id: 'rep-001',
        patientId: 'u-patient-001',
        type: 'LAB_REPORT',
        title: 'Comprehensive Lipid & Metabolic Profile',
        originalFileUrl: '/uploads/demo-cmp-oct2026.pdf',
        originalFileName: 'Quest_Diagnostics_CMP_Oct2026.pdf',
        mimeType: 'application/pdf',
        fileSize: 142850,
        processingStatus: 'COMPLETED',
        uploadedAt: '2026-10-18T09:00:00.000Z',
        ocrText: 'QUEST DIAGNOSTICS - CLINICAL REPORT\nPatient: Sarah Mitchell, DOB: 1984-06-12\nTest: Total Cholesterol: 182 mg/dL\nLDL-C: 104 mg/dL [High]\nHDL-C: 56 mg/dL [Normal]\nTriglycerides: 110 mg/dL [Normal]\nHbA1c: 5.4% [Normal]\nALT: 38 U/L [High, Ref 7-35]\nAST: 32 U/L [Normal]\neGFR: 98 mL/min [Optimal]\nCreatinine: 0.82 mg/dL [Normal]',
        findings: [
          {
            id: 'f-1',
            organId: 'heart',
            name: 'LDL-C Cholesterol',
            value: '104',
            unit: 'mg/dL',
            referenceRange: '< 100 mg/dL',
            status: 'abnormal',
            notes: 'Borderline elevated. Suggests continued Atorvastatin 20mg.',
          },
          {
            id: 'f-2',
            organId: 'heart',
            name: 'High-Sensitivity CRP',
            value: '0.8',
            unit: 'mg/L',
            referenceRange: '< 1.0 mg/L',
            status: 'normal',
            notes: 'Low cardiovascular inflammation tier.',
          },
          {
            id: 'f-3',
            organId: 'liver',
            name: 'Alanine Aminotransferase (ALT)',
            value: '38',
            unit: 'U/L',
            referenceRange: '7 - 35 U/L',
            status: 'abnormal',
            notes: 'Mild transient elevation. Repeat in 60 days.',
          },
          {
            id: 'f-4',
            organId: 'kidneys',
            name: 'Estimated GFR (CKD-EPI)',
            value: '98',
            unit: 'mL/min',
            referenceRange: '> 90 mL/min',
            status: 'normal',
            notes: 'Optimal renal clearance.',
          },
        ],
      },
    ];

    // 4. Appointments
    this.appointments = [
      {
        id: 'apt-001',
        patientId: 'u-patient-001',
        doctorId: 'u-doctor-001',
        date: '2026-11-14T14:30:00.000Z',
        type: 'Cardiology Bi-Annual Follow-Up',
        status: 'SCHEDULED',
        location: 'Cardiology Specialists Suite 402',
        notes: 'Review 24-hr ambulatory BP log and lipid panel adjustments.',
      },
    ];

    // 5. Timeline Events
    this.timelineEvents = [
      {
        id: 'tle-1',
        patientId: 'u-patient-001',
        organId: 'liver',
        type: 'LAB_REPORT',
        title: 'Comprehensive Metabolic Panel Verified',
        date: '2026-10-18T08:30:00.000Z',
        description: 'Quest Diagnostics synced via FHIR HL7. eGFR at 98 mL/min; mild transaminase elevation noted.',
      },
      {
        id: 'tle-2',
        patientId: 'u-patient-001',
        organId: 'heart',
        type: 'IMAGING',
        title: '2D Transthoracic Echocardiogram',
        date: '2026-09-04T11:00:00.000Z',
        description: 'Confirmed LVEF at 62% with normal diastolic filling and no valvular regurgitation.',
      },
      {
        id: 'tle-3',
        patientId: 'u-patient-001',
        organId: 'heart',
        type: 'IMAGING',
        title: 'Coronary Artery Calcium CT',
        date: '2026-01-12T14:00:00.000Z',
        description: 'Agatston Score = 0. Zero coronary artery calcification observed.',
      },
    ];

    // 6. Clinical Annotations
    this.annotations = [
      {
        id: 'ann-1',
        patientId: 'u-patient-001',
        doctorId: 'u-doctor-001',
        organId: 'heart',
        content: 'Left ventricular myocardium shows normal contractility on echo. ACE-inhibitor regimen stabilized.',
        position: { x: -0.08, y: 0.45, z: 0.15 },
        createdAt: '2026-09-04T11:30:00.000Z',
      },
      {
        id: 'ann-2',
        patientId: 'u-patient-001',
        doctorId: 'u-doctor-001',
        organId: 'liver',
        content: 'Borderline ALT (38 U/L). Advised reduction in refined dietary sugars; re-test in 2 months.',
        position: { x: 0.2, y: -0.04, z: 0.14 },
        createdAt: '2026-10-18T15:00:00.000Z',
      },
    ];
  }
}

export const store = new MemoryStore();

