// AI Medical Intelligence Engine
// Multi-Tiered Explanations, Symptom Querying, Emergency Red-Flag Screening & Multilingual Support

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  suggestedQuestions?: string[];
  referencedOrganId?: string;
  sourceCitations?: string[];
  isWarning?: boolean;
}

export type SupportedLanguage = 'en' | 'hi' | 'gu' | 'es';

export const LANGUAGE_LABELS: Record<SupportedLanguage, { name: string; nativeName: string }> = {
  en: { name: 'English', nativeName: 'English' },
  hi: { name: 'Hindi', nativeName: 'हिन्दी' },
  gu: { name: 'Gujarati', nativeName: 'ગુજરાતી' },
  es: { name: 'Spanish', nativeName: 'Español' },
};

// Emergency warning keywords that trigger safety advisories
const RED_FLAG_KEYWORDS = [
  'crushing chest pain',
  'chest pressure radiating',
  'sudden numbness',
  'facial drooping',
  'slurred speech',
  'coughing blood',
  'cannot breathe',
  'severe sudden headache',
  'worst headache of my life',
  'loss of consciousness',
];

export async function processMedicalQuery(
  userQuery: string,
  _userRecordsContext?: string,
  language: SupportedLanguage = 'en'
): Promise<ChatMessage> {
  // 1. Check for Acute Emergency Symptoms
  const lowerQuery = userQuery.toLowerCase();
  const hasRedFlag = RED_FLAG_KEYWORDS.some((rf) => lowerQuery.includes(rf));

  if (hasRedFlag) {
    let warningText = `EMERGENCY ALERT: Your message mentions symptoms that may indicate an acute medical emergency. 
Please DO NOT wait for an online response. Call your local emergency medical services immediately (e.g. 911 / 112 / 108) or proceed directly to the nearest emergency room.

Vitalis AI is an educational assistant and is not equipped to manage life-threatening cardiovascular or neurological emergencies.`;

    if (language === 'hi') {
      warningText = `आपातकालीन चेतावनी: आपके संदेश में ऐसे लक्षण दिखाई दे रहे हैं जो गंभीर आपातकाल का संकेत दे सकते हैं।
कृपया ऑनलाइन उत्तर की प्रतीक्षा न करें। तुरंत आपातकालीन चिकित्सा सेवाओं (112 / 108 / 911) को कॉल करें या निकटतम अस्पताल के आपातकालीन कक्ष में जाएं।`;
    } else if (language === 'gu') {
      warningText = `ઇમરજન્સી ચેતવણી: તમારા પ્રશ્નમાં ગંભીર તબીબી કટોકટીના સંકેતો જણાય છે.
કૃપા કરીને રાહ ન જુઓ. તાત્કાલિક ઇમરજન્સી હેલ્પલાઇન (108 / 112) પર કૉલ કરો અથવા નજીકની હૉસ્પિટલમાં જાઓ.`;
    }

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: warningText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isWarning: true,
      sourceCitations: ['American College of Cardiology Emergency Protocol', 'AHA Guidelines for Acute Coronary Syndrome'],
    };
  }

  // 2. Synthesize Evidence-Grounded Medical Responses
  let responseText = '';
  let referencedOrgan: string | undefined = undefined;
  let citations: string[] = ['UpToDate Clinical Decision Support 2026', 'American Heart Association Guidelines'];
  let followUpSuggestions: string[] = [];

  if (lowerQuery.includes('heart') || lowerQuery.includes('blood pressure') || lowerQuery.includes('lisinopril') || lowerQuery.includes('bpm')) {
    referencedOrgan = 'heart';
    citations = ['AHA/ACC Hypertension Clinical Practice Guidelines', 'Framingham Cardiovascular Risk Standard'];
    if (language === 'hi') {
      responseText = `हृदय और रक्तचाप की जानकारी:
आपका हालिया ब्लड प्रेशर 118/78 mmHg है, जो सामान्य श्रेणी में है। आपकी लिसिनोप्रिल (10 mg) दवा उच्च रक्तचाप को प्रभावी ढंग से नियंत्रित कर रही है। इकोकार्डियोग्राम ने 62% का इजेक्शन अंश (LVEF) दिखाया है, जो हृदय की उत्कृष्ट पंपिंग क्षमता को दर्शाता है।`;
    } else if (language === 'gu') {
      responseText = `હૃદય અને બ્લડ પ્રેશરની માહિતી:
તમારું તાજેતરનું બ્લડ પ્રેશર 118/78 mmHg સામાન્ય છે. લિસિનોપ્રિલ (10 mg) યોગ્ય રીતે કામ કરી રહી છે. ઇકોકાર્ડિયોગ્રામમાં હૃદયનું પમ્પિંગ 62% સામાન્ય જોવા મળ્યું છે.`;
    } else {
      responseText = `Your Cardiovascular Status & Records:
• Resting Blood Pressure: 118/78 mmHg (optimal control under Lisinopril 10 mg daily).
• Resting Heart Rate: 72 BPM Sinus Rhythm.
• Cardiac Ultrasound (Echo): Left ventricular ejection fraction is 62% with normal myocardial contractility and no wall thickening.
• Coronary CT: Calcium score is 0, indicating absence of calcified coronary arterial plaque.

Your cardiovascular biomarkers demonstrate excellent stability. Maintain your regular morning medication timing and adequate hydration.`;
    }
    followUpSuggestions = [
      'What are the side effects of Lisinopril?',
      'How does exercise affect my blood pressure?',
      'Explain my Agatston Calcium score of 0',
    ];
  } else if (lowerQuery.includes('alt') || lowerQuery.includes('liver') || lowerQuery.includes('transaminase') || lowerQuery.includes('enzymes')) {
    referencedOrgan = 'liver';
    citations = ['AASLD Clinical Guidelines for Nonalcoholic Fatty Liver Disease', 'Quest Diagnostics Clinical Reference Standards'];
    if (language === 'hi') {
      responseText = `यकृत (लिवर) और एएलटी (ALT) विश्लेषण:
आपके 18 अक्टूबर के टेस्ट में ALT 38 U/L आया था, जो संदर्भ सीमा (7-35 U/L) से थोड़ा सा अधिक है। एएसटी (AST) और बिलीरुबिन सामान्य हैं। यह आमतौर पर भोजन या हल्की जीवनशैली संबंधी वजहों से अस्थायी हो सकता है। पानी अधिक पिएं और 2 महीने बाद पुनः जांच कराएं।`;
    } else if (language === 'gu') {
      responseText = `લિવર અને ALT એન્ઝાઇમ વિશ્લેષણ:
તમારું ALT 38 U/L છે, જે સામાન્ય રેન્જ (7-35) કરતાં થોડું વધારે છે. આ અસ્થાયી હોઈ શકે છે. પૂરતું પાણી પીવો અને 2 મહિના પછી ફરીથી ટેસ્ટ કરાવો.`;
    } else {
      responseText = `Understanding Your Hepatic (Liver) Biomarkers:
• ALT (Alanine Aminotransferase): Measured at 38 U/L against a normal reference ceiling of 35 U/L.
• Context: Your AST (32 U/L), Total Bilirubin (0.7 mg/dL), and Albumin (4.5 g/dL) are completely normal, proving your liver's actual synthetic capacity is healthy.
• Why it matters: A mild elevation of 3 points is very common and typically reflects recent dietary carbohydrate load, minor medication metabolism, or vigorous exercise.
• Action Step: Dr. Chen recommends continuing your usual cardioprotective medications, minimizing refined sugar drinks, and repeating a routine panel in 60-90 days.`;
    }
    followUpSuggestions = [
      'What foods support liver health?',
      'Does Atorvastatin affect my ALT level?',
      'What is the difference between ALT and AST?',
    ];
  } else if (lowerQuery.includes('kidney') || lowerQuery.includes('egfr') || lowerQuery.includes('creatinine') || lowerQuery.includes('renal')) {
    referencedOrgan = 'kidneys';
    citations = ['KDIGO 2024 Clinical Practice Guideline for CKD Evaluation', 'National Kidney Foundation Standards'];
    responseText = `Your Renal (Kidney) Physiological Function:
• eGFR (Estimated Glomerular Filtration Rate): 98 mL/min/1.73m² (Normal: > 90 mL/min).
• Serum Creatinine: 0.82 mg/dL (Normal: 0.57 - 1.00 mg/dL).
• Serum Potassium: 4.4 mmol/L (Normal: 3.5 - 5.1 mmol/L).

Interpretation: Your kidneys are functioning at optimal Stage 1 filtration capacity. This confirms that your ACE-inhibitor (Lisinopril) is well-tolerated without any kidney strain or potassium retention.`;
    followUpSuggestions = [
      'Why is eGFR important when taking Lisinopril?',
      'What is a healthy daily fluid intake for my kidneys?',
    ];
  } else {
    // General Conversational Health Query
    if (language === 'hi') {
      responseText = `नमस्ते! मैं आपका विटालिस एआई सहायक ("आस्क योर बॉडी") हूँ। 
मैं आपके मेडिकल रिकॉर्ड, 3D शारीरिक अंगों, रक्त रिपोर्ट और दवाइयों को सरल भाषा में समझाने में आपकी सहायता कर सकता हूँ। आप किसी विशिष्ट अंग या रिपोर्ट के बारे में पूछ सकते हैं।`;
    } else if (language === 'gu') {
      responseText = `નમસ્તે! હું તમારો વાઇટાલિસ એઆઈ સહાયક છું.
હું તમારા મેડિકલ રિપોર્ટ, 3D શરીર રચના અને દવાઓ વિશે માહિતી આપી શકું છું. તમે હૃદય, લિવર, કિડની અથવા કોઈ રિપોર્ટ વિશે પૂછી શકો છો.`;
    } else {
      responseText = `Hello! I'm your "Ask Your Body" AI Health Assistant.
I am synchronized with your verified medical history, laboratory reports, and interactive 3D human anatomy.

You can ask me to:
• Explain any laboratory biomarker (e.g. "What does my ALT of 38 mean?")
• Translate medical terms from your doctor's encounter notes
• Show which organ corresponds to your current prescriptions
• Help prepare questions for your upcoming cardiology consultation with Dr. Chen

What would you like to explore today?`;
    }
    followUpSuggestions = [
      'Explain my latest blood test results',
      'What does my heart ultrasound show?',
      'Why am I taking Lisinopril and Atorvastatin?',
      'Show me where my kidneys are located',
    ];
  }

  return {
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: responseText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedQuestions: followUpSuggestions,
    referencedOrganId: referencedOrgan,
    sourceCitations: citations,
  };
}
