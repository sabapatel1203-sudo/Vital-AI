import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Maximize2, 
  Layers, 
  Sliders, 
  FileText,
  Upload,
  CheckCircle2,
  Crosshair,
  Printer,
  Download,
  Activity,
  Eye
} from 'lucide-react';

interface ImagingSeries {
  id: string;
  title: string;
  modality: 'MRI' | 'CT' | 'Ultrasound';
  organId: string;
  system: string;
  date: string;
  facility: string;
  physician: string;
  sliceCount: number;
  sliceIndex: number;
  windowPreset: 'soft-tissue' | 'bone' | 'brain' | 'lung';
  contrast: number;
  brightness: number;
  notes: string;
  indication: string;
  technique: string;
}

const SAMPLE_SERIES: ImagingSeries[] = [
  {
    id: 'img-1',
    title: '3T Lumbar Spine Sagittal T2-Weighted Series',
    modality: 'MRI',
    organId: 'skeletal',
    system: 'Skeletal System',
    date: 'Nov 02, 2025',
    facility: 'University Medical Imaging Specialists',
    physician: 'Dr. Karen Vance, MD (Neuroradiology)',
    sliceCount: 24,
    sliceIndex: 12,
    windowPreset: 'soft-tissue',
    contrast: 110,
    brightness: 100,
    indication: 'Persistent lower back pain radiating into left gluteal region. Rule out lumbar disc herniation.',
    technique: 'Multi-slice Sagittal T1 and T2-weighted fast spin-echo sequence on 3.0 Tesla Siemens Magnetom scanner. Slice thickness: 3.5mm, gap: 0.5mm. FOV: 280mm.',
    notes: 'Preserved lumbar lordosis. L1-L2 through L3-L4 disc heights and signal intensities are within normal limits. At L4-L5, there is a distinct posterior-central annular disc bulge measuring 3.2mm, contacting the anterior thecal sac without critical canal stenosis. Thecal sac and neural exit foramina remain patent bilaterally. Conus medullaris terminates normally at L1 level.',
  },
  {
    id: 'img-2',
    title: 'Transthoracic Echocardiogram 4-Chamber View',
    modality: 'Ultrasound',
    organId: 'heart',
    system: 'Cardiovascular System',
    date: 'Sep 04, 2026',
    facility: 'St. Jude Heart & Vascular Diagnostic Pavilion',
    physician: 'Dr. James Chen, MD, FACC (Cardiology)',
    sliceCount: 16,
    sliceIndex: 8,
    windowPreset: 'soft-tissue',
    contrast: 115,
    brightness: 95,
    indication: 'Essential hypertension routine surveillance. Assessment of LV ejection fraction, wall thickness, and valvular competence.',
    technique: 'Transthoracic 2D harmonic echocardiography with spectral and color-flow Doppler interrogation across all cardiac chambers.',
    notes: 'Left ventricle demonstrates normal internal cavity dimensions with preserved global systolic contractility. Calculated biplane LVEF is 62%. Interventricular septum thickness measures 0.9 cm (normal < 1.0 cm); posterior LV wall thickness measures 0.85 cm. No concentric hypertrophy. All 17 segments contract symmetrically. Normal mitral and tricuspid valve excursions with trace physiological regurgitation.',
  },
  {
    id: 'img-3',
    title: 'Coronary Artery Calcium Non-Contrast CT',
    modality: 'CT',
    organId: 'heart',
    system: 'Cardiovascular System',
    date: 'Jan 12, 2026',
    facility: 'Cardiology Advanced Imaging Institute',
    physician: 'Dr. Marcus Thorne, MD (Cardiothoracic Radiology)',
    sliceCount: 32,
    sliceIndex: 16,
    windowPreset: 'bone',
    contrast: 125,
    brightness: 105,
    indication: 'Cardiovascular risk stratification in 42-year-old female with treated essential hypertension.',
    technique: 'Prospective ECG-gated axial computed tomography performed on GE Revolution 256-slice CT scanner without intravenous contrast. Slice collimation: 2.5mm.',
    notes: 'Total Agatston Coronary Artery Calcium (CAC) Score: 0. Left main, left anterior descending, left circumflex, and right coronary arteries are completely patent without calcified fibrofatty atheromatous plaque. Projected 10-year major adverse cardiac event (MACE) risk falls into the lowest percentile (< 1%).',
  },
];

export const MedicalImagingPage: React.FC = () => {
  const [activeSeries, setActiveSeries] = useState<ImagingSeries>(SAMPLE_SERIES[0]);
  const [currentSlice, setCurrentSlice] = useState(activeSeries.sliceIndex);
  const [viewMode, setViewMode] = useState<'dicom' | 'report'>('dicom');
  const [zoom, setZoom] = useState(1.0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [showCrosshair, setShowCrosshair] = useState(true);
  const [showDoppler, setShowDoppler] = useState(true);
  const [windowPreset, setWindowPreset] = useState<'soft-tissue' | 'bone' | 'brain' | 'lung'>('soft-tissue');
  const [uploadedScanUrl, setUploadedScanUrl] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSelectSeries = (s: ImagingSeries) => {
    setActiveSeries(s);
    setCurrentSlice(s.sliceIndex);
    setZoom(1.0);
    setBrightness(s.brightness);
    setContrast(s.contrast);
    setWindowPreset(s.windowPreset);
    setUploadedScanUrl(null);
  };

  const handlePresetChange = (preset: 'soft-tissue' | 'bone' | 'brain' | 'lung') => {
    setWindowPreset(preset);
    if (preset === 'bone') {
      setContrast(140);
      setBrightness(115);
    } else if (preset === 'brain') {
      setContrast(125);
      setBrightness(95);
    } else if (preset === 'lung') {
      setContrast(90);
      setBrightness(120);
    } else {
      setContrast(100);
      setBrightness(100);
    }
  };

  const handleReset = () => {
    setZoom(1.0);
    setBrightness(100);
    setContrast(100);
    setRotation(0);
    setWindowPreset('soft-tissue');
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUploadedScanUrl(url);
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     HIGH-FIDELITY PROCEDURAL MEDICAL SCAN RENDERER
     Renders authentic Sagittal Spine MRI, 4-Chamber Echo & Axial CT
     ───────────────────────────────────────────────────────────── */
  useEffect(() => {
    if (viewMode !== 'dicom' || uploadedScanUrl) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    // Deep radiological background
    ctx.fillStyle = '#060205';
    ctx.fillRect(0, 0, w, h);

    const sliceRatio = (currentSlice - 1) / (activeSeries.sliceCount - 1);

    if (activeSeries.modality === 'MRI') {
      /* ─────────────────────────────────────────────────────────────
         SAGITTAL LUMBAR SPINE 3T T2-WEIGHTED MRI RENDERER
         ───────────────────────────────────────────────────────────── */
      // Anatomical dimensions
      const startY = 60;
      const vertH = 46;
      const vertW = 76;
      const discH = 15;
      const spineCenterX = 230;

      // Posterior subcutaneous tissue gradient
      const tissueGrad = ctx.createLinearGradient(0, 0, w, 0);
      tissueGrad.addColorStop(0, '#060205');
      tissueGrad.addColorStop(0.2, '#12070c');
      tissueGrad.addColorStop(0.5, '#220b15');
      tissueGrad.addColorStop(0.8, '#14060d');
      tissueGrad.addColorStop(1, '#060205');
      ctx.fillStyle = tissueGrad;
      ctx.fillRect(50, 40, 380, 400);

      // Vertebrae L1 through L5 + Sacrum S1
      const vertLabels = ['L1', 'L2', 'L3', 'L4', 'L5', 'S1'];
      for (let i = 0; i < 6; i++) {
        const curY = startY + i * (vertH + discH);
        const curveOffset = Math.sin((i / 5) * Math.PI) * 14; // Lumbar lordosis curve
        const vX = spineCenterX + curveOffset;

        // Vertebral Body (Cancellous bone marrow)
        const marrowGrad = ctx.createRadialGradient(vX, curY + vertH / 2, 5, vX, curY + vertH / 2, vertW / 2);
        marrowGrad.addColorStop(0, '#8f7e84');
        marrowGrad.addColorStop(0.7, '#635359');
        marrowGrad.addColorStop(1, '#2c2024');

        ctx.fillStyle = marrowGrad;
        ctx.strokeStyle = '#c5b8bd';
        ctx.lineWidth = 1.8;

        // Rounded vertebral block
        ctx.beginPath();
        ctx.roundRect(vX - vertW / 2, curY, vertW, vertH, [4, 6, 6, 4]);
        ctx.fill();
        ctx.stroke();

        // Endplate sclerosis lines
        ctx.strokeStyle = '#ded5d8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(vX - vertW / 2 + 4, curY + 2);
        ctx.lineTo(vX + vertW / 2 - 4, curY + 2);
        ctx.moveTo(vX - vertW / 2 + 4, curY + vertH - 2);
        ctx.lineTo(vX + vertW / 2 - 4, curY + vertH - 2);
        ctx.stroke();

        // Vertebral Anatomical Label
        ctx.fillStyle = 'rgba(255, 247, 247, 0.65)';
        ctx.font = '10px monospace';
        ctx.fillText(vertLabels[i], vX - 10, curY + vertH / 2 + 4);

        // Posterior Spinous Process
        ctx.fillStyle = '#4a3d43';
        ctx.beginPath();
        ctx.moveTo(vX - vertW / 2 - 25, curY + 12);
        ctx.lineTo(vX - vertW / 2 - 65, curY + 24);
        ctx.lineTo(vX - vertW / 2 - 25, curY + 36);
        ctx.closePath();
        ctx.fill();

        // Intervertebral Disc
        if (i < 5) {
          const discY = curY + vertH;
          const isHerniated = i === 3; // L4-L5 disc

          // Disc gradient
          const discGrad = ctx.createLinearGradient(vX - vertW / 2, discY, vX + vertW / 2, discY);
          discGrad.addColorStop(0, isHerniated ? '#a83045' : '#33272c');
          discGrad.addColorStop(0.4, isHerniated ? '#e8afba' : '#c9bdc2'); // T2 hyperintense nucleus pulposus
          discGrad.addColorStop(1, '#33272c');

          ctx.fillStyle = discGrad;
          ctx.beginPath();
          ctx.roundRect(vX - vertW / 2 + 2, discY, vertW - 4, discH, 3);
          ctx.fill();

          // L4-L5 Annular Disc Bulge Protrusion
          if (isHerniated) {
            ctx.fillStyle = '#c52848';
            ctx.beginPath();
            ctx.arc(vX - vertW / 2 - 2, discY + discH / 2, 7, 0, Math.PI * 2);
            ctx.fill();

            // Pulsing lesion marker ring
            ctx.strokeStyle = '#e6a34a';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Callout line
            ctx.strokeStyle = '#e6a34a';
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.moveTo(vX - vertW / 2 - 10, discY + discH / 2);
            ctx.lineTo(vX - vertW / 2 - 45, discY + discH / 2 - 12);
            ctx.stroke();
            ctx.setLineDash([]);

            ctx.fillStyle = '#e6a34a';
            ctx.font = 'bold 9px monospace';
            ctx.fillText('L4-L5 BULGE (3.2mm)', vX - vertW / 2 - 145, discY + discH / 2 - 10);
          }
        }
      }

      // Thecal Sac with Hyperintense T2 Cerebrospinal Fluid (White channel)
      ctx.fillStyle = 'rgba(235, 245, 255, 0.88)';
      ctx.beginPath();
      ctx.moveTo(spineCenterX - vertW / 2 - 4, startY);
      for (let i = 0; i < 6; i++) {
        const curY = startY + i * (vertH + discH);
        const curveOffset = Math.sin((i / 5) * Math.PI) * 14;
        const indent = i === 3 ? 5 : 0; // Indentation at L4-L5 disc bulge
        ctx.lineTo(spineCenterX + curveOffset - vertW / 2 - 4 + indent, curY + vertH / 2);
      }
      for (let i = 5; i >= 0; i--) {
        const curY = startY + i * (vertH + discH);
        const curveOffset = Math.sin((i / 5) * Math.PI) * 14;
        ctx.lineTo(spineCenterX + curveOffset - vertW / 2 - 18, curY + vertH / 2);
      }
      ctx.closePath();
      ctx.fill();

      // Cauda Equina Nerve Fibers inside CSF
      ctx.strokeStyle = 'rgba(80, 70, 75, 0.7)';
      ctx.lineWidth = 1;
      for (let f = 0; f < 3; f++) {
        ctx.beginPath();
        ctx.moveTo(spineCenterX - vertW / 2 - 8 - f * 3, startY);
        for (let i = 0; i < 6; i++) {
          const curY = startY + i * (vertH + discH);
          const curveOffset = Math.sin((i / 5) * Math.PI) * 14;
          ctx.lineTo(spineCenterX + curveOffset - vertW / 2 - 8 - f * 3, curY + vertH / 2);
        }
        ctx.stroke();
      }

    } else if (activeSeries.modality === 'Ultrasound') {
      /* ─────────────────────────────────────────────────────────────
         APICAL 4-CHAMBER ECHOCARDIOGRAM ULTRASOUND RENDERER
         ───────────────────────────────────────────────────────────── */
      const apexX = 240;
      const apexY = 65;
      const depth = 340;
      const angle = Math.PI * 0.42;

      // Ultrasound Sector Wedge (Pie Cone)
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.arc(apexX, apexY, depth, Math.PI / 2 - angle / 2, Math.PI / 2 + angle / 2);
      ctx.closePath();
      ctx.clip();

      // Acoustic shadow background
      const coneGrad = ctx.createRadialGradient(apexX, apexY, 20, apexX, apexY, depth);
      coneGrad.addColorStop(0, '#10040a');
      coneGrad.addColorStop(0.5, '#1e0813');
      coneGrad.addColorStop(1, '#060205');
      ctx.fillStyle = coneGrad;
      ctx.fillRect(0, 0, w, h);

      // Acoustic Speckle Texture
      ctx.fillStyle = 'rgba(235, 180, 195, 0.08)';
      for (let p = 0; p < 800; p++) {
        const r = Math.random() * depth;
        const th = Math.PI / 2 - angle / 2 + Math.random() * angle;
        const px = apexX + Math.cos(th) * r;
        const py = apexY + Math.sin(th) * r;
        ctx.fillRect(px, py, 1.5, 1.5);
      }

      // Left Ventricle (LV) cavity
      const lvGrad = ctx.createRadialGradient(200, 200, 10, 200, 200, 60);
      lvGrad.addColorStop(0, '#060205');
      lvGrad.addColorStop(0.8, '#14060d');
      lvGrad.addColorStop(1, '#632537');
      ctx.fillStyle = lvGrad;
      ctx.beginPath();
      ctx.ellipse(205, 195, 38, 65, -0.15, 0, Math.PI * 2);
      ctx.fill();

      // Right Ventricle (RV) cavity
      ctx.beginPath();
      ctx.ellipse(275, 195, 32, 58, 0.15, 0, Math.PI * 2);
      ctx.fill();

      // Interventricular Septum (IVS)
      ctx.strokeStyle = '#e8afba';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(240, 120);
      ctx.quadraticCurveTo(242, 190, 240, 255);
      ctx.stroke();

      // Left Atrium (LA) cavity
      ctx.beginPath();
      ctx.ellipse(195, 290, 30, 38, -0.1, 0, Math.PI * 2);
      ctx.fill();

      // Right Atrium (RA) cavity
      ctx.beginPath();
      ctx.ellipse(280, 290, 28, 36, 0.1, 0, Math.PI * 2);
      ctx.fill();

      // Mitral Valve Leaflets
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(215, 255);
      ctx.lineTo(235, 260); // Anterior leaflet
      ctx.moveTo(175, 255);
      ctx.lineTo(195, 260); // Posterior leaflet
      ctx.stroke();

      // Tricuspid Valve Leaflets
      ctx.beginPath();
      ctx.moveTo(245, 255);
      ctx.lineTo(265, 260);
      ctx.moveTo(285, 255);
      ctx.lineTo(300, 258);
      ctx.stroke();

      // Color Doppler Inflow Jet (Red/Blue Doppler Box)
      if (showDoppler) {
        const dopplerGrad = ctx.createLinearGradient(205, 240, 205, 300);
        dopplerGrad.addColorStop(0, 'rgba(235, 60, 80, 0.65)'); // Arterial red inflow
        dopplerGrad.addColorStop(0.5, 'rgba(255, 200, 50, 0.45)');
        dopplerGrad.addColorStop(1, 'rgba(50, 140, 255, 0.65)'); // Blue outflow
        ctx.fillStyle = dopplerGrad;
        ctx.beginPath();
        ctx.ellipse(205, 265, 16, 26, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // Chamber Labels
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText('LV (EF 62%)', 165, 190);
      ctx.fillText('RV', 285, 190);
      ctx.fillText('LA', 185, 305);
      ctx.fillText('RA', 285, 305);

      // Sector Arc Boundary
      ctx.strokeStyle = 'rgba(255, 247, 247, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(apexX, apexY);
      ctx.arc(apexX, apexY, depth, Math.PI / 2 - angle / 2, Math.PI / 2 + angle / 2);
      ctx.lineTo(apexX, apexY);
      ctx.stroke();

      // ECG Waveform strip at bottom
      ctx.strokeStyle = '#4eaa83';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(20, 440);
      for (let x = 20; x < w - 20; x += 60) {
        ctx.lineTo(x + 15, 440);
        ctx.lineTo(x + 20, 434); // P wave
        ctx.lineTo(x + 25, 440);
        ctx.lineTo(x + 28, 444); // Q dip
        ctx.lineTo(x + 32, 412); // R spike
        ctx.lineTo(x + 36, 448); // S wave
        ctx.lineTo(x + 42, 440);
        ctx.lineTo(x + 48, 432); // T wave
        ctx.lineTo(x + 55, 440);
      }
      ctx.stroke();

      ctx.fillStyle = '#4eaa83';
      ctx.font = '9px monospace';
      ctx.fillText('HR: 72 BPM • SINUS RHYTHM', 25, 420);

    } else {
      /* ─────────────────────────────────────────────────────────────
         AXIAL THORACIC CORONARY CT ANGIOGRAPHY RENDERER
         ───────────────────────────────────────────────────────────── */
      const cx = 240;
      const cy = 230;

      // Thoracic Body Contour
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2.5;
      ctx.fillStyle = '#080306';
      ctx.beginPath();
      ctx.ellipse(cx, cy, 175, 140, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vertebral Body (Dorsal bone)
      ctx.fillStyle = '#e8edf2';
      ctx.beginPath();
      ctx.roundRect(cx - 26, cy + 80, 52, 38, 6);
      ctx.fill();

      // Bilateral Lung Fields (Air: HU -900 to -1000 = jet black)
      ctx.fillStyle = '#020102';
      ctx.beginPath();
      ctx.ellipse(cx - 85, cy + 15, 62, 85, 0.15, 0, Math.PI * 2); // Right lung
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.stroke();

      ctx.beginPath();
      ctx.ellipse(cx + 85, cy + 15, 58, 85, -0.15, 0, Math.PI * 2); // Left lung
      ctx.fill();
      ctx.stroke();

      // Mediastinum & Cardiac Silhouette
      const heartGrad = ctx.createRadialGradient(cx - 10, cy - 10, 10, cx - 10, cy - 10, 80);
      heartGrad.addColorStop(0, '#381622');
      heartGrad.addColorStop(0.7, '#240d16');
      heartGrad.addColorStop(1, '#0e0409');
      ctx.fillStyle = heartGrad;
      ctx.beginPath();
      ctx.ellipse(cx - 8, cy - 8, 70, 62, -0.2, 0, Math.PI * 2);
      ctx.fill();

      // Ascending Aorta (Round lumen)
      ctx.fillStyle = '#5c2232';
      ctx.strokeStyle = '#c52848';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx - 15, cy - 20, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Descending Thoracic Aorta
      ctx.beginPath();
      ctx.arc(cx - 25, cy + 65, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Left Anterior Descending (LAD) Coronary Artery trajectory
      ctx.strokeStyle = '#e8afba';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 5, cy - 32);
      ctx.quadraticCurveTo(cx + 20, cy - 40, cx + 38, cy - 25);
      ctx.stroke();

      // CAC Zero Score Annotation Crosshair
      ctx.strokeStyle = '#4eaa83';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(cx + 15, cy - 32, 12, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#4eaa83';
      ctx.font = 'bold 9px monospace';
      ctx.fillText('LAD CORONARY (AGATSTON: 0)', cx + 32, cy - 42);

      // Rib Cross-Sections around periphery
      ctx.fillStyle = '#e8edf2';
      for (let a = 0; a < 8; a++) {
        const ang = (a / 8) * Math.PI + 0.2;
        const rx1 = cx - Math.cos(ang) * 165;
        const ry1 = cy + Math.sin(ang) * 130;
        ctx.beginPath();
        ctx.ellipse(rx1, ry1, 8, 5, ang, 0, Math.PI * 2);
        ctx.fill();

        const rx2 = cx + Math.cos(ang) * 165;
        ctx.beginPath();
        ctx.ellipse(rx2, ry1, 8, 5, -ang, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Interactive Measurement Crosshair
    if (showCrosshair) {
      ctx.strokeStyle = 'rgba(215, 131, 156, 0.35)';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pixel Value / HU probe readout
      ctx.fillStyle = 'rgba(255, 247, 247, 0.7)';
      ctx.font = '10px monospace';
      ctx.fillText(`PROBE: [${Math.round(w / 2)}, ${Math.round(h / 2)}] • HU: ${Math.round(180 * sliceRatio)}`, w / 2 + 8, h / 2 - 8);
    }
  }, [activeSeries, currentSlice, viewMode, showCrosshair, showDoppler, uploadedScanUrl]);

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)' }}>
      {/* Top Header */}
      <header style={{ padding: '1.25rem 2.5rem', background: 'var(--color-bg-surface)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span className="badge badge-crimson">{activeSeries.modality} Multi-Slice</span>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, margin: 0 }}>
              Diagnostic Imaging & PACS Volumetric Viewer
            </h1>
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
            Patient: <strong>Sarah Mitchell</strong> (MRN #4092-SM • Age 42) • Attending: <strong>{activeSeries.physician}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* View Mode Toggle: Volumetric DICOM vs Full Clinical Report Sheet */}
          <div style={{ display: 'inline-flex', background: 'rgba(24, 9, 15, 0.85)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(143, 32, 56, 0.4)' }}>
            <button
              className={`btn btn-sm ${viewMode === 'dicom' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('dicom')}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}
            >
              <Eye size={13} /> DICOM Slice View
            </button>
            <button
              className={`btn btn-sm ${viewMode === 'report' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setViewMode('report')}
              style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}
            >
              <FileText size={13} /> Original Report Document
            </button>
          </div>

          <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
            <Upload size={14} /> Upload Custom Scan / Film
            <input type="file" accept="image/*,.dcm,.pdf" style={{ display: 'none' }} onChange={handleCustomUpload} />
          </label>

          <Link to="/twin" className="btn btn-primary btn-sm">
            <Layers size={14} /> View in 3D Anatomy Lab
          </Link>
        </div>
      </header>

      {uploadSuccess && (
        <div style={{ maxWidth: '1440px', margin: '1rem auto 0', padding: '0 2rem' }}>
          <div style={{ padding: '0.75rem 1.25rem', background: 'rgba(78, 170, 131, 0.15)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: '#8de8c1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> Custom diagnostic imaging file loaded successfully! Viewport calibrated.
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div style={{ maxWidth: '1440px', margin: '1.5rem auto', padding: '0 2rem', display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem' }}>
        
        {/* Left Column: Studies Roster & Calibration Controls */}
        <aside>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-brain-rose)', marginBottom: '0.75rem' }}>
            Diagnostic Imaging Studies
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {SAMPLE_SERIES.map((s) => {
              const isSelected = activeSeries.id === s.id && !uploadedScanUrl;
              return (
                <div
                  key={s.id}
                  onClick={() => handleSelectSeries(s)}
                  style={{
                    padding: '1rem',
                    background: isSelected ? 'rgba(197, 40, 72, 0.2)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--color-heart-red)' : 'rgba(143, 32, 56, 0.3)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>{s.modality}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--color-muted-pink)' }}>{s.date}</span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-warm-white)' }}>
                    {s.title}
                  </div>
                  <div style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
                    {s.sliceCount} Volumetric Slices • {s.facility}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Hounsfield Window & Calibration Presets */}
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-warm-white)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Sliders size={14} color="var(--color-heart-red)" /> Hounsfield Calibration
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
              {(['soft-tissue', 'bone', 'brain', 'lung'] as const).map((preset) => (
                <button
                  key={preset}
                  className={`btn btn-sm ${windowPreset === preset ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => handlePresetChange(preset)}
                  style={{ textTransform: 'capitalize', fontSize: '0.725rem', padding: '0.35rem 0.5rem' }}
                >
                  {preset.replace('-', ' ')}
                </button>
              ))}
            </div>

            {/* Sliders */}
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted-pink)', marginBottom: '0.2rem' }}>
                  <span>Brightness</span>
                  <span>{brightness}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-heart-red)' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--color-muted-pink)', marginBottom: '0.2rem' }}>
                  <span>Contrast</span>
                  <span>{contrast}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-heart-red)' }}
                />
              </div>
            </div>

            {/* Feature Toggles */}
            <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid rgba(143, 32, 56, 0.2)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted-pink)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={showCrosshair}
                  onChange={(e) => setShowCrosshair(e.target.checked)}
                  style={{ accentColor: 'var(--color-heart-red)' }}
                />
                Show Coordinate Crosshairs
              </label>

              {activeSeries.modality === 'Ultrasound' && (
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--color-muted-pink)', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showDoppler}
                    onChange={(e) => setShowDoppler(e.target.checked)}
                    style={{ accentColor: 'var(--color-heart-red)' }}
                  />
                  Color Doppler Blood Flow
                </label>
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Dynamic Volumetric DICOM or Physical Scanned Report Document */}
        <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {viewMode === 'dicom' ? (
            <>
              {/* Main Visualizer Viewport */}
              <div
                style={{
                  height: '520px',
                  background: '#040103',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(143, 32, 56, 0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* HUD Overlay Text */}
                <div style={{ position: 'absolute', top: '15px', left: '15px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255, 247, 247, 0.7)', zIndex: 10 }}>
                  <div>{activeSeries.facility.toUpperCase()}</div>
                  <div>PATIENT: SARAH MITCHELL | DOB: 1984-06-12</div>
                  <div>MODALITY: {activeSeries.modality} | TE: 92ms TR: 3200ms</div>
                  <div style={{ color: 'var(--color-heart-red)' }}>SLICE: {currentSlice} / {activeSeries.sliceCount}</div>
                </div>

                <div style={{ position: 'absolute', top: '15px', right: '15px', fontSize: '0.75rem', fontFamily: 'monospace', color: 'rgba(255, 247, 247, 0.7)', textAlign: 'right', zIndex: 10 }}>
                  <div>ZOOM: {Math.round(zoom * 100)}%</div>
                  <div>W: {contrast * 4} L: {brightness * 2}</div>
                  <div>PRESET: {windowPreset.toUpperCase()}</div>
                </div>

                {/* DICOM Slice Canvas or Uploaded Image */}
                <div
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                    transition: 'transform 0.15s ease-out',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {uploadedScanUrl ? (
                    <img
                      src={uploadedScanUrl}
                      alt="Uploaded Medical Scan"
                      style={{ maxWidth: '440px', maxHeight: '440px', borderRadius: 'var(--radius-md)', objectFit: 'contain' }}
                    />
                  ) : (
                    <canvas
                      ref={canvasRef}
                      width={480}
                      height={480}
                      style={{ borderRadius: 'var(--radius-md)', boxShadow: '0 0 30px rgba(0,0,0,0.9)' }}
                    />
                  )}
                </div>

                {/* Bottom Controls Bar inside Viewport */}
                <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '0.65rem', background: 'rgba(34, 13, 22, 0.85)', padding: '0.4rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid rgba(143, 32, 56, 0.4)', zIndex: 10 }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))} title="Zoom Out">
                    <ZoomOut size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))} title="Zoom In">
                    <ZoomIn size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setRotation((r) => (r + 90) % 360)} title="Rotate 90°">
                    <RotateCw size={14} />
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={handleReset} title="Reset Viewport">
                    <Maximize2 size={14} /> Reset
                  </button>
                </div>
              </div>

              {/* Volumetric Slice Scrub Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1.25rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '90px' }}>
                  Slice {currentSlice} / {activeSeries.sliceCount}
                </span>
                <input
                  type="range"
                  min="1"
                  max={activeSeries.sliceCount}
                  value={currentSlice}
                  onChange={(e) => setCurrentSlice(Number(e.target.value))}
                  style={{ flex: 1, accentColor: 'var(--color-heart-red)' }}
                />
              </div>

              {/* Certified Radiologist Impression */}
              <div style={{ padding: '1.25rem', background: 'var(--color-bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(143, 32, 56, 0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-heart-red)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Activity size={14} /> Certified Radiologist Impression
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setViewMode('report')}
                    style={{ fontSize: '0.725rem', color: 'var(--color-brain-rose)' }}
                  >
                    View Official Document Sheet →
                  </button>
                </div>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-warm-white)', lineHeight: 1.6 }}>
                  {activeSeries.notes}
                </p>
              </div>
            </>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               PHYSICAL SCANNED RADIOLOGIST REPORT DOCUMENT SHEET
               Authentic paper-style clinical report with hospital logo & PACS film
               ───────────────────────────────────────────────────────────── */
            <div style={{ background: '#FFFDFD', color: '#1A0C12', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid #E2D9DC' }}>
              {/* Document Header with Hospital Letterhead */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #8F2038', paddingBottom: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#8F2038', letterSpacing: '-0.02em' }}>
                    {activeSeries.facility.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#684F57', marginTop: '0.15rem' }}>
                    Department of Diagnostic Radiology & Biomarker Imaging • PACS Network Certified
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8A7078' }}>
                    Accreditation: American College of Radiology (ACR) • Gold Seal of Quality
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#1A0C12' }}>
                    EXAM ACCESSION: #{activeSeries.id.toUpperCase()}-2026
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#684F57' }}>
                    DATE PERFORMED: {activeSeries.date}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                    <button className="btn btn-secondary btn-sm" onClick={() => window.print()} style={{ color: '#8F2038', borderColor: '#8F2038', fontSize: '0.7rem' }}>
                      <Printer size={12} /> Print
                    </button>
                    <button className="btn btn-secondary btn-sm" style={{ color: '#8F2038', borderColor: '#8F2038', fontSize: '0.7rem' }}>
                      <Download size={12} /> PDF
                    </button>
                  </div>
                </div>
              </div>

              {/* Patient Demographics Box */}
              <div style={{ margin: '1.25rem 0', padding: '1rem', background: '#F8F2F4', borderRadius: '6px', border: '1px solid #E8D9DE', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', fontSize: '0.785rem' }}>
                <div>
                  <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>PATIENT NAME</span>
                  <strong style={{ color: '#1A0C12' }}>Sarah Mitchell</strong>
                </div>
                <div>
                  <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>MRN / ID</span>
                  <strong style={{ color: '#1A0C12' }}>#4092-SM</strong>
                </div>
                <div>
                  <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>AGE / SEX</span>
                  <strong style={{ color: '#1A0C12' }}>42 Years / Female</strong>
                </div>
                <div>
                  <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>ATTENDING PHYSICIAN</span>
                  <strong style={{ color: '#1A0C12' }}>{activeSeries.physician}</strong>
                </div>
              </div>

              {/* Clinical Report Body */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontSize: '0.85rem', lineHeight: 1.6, color: '#2B141E' }}>
                <div>
                  <strong style={{ color: '#8F2038', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>STUDY DESCRIPTION</strong>
                  {activeSeries.title}
                </div>

                <div>
                  <strong style={{ color: '#8F2038', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>CLINICAL INDICATION</strong>
                  {activeSeries.indication}
                </div>

                <div>
                  <strong style={{ color: '#8F2038', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase' }}>IMAGING TECHNIQUE</strong>
                  {activeSeries.technique}
                </div>

                {/* Embedded Key Image PACS Film Plates */}
                <div>
                  <strong style={{ color: '#8F2038', display: 'block', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    KEY RADIOLOGICAL IMAGING SNAPSHOTS
                  </strong>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {[1, 2, 3].map((f) => (
                      <div key={f} style={{ background: '#080205', borderRadius: '4px', padding: '0.5rem', textAlign: 'center', border: '1px solid #C4AAB2' }}>
                        <div style={{ height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Crosshair size={32} color="#C52848" opacity={0.6} />
                        </div>
                        <div style={{ fontSize: '0.65rem', color: '#FFF7F7', fontFamily: 'monospace' }}>
                          FRAME #{f * 4} • SAGITTAL FOCUS
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certified Impression */}
                <div style={{ background: '#FAF1F3', padding: '1rem', borderLeft: '4px solid #C52848', borderRadius: '0 6px 6px 0' }}>
                  <strong style={{ color: '#8F2038', display: 'block', fontSize: '0.825rem', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    CERTIFIED CLINICAL IMPRESSION
                  </strong>
                  <p style={{ margin: 0, fontWeight: 600, color: '#1A0C12' }}>
                    {activeSeries.notes}
                  </p>
                </div>

                {/* Digital Attestation Seal */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E8D9DE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.725rem', color: '#684F57' }}>
                    <div>Report electronically verified and electronically signed.</div>
                    <div style={{ fontFamily: 'monospace' }}>SHA-256 DIGITAL FINGERPRINT: 4092-B7C4-A19F-E8D2</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.4rem', color: '#8F2038' }}>
                      {activeSeries.physician.split(' ')[1]} {activeSeries.physician.split(' ')[2]}
                    </div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A0C12' }}>
                      {activeSeries.physician}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalImagingPage;
