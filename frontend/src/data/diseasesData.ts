export interface DiseaseCondition {
  id: string;
  name: string;
  icd10: string;
  category: string;
  primaryOrganId: string;
  primarySystem: string;
  overview: string;
  pathophysiology: string;
  commonSymptoms: string[];
  riskFactors: string[];
  stages: {
    stage: string;
    description: string;
    anatomicalImpact: string;
  }[];
  establishedTreatments: {
    type: 'Pharmacotherapy' | 'Lifestyle' | 'Interventional' | 'Monitoring';
    title: string;
    details: string;
  }[];
  preventionInfo: string;
  questionsForDoctor: string[];
}

export const DISEASE_CATALOG: DiseaseCondition[] = [
  {
    id: 'hypertension',
    name: 'Primary Essential Hypertension',
    icd10: 'ICD-10 I10',
    category: 'Cardiovascular Disease',
    primaryOrganId: 'heart',
    primarySystem: 'Cardiovascular System',
    overview: 'A chronic medical condition where the arterial blood pressure in the systemic circulation is persistently elevated (systolic >= 130 mmHg or diastolic >= 80 mmHg). Known as a "silent condition" because it often causes no initial symptoms while progressively straining the heart and blood vessels.',
    pathophysiology: 'Increased systemic vascular resistance (SVR) driven by neurohormonal activation (sympathetic nervous system and renin-angiotensin-aldosterone axis). Over time, increased afterload forces the left ventricle to pump harder, leading to arterial endothelial stiffening and concentric myocardial remodeling.',
    commonSymptoms: [
      'Often asymptomatic ("silent disease")',
      'Occipital morning headaches (in moderate-severe elevations)',
      'Subtle shortness of breath during exertion',
      'Fatigue or reduced exercise tolerance',
      'Tension in neck or chest',
    ],
    riskFactors: [
      'High dietary sodium intake (> 2,300 mg/day)',
      'Sedentary lifestyle and lack of aerobic exercise',
      'Family history / genetic predisposition',
      'Chronic psychological or sympathetic stress',
      'Insulin resistance and metabolic syndrome',
    ],
    stages: [
      {
        stage: 'Stage 1 (Pre-Hypertensive)',
        description: 'Blood pressure 120-129 / < 80 mmHg. Arteriolar walls begin subtle vascular tone adaptation.',
        anatomicalImpact: 'Arteries maintain elastic recoil; no structural myocardial changes.',
      },
      {
        stage: 'Stage 2 (Established Hypertension)',
        description: 'Blood pressure 130-139 / 80-89 mmHg. Sustained endothelial shear stress.',
        anatomicalImpact: 'Endothelial micro-inflammation, subtle thickening of muscular arteriolar media.',
      },
      {
        stage: 'Stage 3 (Advanced / Uncontrolled)',
        description: 'Blood pressure >= 140 / >= 90 mmHg without medical management.',
        anatomicalImpact: 'Left ventricular hypertrophy (thickening of the heart wall), microvascular damage in renal glomeruli and retinal capillaries.',
      },
    ],
    establishedTreatments: [
      {
        type: 'Pharmacotherapy',
        title: 'ACE Inhibitors / ARBs (e.g. Lisinopril, Losartan)',
        details: 'Relaxes blood vessels by inhibiting angiotensin II production, protecting both the heart muscle and kidney glomeruli.',
      },
      {
        type: 'Lifestyle',
        title: 'DASH Dietary Framework',
        details: 'Rich in dietary potassium, magnesium, and calcium from leafy greens, berries, and legumes, while moderating processed sodium.',
      },
      {
        type: 'Lifestyle',
        title: 'Structured Aerobic Conditioning',
        details: '150 minutes weekly of moderate-intensity endurance activity reduces resting systolic BP by 5-8 mmHg through enhanced nitric oxide release.',
      },
      {
        type: 'Monitoring',
        title: '24-Hour Ambulatory Blood Pressure Telemetry',
        details: 'Verifies normal nocturnal dipping and eliminates "white-coat" clinic stress elevations.',
      },
    ],
    preventionInfo: 'Target resting blood pressure below 120/80 mmHg. Maintain balanced electrolyte intake (potassium-to-sodium ratio > 2:1), engage in regular daily movement, and avoid excessive alcohol or tobacco.',
    questionsForDoctor: [
      'What is my individualized target blood pressure based on my cardiovascular risk tier?',
      'Does my current medication timing (morning vs evening) match my circadian blood pressure rhythm?',
      'How frequently should I check my blood pressure at home, and what device is certified for accuracy?',
    ],
  },
  {
    id: 'coronary-atherosclerosis',
    name: 'Coronary Artery Atherosclerosis',
    icd10: 'ICD-10 I25.10',
    category: 'Cardiovascular Disease',
    primaryOrganId: 'heart',
    primarySystem: 'Cardiovascular System',
    overview: 'The progressive accumulation of lipid-rich fibrofatty plaques within the intimal lining of the coronary arteries that supply oxygenated blood to the heart muscle.',
    pathophysiology: 'Apolipoprotein B-containing lipoproteins (LDL, VLDL) penetrate vulnerable arterial endothelium, undergo oxidation, and trigger macrophage foam cell recruitment. Calcification and fibrous cap formation follow. Plaque rupture or erosion can provoke acute intraluminal thrombosis.',
    commonSymptoms: [
      'Exertional angina pectoris (substernal chest tightness radiating to jaw or left arm)',
      'Unexplained shortness of breath on exertion',
      'Cold diaphoresis during physical stress',
      'Can remain subclinical and asymptomatic for decades until screened by Agatston CAC scan',
    ],
    riskFactors: [
      'Elevated circulating ApoB / LDL-C particles (> 100 mg/dL)',
      'High systemic inflammation (hs-CRP > 2.0 mg/L)',
      'Tobacco smoke exposure (induces endothelial dysfunction)',
      'Diabetes mellitus and glycemic variability',
      'Elevated Lipoprotein(a) [genetic risk factor]',
    ],
    stages: [
      {
        stage: 'Subclinical Fatty Streak',
        description: 'Microscopic lipid pools beneath the arterial endothelium.',
        anatomicalImpact: 'Arterial lumen diameter unaffected; zero coronary calcification (Agatston = 0).',
      },
      {
        stage: 'Stable Fibrous Plaque',
        description: 'Smooth muscle cells migrate to form a protective collagenous fibrous cap.',
        anatomicalImpact: 'Partial luminal narrowing (< 50%); micro-calcification detectable on coronary CT.',
      },
      {
        stage: 'Obstructive Stenosis',
        description: 'Plaque occupies > 70% of coronary vessel cross-sectional area.',
        anatomicalImpact: 'Restricted myocardial blood flow during peak oxygen demand; exertional ischemia.',
      },
    ],
    establishedTreatments: [
      {
        type: 'Pharmacotherapy',
        title: 'HMG-CoA Reductase Inhibitors (Statins) & Ezetimibe',
        details: 'Lowers circulating LDL particle concentration, depletes plaque lipid cores, and stabilizes the fibrous cap against rupture.',
      },
      {
        type: 'Pharmacotherapy',
        title: 'Antiplatelet Therapy (Low-Dose Aspirin 81mg)',
        details: 'Irreversibly inhibits cyclooxygenase-1 in platelets to prevent occlusive thrombus formation on vulnerable plaque surfaces.',
      },
      {
        type: 'Interventional',
        title: 'Percutaneous Coronary Intervention (Drug-Eluting Stents)',
        details: 'Mechanical lumen restoration for flow-limiting obstructive lesions with contemporary antiproliferative polymer stents.',
      },
    ],
    preventionInfo: 'Maintain optimal ApoB < 60 mg/dL or LDL-C < 70 mg/dL in at-risk individuals. Mediterranean diet with high extra virgin olive oil, nuts, and omega-3 EPA/DHA fatty acids.',
    questionsForDoctor: [
      'What was my Agatston Calcium score on my latest CT scan?',
      'Should we check my Lipoprotein(a) and hs-CRP to refine my cardiovascular risk score?',
      'Is my current LDL-C reduction adequate to promote plaque regression?',
    ],
  },
  {
    id: 'type-2-diabetes',
    name: 'Type 2 Diabetes Mellitus',
    icd10: 'ICD-10 E11.9',
    category: 'Endocrine & Metabolic Disease',
    primaryOrganId: 'pancreas',
    primarySystem: 'Endocrine System',
    overview: 'A metabolic disorder characterized by peripheral insulin resistance paired with progressive pancreatic beta-cell secretory exhaustion, leading to chronic hyperglycemia.',
    pathophysiology: 'Skeletal muscle, adipose tissue, and hepatic cells fail to respond effectively to physiological insulin signaling. Pancreatic islets initially compensate by hypersecreting insulin. Over years, islet amyloid polypeptide deposition and glucotoxicity deplete beta-cell functional reserve.',
    commonSymptoms: [
      'Polydipsia (excessive thirst) and polyuria (frequent urination)',
      'Postprandial lethargy or energy crashes',
      'Blurred vision due to lens osmotic fluid shifts',
      'Slow-healing peripheral wounds or skin infections',
      'Distal symmetrical numbness or tingling (early diabetic peripheral neuropathy)',
    ],
    riskFactors: [
      'Visceral adiposity and elevated waist-to-hip ratio',
      'Elevated fasting insulin or HOMA-IR index',
      'Physical inactivity and loss of skeletal muscle mass',
      'Gestational diabetes history',
      'First-degree relative with Type 2 Diabetes',
    ],
    stages: [
      {
        stage: 'Insulin Resistance / Pre-Diabetes',
        description: 'HbA1c 5.7 - 6.4%. Pancreas produces high insulin to maintain normal glucose.',
        anatomicalImpact: 'Hyperinsulinemia drives hepatic de novo lipogenesis; liver steatosis emerges.',
      },
      {
        stage: 'Established Diabetes',
        description: 'HbA1c >= 6.5%, fasting glucose >= 126 mg/dL. Beta-cell capacity compromised.',
        anatomicalImpact: 'Systemic microvascular capillary basement membrane thickening.',
      },
      {
        stage: 'Chronic Micro/Macrovascular Complications',
        description: 'Unmanaged prolonged glycemic variability over 10+ years.',
        anatomicalImpact: 'Glomerular nodular glomerulosclerosis, retinal neovascularization, accelerated atherosclerosis.',
      },
    ],
    establishedTreatments: [
      {
        type: 'Pharmacotherapy',
        title: 'GLP-1 Receptor Agonists / SGLT-2 Inhibitors',
        details: 'Modern cardioprotective agents that improve insulin sensitivity, promote modest visceral weight reduction, and lower cardiovascular/renal event rates.',
      },
      {
        type: 'Lifestyle',
        title: 'Resistance Training & Skeletal Muscle Glucose Disposal',
        details: 'Progressive strength training stimulates non-insulin dependent GLUT4 transporter translocation directly into active muscle fibers.',
      },
      {
        type: 'Monitoring',
        title: 'Continuous Glucose Monitoring (CGM)',
        details: 'Real-time interstitial glucose telemetry enables precise dietary cause-and-effect learning without frequent fingersticks.',
      },
    ],
    preventionInfo: 'Prioritize whole-food protein and dietary fiber before carbohydrates to blunt postprandial glucose spikes. Maintain regular 15-minute walks after major meals.',
    questionsForDoctor: [
      'What is my personal HbA1c target for the next 6 months?',
      'Would wearing a continuous glucose monitor (CGM) for two weeks provide useful lifestyle insights for me?',
      'Are my kidneys and retinas being screened annually as recommended?',
    ],
  },
  {
    id: 'nafld-mash',
    name: 'Metabolic Dysfunction-Associated Steatotic Liver Disease (MASLD / NAFLD)',
    icd10: 'ICD-10 K76.0',
    category: 'Hepatic & Digestive Disease',
    primaryOrganId: 'liver',
    primarySystem: 'Digestive & Metabolic System',
    overview: 'The abnormal accumulation of neutral lipid droplets (triglycerides) within hepatocytes exceeding 5% of liver weight, occurring in the absence of significant alcohol consumption.',
    pathophysiology: 'Driven by systemic insulin resistance and hepatic de novo lipogenesis. Free fatty acid influx overwhelms mitochondrial beta-oxidation capacity. Lipid peroxidation induces reactive oxygen species (ROS), activating Kupffer cells and hepatic stellate cells to deposit collagenous scar tissue.',
    commonSymptoms: [
      'Usually silent with no early symptoms',
      'Mild right upper quadrant abdominal fullness or discomfort',
      'Unexplained chronic fatigue',
      'Often identified incidentally via routine ALT transaminase elevation or ultrasound',
    ],
    riskFactors: [
      'Elevated dietary high-fructose corn syrup and processed carbohydrates',
      'Visceral obesity and abdominal adiposity',
      'Hypertriglyceridemia and low HDL-C',
      'Hypertension and metabolic syndrome',
      'PNPLA3 gene variant polymorphisms',
    ],
    stages: [
      {
        stage: 'Simple Steatosis (NAFL)',
        description: 'Benign fat accumulation within hepatocytes without active inflammatory necrosis.',
        anatomicalImpact: 'Liver appears enlarged and hyperechoic ("bright liver") on diagnostic ultrasound.',
      },
      {
        stage: 'Steatohepatitis (MASH)',
        description: 'Intrahepatic lipid toxicity triggers ballooning degeneration and leukocyte infiltration.',
        anatomicalImpact: 'Serum ALT and AST rise; hepatic parenchymal architecture becomes inflamed.',
      },
      {
        stage: 'Hepatic Fibrosis & Cirrhosis',
        description: 'Chronic stellate cell activation produces permanent extracellular collagen bridges.',
        anatomicalImpact: 'Fibrous septa disrupt portal venous architecture; risk of portal hypertension.',
      },
    ],
    establishedTreatments: [
      {
        type: 'Lifestyle',
        title: 'Mediterranean Dietary Intervention & Fructose Elimination',
        details: 'Replacing refined sugars and saturated fats with monounsaturated fatty acids and dietary antioxidants reverses hepatic triglyceride accumulation.',
      },
      {
        type: 'Lifestyle',
        title: '7-10% Body Weight Optimization',
        details: 'Clinical trials demonstrate that a 7-10% reduction in body weight resolves steatohepatitis in over 80% of individuals.',
      },
      {
        type: 'Monitoring',
        title: 'Transient Elastography (FibroScan / VCTE)',
        details: 'Non-invasive shear-wave acoustic velocity measurement quantifying hepatic stiffness (kPa) and controlled attenuation parameter (CAP dB/m).',
      },
    ],
    preventionInfo: 'Eliminate sugar-sweetened beverages and concentrated fruit juices. Enjoy 2-3 cups of black coffee daily, which contains polyphenols clinically shown to protect hepatic stellate cells.',
    questionsForDoctor: [
      'Does my mildly elevated ALT (38 U/L) correlate with early liver fat accumulation?',
      'Should we calculate my FIB-4 score or perform a quick non-invasive FibroScan?',
      'What nutritional adjustments would be most effective for my liver health?',
    ],
  },
];

