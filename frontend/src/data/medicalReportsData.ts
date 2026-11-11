export interface ReportFindingItem {
  name: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: 'normal' | 'borderline' | 'abnormal' | 'critical';
  organId?: string;
  interpretation: string;
}

export interface MedicalReportDocument {
  id: string;
  title: string;
  category: 'Blood Test' | 'Imaging' | 'Cardiology' | 'Pathology' | 'Prescription' | 'Discharge Summary';
  facility: string;
  date: string;
  clinician: string;
  patientName: string;
  organId: string;
  systemName: string;
  fileType: string;
  fileSize: string;
  rawText: string;
  findings: ReportFindingItem[];
  explanations: {
    simple: string;
    detailed: string;
    clinical: string;
  };
  recommendations: string[];
  questionsForDoctor: string[];
  disclaimer: string;
}

export const SAMPLE_REPORTS: MedicalReportDocument[] = [
  {
    id: 'rep-cmp-2026',
    title: 'Comprehensive Metabolic & Hepatic Panel',
    category: 'Blood Test',
    facility: 'Quest Diagnostics Regional Clinical Laboratories',
    date: 'Oct 18, 2026',
    clinician: 'Dr. James Chen, MD, FACC',
    patientName: 'Sarah Mitchell (MRN #4092-SM)',
    organId: 'liver',
    systemName: 'Digestive & Metabolic System',
    fileType: 'PDF Document (HL7 FHIR Synced)',
    fileSize: '348 KB',
    rawText: `QUEST DIAGNOSTICS INC. - CERTIFIED LABORATORY REPORT
Ordering Physician: James Chen, MD | NPI: 1892049182
Patient: Mitchell, Sarah | DOB: 1984-06-12 | Sex: F | MRN: 4092-SM
Collection Date/Time: 2026-10-18 07:45 AM EDT
Accession: #Q-8492019-26

TEST NAME                      RESULT     UNIT       REFERENCE RANGE   FLAG
Glucose, Fasting               94         mg/dL      65 - 99           NORMAL
Urea Nitrogen (BUN)            14         mg/dL      7 - 25            NORMAL
Creatinine, Serum              0.82       mg/dL      0.57 - 1.00       NORMAL
eGFR (CKD-EPI)                 98         mL/min     > 90              NORMAL
Sodium                         141        mmol/L     135 - 145         NORMAL
Potassium                      4.4        mmol/L     3.5 - 5.1         NORMAL
Calcium                        9.4        mg/dL      8.6 - 10.2        NORMAL
Total Protein                  7.2        g/dL       6.0 - 8.3         NORMAL
Albumin                        4.5        g/dL       3.5 - 5.0         NORMAL
Bilirubin, Total               0.7        mg/dL      0.2 - 1.2         NORMAL
Alkaline Phosphatase           62         U/L        35 - 105          NORMAL
Aspartate Aminotransferase     32         U/L        10 - 35           NORMAL
Alanine Aminotransferase (ALT) 38         U/L        7 - 35            HIGH [H]
Estimated Average Glucose      108        mg/dL      70 - 126          NORMAL
Hemoglobin A1c                 5.4        %          < 5.7             NORMAL`,
    findings: [
      {
        name: 'Alanine Aminotransferase (ALT)',
        value: '38',
        unit: 'U/L',
        referenceRange: '7 - 35',
        status: 'abnormal',
        organId: 'liver',
        interpretation: 'Slightly above reference upper threshold (35 U/L). Often reflects transient hepatic metabolic workload or mild liver cellular turnover.',
      },
      {
        name: 'Estimated GFR (eGFR)',
        value: '98',
        unit: 'mL/min/1.73m²',
        referenceRange: '> 90',
        status: 'normal',
        organId: 'kidneys',
        interpretation: 'Stage 1 optimal renal glomerular filtration. Demonstrates stable kidney perfusion during Lisinopril therapy.',
      },
      {
        name: 'Glycated Hemoglobin (HbA1c)',
        value: '5.4',
        unit: '%',
        referenceRange: '< 5.7',
        status: 'normal',
        organId: 'pancreas',
        interpretation: 'Within optimal non-diabetic range, representing stable 90-day glycemic equilibrium.',
      },
      {
        name: 'Serum Potassium (K+)',
        value: '4.4',
        unit: 'mmol/L',
        referenceRange: '3.5 - 5.1',
        status: 'normal',
        organId: 'heart',
        interpretation: 'Important safety marker for patients on ACE-inhibitors. Perfect electrolyte balance with zero hyperkalemia risk.',
      },
    ],
    explanations: {
      simple: `What this report means:
This is a standard routine blood test that checks how well your liver and kidneys are functioning, and how your body processes blood sugar.

What your report shows:
Almost all your tests are completely normal and healthy! Your kidneys are filtering waste exceptionally well, your blood sugar over the past 3 months is optimal, and your electrolytes are balanced. There is one small note: your ALT number (a liver enzyme) is 38, which is just 3 points above the lab's usual upper cutoff of 35.

What it may indicate:
A mild rise like this is very common and usually temporary. It can happen from a recent rich meal, minor dietary changes, over-the-counter pain relievers, or mild stress on liver cells.

What you should do next:
Keep taking your prescribed medications as directed. When you see Dr. Chen next week, mention this test—he will likely recommend drinking plenty of water, enjoying balanced meals, and doing a routine re-check in 2 months.`,
      detailed: `Biomarker & Physiological Breakdown:
• Hepatic Integrity: Alanine Aminotransferase (ALT) is an intracellular enzyme concentrated in hepatocytes. The measured value of 38 U/L exceeds the reference threshold of 35 U/L. Notably, Aspartate Aminotransferase (AST) is 32 U/L and Total Bilirubin is 0.7 mg/dL, showing no hepatocellular necrosis or cholestasis. The de Ritis ratio (AST/ALT = 0.84) indicates metabolic rather than alcohol or drug-induced etiology.
• Renal Safety Profile: Because the patient is prescribed Lisinopril (an ACE inhibitor), serum Potassium (4.4 mmol/L), Serum Creatinine (0.82 mg/dL), and eGFR (98 mL/min) are paramount. All three confirm optimal afferent/efferent arteriolar hemodynamics with zero drug-induced nephrotoxicity or hyperkalemia.
• Carbohydrate Metabolism: HbA1c of 5.4% correlates with an estimated average glucose (eAG) of 108 mg/dL, excluding insulin resistance or pre-diabetes.`,
      clinical: `CLINICAL SUMMARY FOR ATTENDING PHYSICIAN:
Patient: Sarah Mitchell | Age: 42 | Attending: Dr. James Chen, MD
Encounter: Routine 6-month CMP surveillance on ACE-I/Statin pharmacotherapy.
Findings:
1. Isolated grade 1 transaminasemia: ALT 38 U/L (mild elevation, +3 U/L above ref range). AST (32 U/L), Alk Phos (62 U/L), and synthetic synthetic hepatic panel (Albumin 4.5 g/dL, Total Bilirubin 0.7 mg/dL) are intact.
2. Renal tolerance: Creatinine 0.82 mg/dL, eGFR 98 mL/min, K+ 4.4 mEq/L. Lisinopril 10mg daily is well-tolerated without azotemia.
3. Assessment / Plan: Transaminase elevation is subclinical and consistent with nutritional fluctuation or mild statin hepatic effect. Continue Lisinopril 10mg and Atorvastatin 20mg. Recommend repeat hepatic panel in 60-90 days.`,
    },
    recommendations: [
      'Maintain adequate hydration (2.0 to 2.5 liters of water daily).',
      'Continue current prescribed Lisinopril 10mg and Atorvastatin 20mg without interruption.',
      'Limit refined fructose and processed carbohydrates for 60 days.',
      'Schedule routine repeat hepatic function panel in 8-12 weeks.',
    ],
    questionsForDoctor: [
      'Does the small ALT elevation (38 U/L) require adjusting my Atorvastatin dosage?',
      'Are there specific dietary changes that can help normalize my liver enzymes?',
      'When should we schedule my next routine blood panel?',
    ],
    disclaimer: 'This AI summary is an educational translation of certified laboratory findings and does NOT constitute an autonomous clinical diagnosis. Always review findings with your prescribing physician.',
  },
  {
    id: 'rep-echo-2026',
    title: '2D Transthoracic Echocardiogram with Color Doppler',
    category: 'Cardiology',
    facility: 'St. Jude Heart & Vascular Diagnostic Pavilion',
    date: 'Sep 04, 2026',
    clinician: 'Dr. James Chen, MD, FACC',
    patientName: 'Sarah Mitchell (MRN #4092-SM)',
    organId: 'heart',
    systemName: 'Cardiovascular System',
    fileType: 'Diagnostic Ultrasound Report',
    fileSize: '1.2 MB',
    rawText: `TRANSTHORACIC ECHOCARDIOGRAM REPORT (2D / M-MODE / COLOR DOPPLER)
Patient: Sarah Mitchell | MRN: 4092-SM | Date: 2026-09-04
Indication: Essential hypertension surveillance. Assessment of LV function and wall thickness.

LEFT VENTRICLE:
- Normal cavity dimensions. End-diastolic dimension: 4.6 cm (Normal: 3.8 - 5.2 cm).
- Interventricular septal thickness: 0.9 cm (Normal: 0.6 - 1.0 cm). No concentric hypertrophy.
- Posterior wall thickness: 0.85 cm (Normal: 0.6 - 1.0 cm).
- Left Ventricular Ejection Fraction (LVEF): 62% (Normal: 55 - 70%).
- Regional wall motion: Normal contractility across all 17 segments. No hypokinesis or akinesis.

LEFT ATRIUM:
- Normal volume index: 28 mL/m² (Normal: < 34 mL/m²).

VALVULAR FUNCTION:
- Aortic valve: Trileaflet, opens freely. Peak velocity 1.2 m/s. No stenosis or regurgitation.
- Mitral valve: Structurally normal. Normal E/A ratio (1.2). Trace physiological mitral regurgitation.
- Tricuspid valve: Normal leaflets. Estimated pulmonary artery systolic pressure (PASP): 24 mmHg (Normal: < 35 mmHg).
- Pericardium: Normal. No pericardial effusion detected.

IMPRESSION:
1. Normal left ventricular systolic function with preserved LVEF of 62%.
2. No echocardiographic evidence of hypertensive heart disease or left ventricular hypertrophy (LVH).
3. Normal diastolic filling parameters and normal pulmonary arterial pressures.`,
    findings: [
      {
        name: 'Left Ventricular Ejection Fraction (LVEF)',
        value: '62',
        unit: '%',
        referenceRange: '55 - 70%',
        status: 'normal',
        organId: 'heart',
        interpretation: 'Excellent heart pumping strength. More than 60% of the blood in the left ventricle is pumped out with each heartbeat.',
      },
      {
        name: 'Interventricular Septal Thickness',
        value: '0.9',
        unit: 'cm',
        referenceRange: '0.6 - 1.0 cm',
        status: 'normal',
        organId: 'heart',
        interpretation: 'Heart muscle wall thickness is completely normal. Confirms your high blood pressure medication has successfully protected your heart from thickening.',
      },
      {
        name: 'Pulmonary Artery Systolic Pressure',
        value: '24',
        unit: 'mmHg',
        referenceRange: '< 35 mmHg',
        status: 'normal',
        organId: 'heart',
        interpretation: 'Normal pressure in the blood vessels connecting the heart to the lungs.',
      },
    ],
    explanations: {
      simple: `What this ultrasound means:
An echocardiogram is an ultrasound movie of your beating heart. It lets the doctor see your heart muscles squeezing and check all four heart valves.

What your report shows:
Your heart ultrasound is in wonderful shape! Your heart muscle is strong and pumps 62% of its volume with every beat (anything above 55% is considered healthy and normal). Most importantly, the heart walls are not thickened, meaning your blood pressure is well-managed and not straining your heart.

What this confirms:
Your blood pressure medicine (Lisinopril) is doing its job effectively to keep your heart healthy and protected.`,
      detailed: `Cardiovascular Hemodynamic Analysis:
• Systolic Function: Biplane Simpson's method demonstrates an LVEF of 62%, reflecting robust myocardial contractility with zero regional wall motion abnormalities.
• Myocardial Remodeling: Chronic untreated hypertension classically leads to concentric left ventricular hypertrophy (LVH). Sarah's septal thickness is 0.9 cm and posterior wall is 0.85 cm, confirming absence of pathological remodeling.
• Diastolic Filling & Pressures: The E/A ratio of 1.2 and left atrial volume index of 28 mL/m² exclude grade 1 diastolic dysfunction. Estimated PASP of 24 mmHg excludes pulmonary venous hypertension.`,
      clinical: `ECHOCARDIOGRAPHIC CONSULTATION SUMMARY:
Findings: Preserved LV systolic function (LVEF 62%). Zero left ventricular hypertrophy (septal/posterior thickness < 1.0 cm). Intact diastolic filling dynamics. Normal valvular anatomy without hemodynamically significant regurgitation. Estimated PASP 24 mmHg.
Conclusion: No hypertensive cardiomyopathy. Patient demonstrates excellent end-organ cardioprotection under current medical therapy.`,
    },
    recommendations: [
      'Maintain regular aerobic cardiovascular exercise (150 minutes weekly of brisk walking or cycling).',
      'Continue current antihypertensive therapy without modification.',
      'Repeat surveillance echocardiogram in 2 to 3 years per standard clinical guidelines.',
    ],
    questionsForDoctor: [
      'Given the normal heart ultrasound, should we maintain my current Lisinopril dosage?',
      'Are there target heart rate zones I should aim for during exercise?',
    ],
    disclaimer: 'This ultrasound analysis is an AI educational synthesis of imaging measurements and should be interpreted by a board-certified cardiologist.',
  },
  {
    id: 'rep-mri-spine-2026',
    title: 'Magnetic Resonance Imaging (MRI) - Lumbar Spine',
    category: 'Imaging',
    facility: 'University Medical Imaging Specialists',
    date: 'Nov 02, 2025',
    clinician: 'Dr. Karen Vance, MD (Neurology)',
    patientName: 'Sarah Mitchell (MRN #4092-SM)',
    organId: 'skeletal',
    systemName: 'Skeletal & Nervous Systems',
    fileType: 'High-Resolution 3T MRI Scan',
    fileSize: '18.4 MB (DICOM Multi-Slice)',
    rawText: `MRI LUMBAR SPINE WITHOUT INTRAVENOUS CONTRAST
Patient: Sarah Mitchell | MRN: 4092-SM | Date: 2025-11-02
Clinical Indication: Intermittent lower back postural ache following prolonged desk sitting. Exclude radiculopathy or canal stenosis.

TECHNIQUE: Multi-planar T1, T2, and STIR sagittal and axial sequences obtained on a 3.0 Tesla magnet.

FINDINGS:
- Alignment: Normal lumbar lordosis is preserved. No spondylolisthesis or retrolisthesis.
- Marrow Signal: Normal bone marrow signal throughout the lumbar vertebral bodies. No fracture or infiltrative lesion.
- Conus Medullaris: Terminates normally at the L1-L2 disc interspace. Cauda equina nerve roots are unremarkable.
- L1-L2 through L3-L4: Disc heights and signals are preserved. Posterior disc margins are intact. No canal or foraminal narrowing.
- L4-L5: Minimal broad-based disc bulge without focal herniation. The thecal sac and exiting L4 nerve roots are unobstructed. Bilateral neural foramina are patent.
- L5-S1: Preserved disc height. No disc protrusion or facet joint arthropathy.

IMPRESSION:
1. Normal lumbar spine alignment with preserved bone marrow signal.
2. Minimal subclinical broad-based disc bulge at L4-L5 without spinal cord compression, thecal sac indentation, or nerve root impingement.
3. Completely patent neural foramina bilaterally. Negative for lumbar radiculopathy or disc herniation.`,
    findings: [
      {
        name: 'Spinal Canal Diameter (L4-L5)',
        value: '14.2',
        unit: 'mm',
        referenceRange: '> 12 mm',
        status: 'normal',
        organId: 'skeletal',
        interpretation: 'Spinal canal has ample room for all nerve bundles with zero spinal stenosis.',
      },
      {
        name: 'L4-L5 Disc Contour',
        value: 'Mild Bulge',
        unit: '',
        referenceRange: 'Normal Contour',
        status: 'borderline',
        organId: 'skeletal',
        interpretation: 'Common benign age-related cushioning change. Crucially, it does not press on any spinal nerves.',
      },
      {
        name: 'Neural Foramina Patency',
        value: 'Fully Patent',
        unit: '',
        referenceRange: 'Patent',
        status: 'normal',
        organId: 'nervous',
        interpretation: 'Nerve exit tunnels are wide open bilaterally without compression.',
      },
    ],
    explanations: {
      simple: `What this MRI report means:
An MRI uses powerful magnets and radio waves to take detailed 3D slice pictures of the bones, cushions (discs), and nerves in your lower back.

What your report shows:
Your back bones and nerves look very healthy! There is no slipped disc, no pinched nerve, and no narrowing of the spinal canal. At one level (L4-L5), there is a tiny, mild bulge in the disc cushion—this is extremely common in healthy adults and does not touch or irritate any nerves.

What this confirms:
Your previous back ache was related to posture and muscle strain, not structural nerve damage.`,
      detailed: `Spinal Neuro-Radiological Interpretation:
• Neuro-Vascular Safety: The thecal sac, conus medullaris, and traversing cauda equina roots demonstrate normal signal without displacement.
• Disc Degenerative Grading (Pfirrmann Grade 2): L4-L5 exhibits mild disc desiccation with a non-compressive broad-based annular bulge. No posterior ligament tear or annular fissure observed.
• Clinical Correlation: Lack of foraminal stenosis explains the complete absence of lower extremity radiating sciatica or dermatomal sensory deficits.`,
      clinical: `NEUROLOGICAL & ORTHOPEDIC RADIOLOGY SUMMARY:
Summary: Unremarkable 3T Lumbar MRI. Minimal non-compressive L4-L5 annular bulge. No spinal canal stenosis, neural foraminal impingement, or neurocompressive pathology. Conservative management with core strengthening and ergonomic adjustments is curative.`,
    },
    recommendations: [
      'Continue core stability exercises (planks, bird-dog, glute bridges) 3 times weekly.',
      'Adopt an ergonomic workstation with periodic standing intervals every 45 minutes.',
      'No surgical or interventional spine procedures warranted.',
    ],
    questionsForDoctor: [
      'What specific core exercises are most protective for my L4-L5 disc?',
      'Are there any lifting restrictions I should follow at the gym?',
    ],
    disclaimer: 'This MRI educational summary is generated to translate complex radiological phrasing and does not replace evaluation by a licensed neurologist or spine specialist.',
  },
];

