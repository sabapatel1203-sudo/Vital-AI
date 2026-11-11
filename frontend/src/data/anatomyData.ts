export interface AnatomicalStructureData {
  id: string;
  name: string;
  system: string;
  systemId: string;
  latinName: string;
  location: string;
  function: string;
  clinicalSignificance: string;
  commonConditions: string[];
  cameraPosition: { x: number; y: number; z: number };
  targetPosition: { x: number; y: number; z: number };
  meshName?: string;
}

export interface BodySystemInfo {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  structureCount: number;
}

export const BODY_SYSTEMS: BodySystemInfo[] = [
  { id: 'cardiovascular', name: 'Cardiovascular', icon: 'Heart', description: 'Heart, aorta, arterial trees and venous circulation', color: '#C52848', structureCount: 12 },
  { id: 'respiratory', name: 'Respiratory', icon: 'Wind', description: 'Trachea, bronchi, bilateral lung lobes and diaphragm', color: '#E8AFBA', structureCount: 8 },
  { id: 'nervous', name: 'Nervous', icon: 'Brain', description: 'Cerebrum, cerebellum, spinal cord and peripheral nerves', color: '#D7839C', structureCount: 14 },
  { id: 'digestive', name: 'Digestive', icon: 'Activity', description: 'Esophagus, stomach, intestines, liver, gallbladder and pancreas', color: '#8F2038', structureCount: 10 },
  { id: 'renal', name: 'Urinary & Renal', icon: 'ShieldCheck', description: 'Kidneys, renal cortex, ureters, bladder and urethra', color: '#BFAAB0', structureCount: 6 },
  { id: 'skeletal', name: 'Skeletal', icon: 'Bone', description: 'Skull, vertebral column, ribcage, pelvis and appendicular bones', color: '#FFF7F7', structureCount: 28 },
  { id: 'muscular', name: 'Muscular', icon: 'Layers', description: 'Superficial and deep skeletal muscle groups', color: '#A82845', structureCount: 467 },
  { id: 'endocrine', name: 'Endocrine', icon: 'Sparkles', description: 'Pituitary gland, thyroid, adrenal glands and endocrine pancreas', color: '#E6A34A', structureCount: 6 },
  { id: 'lymphatic', name: 'Lymphatic & Immune', icon: 'Shield', description: 'Spleen, thymus, lymph nodes and lymphatic channels', color: '#4EAA83', structureCount: 7 },
  { id: 'sensory', name: 'Sensory Organs', icon: 'Eye', description: 'Eyes, inner auditory pathways and olfactory apparatus', color: '#D7839C', structureCount: 4 },
];

export const ANATOMICAL_STRUCTURES: Record<string, AnatomicalStructureData> = {
  heart: {
    id: 'heart',
    name: 'Heart & Great Vessels',
    system: 'Cardiovascular System',
    systemId: 'cardiovascular',
    latinName: 'Cor',
    location: 'Middle mediastinum of the thoracic cavity, posterior to the sternum, tilted slightly to the left.',
    function: 'Muscular organ with four chambers (right/left atria and ventricles) that pumps deoxygenated blood to the lungs and oxygenated arterial blood to the systemic circulation.',
    clinicalSignificance: 'Subject to ischemic coronary disease, hypertensive remodeling, valvular dysfunction, and electrophysiological conduction arrhythmias.',
    commonConditions: ['Primary Essential Hypertension', 'Coronary Artery Atherosclerosis', 'Heart Failure (HFrEF/HFpEF)', 'Atrial Fibrillation', 'Aortic Valve Stenosis'],
    cameraPosition: { x: -0.1, y: 0.45, z: 1.8 },
    targetPosition: { x: -0.08, y: 0.45, z: 0.15 },
  },
  lungs: {
    id: 'lungs',
    name: 'Bilateral Pulmonary Lobes',
    system: 'Respiratory System',
    systemId: 'respiratory',
    latinName: 'Pulmones',
    location: 'Thoracic cavity on either side of the heart, bounded by the ribcage and diaphragm.',
    function: 'Primary organs of gas exchange. Alveolar capillary beds absorb atmospheric oxygen into hemoglobin while exhaling metabolic carbon dioxide waste.',
    clinicalSignificance: 'Evaluated by spirometry (FEV1/FVC), pulse oximetry (SpO2), chest radiography and high-resolution computed tomography.',
    commonConditions: ['Asthma (Airway Hyperreactivity)', 'Chronic Obstructive Pulmonary Disease (COPD)', 'Pneumonia', 'Pulmonary Embolism', 'Idiopathic Pulmonary Fibrosis'],
    cameraPosition: { x: 0, y: 0.45, z: 2.2 },
    targetPosition: { x: 0, y: 0.45, z: 0.08 },
  },
  brain: {
    id: 'brain',
    name: 'Cerebrum & Central Nervous System',
    system: 'Nervous System',
    systemId: 'nervous',
    latinName: 'Encephalon',
    location: 'Within the neurocranium, protected by cerebrospinal fluid, meninges, and the blood-brain barrier.',
    function: 'Coordinates sensory perception, voluntary motor movement, autonomic homeostasis, memory encoding, higher executive cognition, and emotional processing.',
    clinicalSignificance: 'Susceptible to cerebrovascular stroke (ischemic/hemorrhagic), neurodegenerative tauopathies, tension/migraine cephalalgia, and focal seizures.',
    commonConditions: ['Tension-Type Cephalalgia', 'Migraine with Aura', 'Ischemic Stroke / TIA', 'Mild Cognitive Impairment', 'Multiple Sclerosis'],
    cameraPosition: { x: 0, y: 1.55, z: 1.7 },
    targetPosition: { x: 0, y: 1.55, z: 0.05 },
  },
  liver: {
    id: 'liver',
    name: 'Hepatic Parenchyma (Liver)',
    system: 'Digestive & Metabolic System',
    systemId: 'digestive',
    latinName: 'Hepar',
    location: 'Right upper quadrant of the abdominal cavity beneath the diaphragm, protected by lower ribs.',
    function: 'Largest metabolic organ. Synthesizes albumin and clotting factors, metabolizes xenobiotics/drugs via CYP450 enzymes, produces bile for lipid absorption, and stores glycogen.',
    clinicalSignificance: 'Monitored via hepatic transaminases (ALT/AST), alkaline phosphatase, total bilirubin, and abdominal ultrasound.',
    commonConditions: ['Metabolic Dysfunction-Associated Steatohepatitis (MASH / NAFLD)', 'Hepatic Steatosis', 'Drug-Induced Liver Injury', 'Cirrhosis', 'Viral Hepatitis'],
    cameraPosition: { x: 0.25, y: -0.05, z: 1.8 },
    targetPosition: { x: 0.2, y: -0.04, z: 0.14 },
  },
  kidneys: {
    id: 'kidneys',
    name: 'Renal Glomerular System (Bilateral Kidneys)',
    system: 'Urinary & Renal System',
    systemId: 'renal',
    latinName: 'Renes',
    location: 'Retroperitoneal space on either side of the vertebral column at levels T12 to L3.',
    function: 'Filters circulating blood plasma through glomeruli, regulates arterial blood pressure via the renin-angiotensin-aldosterone system (RAAS), balances electrolytes, and excretes urea.',
    clinicalSignificance: 'Gauged through serum creatinine, blood urea nitrogen (BUN), estimated glomerular filtration rate (eGFR), and urinary albumin-to-creatinine ratio (uACR).',
    commonConditions: ['Chronic Kidney Disease (Stages 1-5)', 'Diabetic Nephropathy', 'Hypertensive Nephrosclerosis', 'Nephrolithiasis (Kidney Stones)', 'Glomerulonephritis'],
    cameraPosition: { x: 0, y: -0.35, z: 1.9 },
    targetPosition: { x: 0, y: -0.34, z: -0.1 },
  },
  skeletal: {
    id: 'skeletal',
    name: 'Spinal Column & Osteo-Articular Frame',
    system: 'Skeletal System',
    systemId: 'skeletal',
    latinName: 'Systema skeletale',
    location: 'Central axial core including 33 vertebrae (7 cervical, 12 thoracic, 5 lumbar, sacrum, coccyx), ribs, and appendicular framework.',
    function: 'Provides mechanical structural integrity, anchors skeletal musculature, shields vital visceral organs, and generates erythrocytes via trabecular bone marrow.',
    clinicalSignificance: 'Evaluated through dual-energy X-ray absorptiometry (DEXA T-score), MRI for disc herniations, and spinal radiography.',
    commonConditions: ['Lumbar Disc Herniation (L4-L5/S1)', 'Osteopenia / Osteoporosis', 'Cervical Spondylosis', 'Scoliosis', 'Postural Myofascial Strain'],
    cameraPosition: { x: 0, y: 0.3, z: 2.8 },
    targetPosition: { x: 0, y: 0.35, z: -0.18 },
  },
  stomach: {
    id: 'stomach',
    name: 'Gastric Chamber (Stomach)',
    system: 'Digestive & Metabolic System',
    systemId: 'digestive',
    latinName: 'Gaster',
    location: 'Left upper quadrant of the abdominal cavity between the esophagus and the duodenum.',
    function: 'Secretes gastric hydrochloric acid (pH 1.5-2.0) and pepsinogen to enzymatically digest dietary proteins into chyme while churning food boluses.',
    clinicalSignificance: 'Assessed by esophagogastroduodenoscopy (EGD), Helicobacter pylori antigen testing, and barium swallow.',
    commonConditions: ['Gastroesophageal Reflux Disease (GERD)', 'Gastric Peptic Ulcers', 'Helicobacter Pylori Gastritis', 'Gastroparesis'],
    cameraPosition: { x: -0.15, y: -0.05, z: 1.8 },
    targetPosition: { x: -0.1, y: -0.05, z: 0.12 },
  },
  pancreas: {
    id: 'pancreas',
    name: 'Endocrine & Exocrine Pancreas',
    system: 'Endocrine & Digestive Systems',
    systemId: 'endocrine',
    latinName: 'Pancreas',
    location: 'Deep retroperitoneal abdomen, nestled in the C-loop curve of the duodenum behind the stomach.',
    function: 'Dual organ: Islets of Langerhans (beta cells) secrete insulin and glucagon for glycemic balance; acinar tissue produces lipase, amylase, and protease digestive enzymes.',
    clinicalSignificance: 'Monitored via Glycated Hemoglobin (HbA1c), fasting insulin, C-peptide, serum amylase, and pancreatic lipase.',
    commonConditions: ['Type 2 Diabetes Mellitus', 'Insulin Resistance', 'Acute / Chronic Pancreatitis', 'Exocrine Pancreatic Insufficiency'],
    cameraPosition: { x: 0.05, y: -0.12, z: 1.7 },
    targetPosition: { x: 0.02, y: -0.12, z: 0.05 },
  },
  thyroid: {
    id: 'thyroid',
    name: 'Thyroid Gland',
    system: 'Endocrine System',
    systemId: 'endocrine',
    latinName: 'Glandula thyroidea',
    location: 'Anterior neck below the thyroid cartilage (Adam\'s apple), wrapping the trachea in a butterfly shape.',
    function: 'Produces triiodothyronine (T3) and thyroxine (T4) hormones which regulate basal metabolic rate, cardiac chronotropy, temperature regulation, and protein synthesis.',
    clinicalSignificance: 'Evaluated by Thyroid Stimulating Hormone (TSH), Free T4, Anti-TPO antibodies, and thyroid ultrasound.',
    commonConditions: ['Subclinical Hypothyroidism', 'Hashimoto\'s Autoimmune Thyroiditis', 'Thyroid Nodules', 'Hyperthyroidism / Graves Disease'],
    cameraPosition: { x: 0, y: 1.1, z: 1.5 },
    targetPosition: { x: 0, y: 1.05, z: 0.1 },
  },
  spleen: {
    id: 'spleen',
    name: 'Spleen (Secondary Lymphoid Organ)',
    system: 'Lymphatic & Immune System',
    systemId: 'lymphatic',
    latinName: 'Splen',
    location: 'Left hypochondrium beneath the diaphragm, adjacent to the 9th, 10th, and 11th ribs.',
    function: 'Filters circulating erythrocytes, recycles iron from aged red blood cells, reserves platelets, and mounts humoral immune responses against encapsulated bacteria.',
    clinicalSignificance: 'Examined through complete blood count (CBC) with peripheral smear, abdominal ultrasound, and contrast CT.',
    commonConditions: ['Splenomegaly (Congestive/Infectious)', 'Immune Thrombocytopenia (ITP)', 'Splenic Infarct', 'Traumatic Laceration'],
    cameraPosition: { x: -0.3, y: 0.02, z: 1.8 },
    targetPosition: { x: -0.28, y: 0.02, z: 0.05 },
  },
};

