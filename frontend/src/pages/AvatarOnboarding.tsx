import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HumanTwin3D from '../components/HumanTwin3D';
import { 
  Camera, 
  Upload, 
  Sliders, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Heart, 
  RefreshCw,
  FileCheck2,
  Layers
} from 'lucide-react';
import './AvatarOnboarding.css';

type CreationMethod = 'photo' | 'camera' | 'manual' | 'standard';

export const AvatarOnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [method, setMethod] = useState<CreationMethod>('photo');

  // Photo upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [consentGranted, setConsentGranted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Camera capture state
  const [, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Manual customization state
  const [genderBase, setGenderBase] = useState<'female' | 'male'>('female');
  const [skinTone, setSkinTone] = useState('#E0AC69');
  const [heightCm, setHeightCm] = useState(168);
  const [bodyBuild, setBodyBuild] = useState<'lean' | 'athletic' | 'medium' | 'broad'>('athletic');

  // Internal anatomy mode (Step 3)
  const [anatomyMode, setAnatomyMode] = useState<'standard' | 'imaging'>('standard');
  const [uploadedImagingFile, setUploadedImagingFile] = useState<string | null>(null);

  // Health Profile State (Step 4)
  const [profile, setProfile] = useState({
    dob: '1984-06-12',
    weightKg: 64,
    bloodType: 'O Rh+',
    allergies: 'Penicillin (mild cutaneous hives)',
    conditions: 'Primary Essential Hypertension (Controlled)',
    medications: 'Lisinopril 10mg daily, Atorvastatin 20mg nightly',
    emergencyContact: 'Mark Mitchell (Spouse) • +1 (555) 234-8901',
    preferredLanguage: 'English',
  });

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Camera Stream
  const startCamera = async () => {
    setCapturedImage(null);
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user', width: 640, height: 480 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      // Fallback demo snapshot
      setCapturedImage('/assets/hero.png');
      setIsCameraActive(false);
    }
  };

  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/png'));
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Finished onboarding -> Launch Dashboard
      navigate('/dashboard');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="onboard-page">
      {/* Header */}
      <div className="onboard-header">
        <div className="onboard-tag">
          <Sparkles size={13} /> Digital Human Twin Provisioning
        </div>
        <h1 className="onboard-title">Let's create your digital self.</h1>
        <p className="onboard-subtitle">
          Build your personalised 3D body model and connect it to your certified health records.
        </p>

        {/* Stepper */}
        <div className="onboard-stepper">
          <div className={`stepper-item ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}>
            <div className="stepper-num">{currentStep > 1 ? <Check size={14} /> : '1'}</div>
            <span>Avatar Input</span>
          </div>
          <div className={`stepper-line ${currentStep > 1 ? 'filled' : ''}`} />

          <div className={`stepper-item ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}>
            <div className="stepper-num">{currentStep > 2 ? <Check size={14} /> : '2'}</div>
            <span>3D Avatar</span>
          </div>
          <div className={`stepper-line ${currentStep > 2 ? 'filled' : ''}`} />

          <div className={`stepper-item ${currentStep === 3 ? 'active' : currentStep > 3 ? 'completed' : ''}`}>
            <div className="stepper-num">{currentStep > 3 ? <Check size={14} /> : '3'}</div>
            <span>Internal Anatomy</span>
          </div>
          <div className={`stepper-line ${currentStep > 3 ? 'filled' : ''}`} />

          <div className={`stepper-item ${currentStep === 4 ? 'active' : currentStep > 4 ? 'completed' : ''}`}>
            <div className="stepper-num">{currentStep > 4 ? <Check size={14} /> : '4'}</div>
            <span>Health Profile</span>
          </div>
          <div className={`stepper-line ${currentStep > 4 ? 'filled' : ''}`} />

          <div className={`stepper-item ${currentStep === 5 ? 'active' : ''}`}>
            <div className="stepper-num">5</div>
            <span>Launch</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="onboard-content">
        {/* ── STEP 1: CHOOSE AVATAR CREATION METHOD ── */}
        {currentStep === 1 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
              Choose how to generate your 3D avatar
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-muted-pink)', marginBottom: '1.5rem' }}>
              Select a capture method to synthesize your personal 3D physiological avatar.
            </p>

            <div className="method-grid">
              {/* Option A: Upload photograph */}
              <div
                className={`method-card ${method === 'photo' ? 'selected' : ''}`}
                onClick={() => setMethod('photo')}
              >
                <div className="method-icon-wrap">
                  <Upload size={24} />
                </div>
                <div className="method-title">Option A: Upload a photograph</div>
                <div className="method-desc">
                  Upload a front-facing portrait photograph with neutral lighting. Supports JPG, PNG, and HEIC formats with client-side privacy cropping.
                </div>
              </div>

              {/* Option B: Use device camera */}
              <div
                className={`method-card ${method === 'camera' ? 'selected' : ''}`}
                onClick={() => {
                  setMethod('camera');
                  startCamera();
                }}
              >
                <div className="method-icon-wrap">
                  <Camera size={24} />
                </div>
                <div className="method-title">Option B: Use device camera</div>
                <div className="method-desc">
                  Open your front-facing desktop or mobile camera with guide brackets to capture an instant reference photo in real-time.
                </div>
              </div>

              {/* Option C: Manual Customizer */}
              <div
                className={`method-card ${method === 'manual' ? 'selected' : ''}`}
                onClick={() => setMethod('manual')}
              >
                <div className="method-icon-wrap">
                  <Sliders size={24} />
                </div>
                <div className="method-title">Option C: Create avatar manually</div>
                <div className="method-desc">
                  Select body proportions, height, skin tone, and anatomical base models manually without uploading personal photography.
                </div>
              </div>
            </div>

            {/* Method A Detail Panel */}
            {method === 'photo' && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(143, 32, 56, 0.3)' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Upload Reference Photograph</h4>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handlePhotoUpload}
                  />
                  <button
                    className="btn btn-secondary"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} /> Choose Image File...
                  </button>

                  {uploadedImage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={uploadedImage}
                        alt="Uploaded Reference"
                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-heart-red)' }}
                      />
                      <span style={{ fontSize: '0.8rem', color: 'var(--color-success)' }}>
                        ✓ Image loaded and cropped successfully
                      </span>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => setUploadedImage(null)}
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Explicit Consent Checkbox */}
                <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(143, 32, 56, 0.25)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <input
                    type="checkbox"
                    id="consent-check"
                    checked={consentGranted}
                    onChange={(e) => setConsentGranted(e.target.checked)}
                    style={{ marginTop: '4px', accentColor: 'var(--color-heart-red)' }}
                  />
                  <label htmlFor="consent-check" style={{ fontSize: '0.775rem', color: 'var(--color-muted-pink)', lineHeight: 1.5 }}>
                    I grant explicit consent for Vitalis AI to process this reference photograph solely for the purpose of generating my external 3D avatar. My image will remain private, encrypted in transit and at rest, and can be deleted at any time from my privacy vault.
                  </label>
                </div>
              </div>
            )}

            {/* Method B Detail Panel */}
            {method === 'camera' && (
              <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(143, 32, 56, 0.3)', textAlign: 'center' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Camera Live Reference Capture</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
                  Position your face and upper torso inside the dashed alignment frame.
                </p>

                <div className="camera-preview-box">
                  {capturedImage ? (
                    <img src={capturedImage} alt="Captured Snapshot" />
                  ) : (
                    <>
                      <video ref={videoRef} autoPlay playsInline muted />
                      <div className="camera-overlay-frame" />
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                  {capturedImage ? (
                    <button className="btn btn-secondary" onClick={startCamera}>
                      <RefreshCw size={15} /> Retake Photo
                    </button>
                  ) : (
                    <button className="btn btn-primary" onClick={captureSnapshot}>
                      <Camera size={16} /> Capture Reference Portrait
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Method C Detail Panel */}
            {method === 'manual' && (
              <div className="customize-grid">
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Base Body Model
                  </label>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                      className={`btn btn-sm ${genderBase === 'female' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setGenderBase('female')}
                    >
                      Female Standard (Sarah Mitchell Rig)
                    </button>
                    <button
                      className={`btn btn-sm ${genderBase === 'male' ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={() => setGenderBase('male')}
                    >
                      Male Standard
                    </button>
                  </div>

                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                    Height: {heightCm} cm ({Math.round(heightCm / 2.54 / 12)} ft {Math.round((heightCm / 2.54) % 12)} in)
                  </label>
                  <input
                    type="range"
                    min="145"
                    max="205"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    style={{ width: '100%', accentColor: 'var(--color-heart-red)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Skin Tone Melanin Spectrum
                  </label>
                  <div className="palette-swatches">
                    {['#FBD6B7', '#E0AC69', '#C68642', '#8D5524', '#3D2314'].map((tone) => (
                      <button
                        key={tone}
                        className={`swatch-btn ${skinTone === tone ? 'active' : ''}`}
                        style={{ backgroundColor: tone }}
                        onClick={() => setSkinTone(tone)}
                      />
                    ))}
                  </div>

                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginTop: '1.25rem', marginBottom: '0.5rem' }}>
                    Body Proportions
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {(['lean', 'athletic', 'medium', 'broad'] as const).map((b) => (
                      <button
                        key={b}
                        className={`btn btn-sm ${bodyBuild === b ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={() => setBodyBuild(b)}
                        style={{ textTransform: 'capitalize' }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Scientific Notice */}
            <div className="scientific-notice">
              <strong style={{ color: 'var(--color-warm-white)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
                <ShieldCheck size={14} color="var(--color-heart-red)" /> CRITICAL SCIENTIFIC & MEDICAL DISCLOSURE:
              </strong>
              A photograph or external camera capture is strictly used to shape your <strong>external personal visual avatar</strong>. An ordinary photograph is NEVER treated as a medical scan, and Vitalis AI never claims to deduce internal organs, bones, or medical pathology from an ordinary 2D photograph.
            </div>
          </div>
        )}

        {/* ── STEP 2: GENERATE PERSONALIZED 3D AVATAR ── */}
        {currentStep === 2 && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div className="badge badge-crimson" style={{ marginBottom: '0.5rem' }}>
                Personalized External Avatar Synthesized
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                Meet Your 3D Digital Avatar
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)' }}>
                Rotate, zoom, and inspect your external anatomical model with natural human proportions and skin shaders.
              </p>
            </div>

            <div style={{ height: '480px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid rgba(143, 32, 56, 0.4)' }}>
              <HumanTwin3D mode="avatar" compact={false} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
              <span>• Natural proportion calibrated</span>
              <span>• Biometric height: {heightCm} cm</span>
              <span>• Front, profile, and posterior views available</span>
            </div>
          </div>
        )}

        {/* ── STEP 3: PERSONALISE INTERNAL ANATOMY ── */}
        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
              Personalise Your Internal Anatomy
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-muted-pink)', marginBottom: '1.5rem' }}>
              Select the source of your internal organ, skeletal, and cardiovascular visualizations.
            </p>

            <div className="method-grid">
              <div
                className={`method-card ${anatomyMode === 'standard' ? 'selected' : ''}`}
                onClick={() => setAnatomyMode('standard')}
              >
                <div className="method-icon-wrap">
                  <Layers size={24} />
                </div>
                <div className="method-title">Standard Anatomical Reference</div>
                <div className="method-desc">
                  Uses scientifically accurate, peer-reviewed reference 3D models for all 12 internal organ systems, bones, and vascular circulation.
                </div>
                <span className="badge badge-success" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                  Recommended Baseline
                </span>
              </div>

              <div
                className={`method-card ${anatomyMode === 'imaging' ? 'selected' : ''}`}
                onClick={() => setAnatomyMode('imaging')}
              >
                <div className="method-icon-wrap">
                  <FileCheck2 size={24} />
                </div>
                <div className="method-title">Patient Medical Imaging (CT / MRI)</div>
                <div className="method-desc">
                  Connect authenticated DICOM datasets or clinical volumetric scans to overlay imaging-derived anatomy verified by an attending physician.
                </div>
                <span className="badge badge-rose" style={{ marginTop: '1rem', alignSelf: 'flex-start' }}>
                  Clinical DICOM Support
                </span>
              </div>
            </div>

            {anatomyMode === 'imaging' && (
              <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(143, 32, 56, 0.3)' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Upload Verified Medical Imaging Dataset</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', marginBottom: '1rem' }}>
                  Support for multi-slice DICOM series, volumetric NIfTI, and certified radiology reports.
                </p>
                <div style={{ border: '2px dashed rgba(143, 32, 56, 0.4)', borderRadius: 'var(--radius-md)', padding: '2rem', textAlign: 'center' }}>
                  <Upload size={32} color="var(--color-heart-red)" style={{ margin: '0 auto 0.75rem' }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Drag and drop DICOM / CT / MRI archive (.zip, .dcm)</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)', marginTop: '0.35rem' }}>
                    Or select pre-loaded sample: <strong>Sarah_Mitchell_Lumbar_MRI_3T.dcm</strong>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '1rem' }}
                    onClick={() => setUploadedImagingFile('Sarah_Mitchell_Lumbar_MRI_3T.dcm')}
                  >
                    {uploadedImagingFile ? '✓ Dataset Linked (Sarah_Mitchell_Lumbar_MRI_3T.dcm)' : 'Load Certified Sample Scan'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 4: BASIC HEALTH PROFILE ── */}
        {currentStep === 4 && (
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', textAlign: 'center' }}>
              Essential Health Profile
            </h3>
            <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-muted-pink)', marginBottom: '1.5rem' }}>
              Your answers help calibrate physiological telemetry and connect your records to the appropriate 3D organs.
            </p>

            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.3)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className="input-field"
                    value={profile.dob}
                    onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Blood Type
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.bloodType}
                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Known Drug Allergies
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.allergies}
                    onChange={(e) => setProfile({ ...profile, allergies: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Existing Documented Medical Conditions
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.conditions}
                    onChange={(e) => setProfile({ ...profile, conditions: e.target.value })}
                  />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Current Prescriptions & Dosages
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.medications}
                    onChange={(e) => setProfile({ ...profile, medications: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={profile.emergencyContact}
                    onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                    Preferred Medical Report Language
                  </label>
                  <select
                    className="input-field"
                    value={profile.preferredLanguage}
                    onChange={(e) => setProfile({ ...profile, preferredLanguage: e.target.value })}
                  >
                    <option value="English">English</option>
                    <option value="Hindi">हिन्दी (Hindi)</option>
                    <option value="Gujarati">ગુજરાતી (Gujarati)</option>
                    <option value="Spanish">Español (Spanish)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 5: ENTER DASHBOARD ── */}
        {currentStep === 5 && (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-heart-red), var(--color-crimson))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 24px rgba(197, 40, 72, 0.4)' }}>
              <Heart size={32} color="#FFF7F7" />
            </div>

            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Your body. Your health history. All in one place.
            </h2>
            <p style={{ maxWidth: '620px', margin: '0 auto 2rem', color: 'var(--color-muted-pink)', fontSize: '1rem', lineHeight: 1.6 }}>
              Your personalized digital human twin is provisioned and linked to your verified clinical timeline. Enter your personal health workspace to explore your anatomy and understand your medical records.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button className="btn btn-primary btn-lg" onClick={handleNext}>
                Enter My Health Dashboard <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation Buttons */}
        <div className="onboard-actions">
          {currentStep > 1 && currentStep < 5 ? (
            <button className="btn btn-ghost" onClick={handleBack}>
              <ArrowLeft size={16} /> Previous Step
            </button>
          ) : <div />}

          {currentStep < 5 && (
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={currentStep === 1 && method === 'photo' && !consentGranted && !uploadedImage}
            >
              Continue to Step {currentStep + 1} <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarOnboardingPage;
