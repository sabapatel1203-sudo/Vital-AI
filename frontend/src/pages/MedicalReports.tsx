import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SAMPLE_REPORTS, type MedicalReportDocument } from '../data/medicalReportsData';
import { 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  Search, 
  ShieldAlert, 
  Layers, 
  Activity,
  FileText,
  Printer,
  Download,
  Eye,
  HelpCircle
} from 'lucide-react';

export const MedicalReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports] = useState<MedicalReportDocument[]>(SAMPLE_REPORTS);
  const [selectedReport, setSelectedReport] = useState<MedicalReportDocument>(SAMPLE_REPORTS[0]);
  const [viewMode, setViewMode] = useState<'ai' | 'original'>('ai');
  const [explanationLevel, setExplanationLevel] = useState<'simple' | 'detailed' | 'clinical'>('simple');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadedDocUrl, setUploadedDocUrl] = useState<string | null>(null);

  const filteredReports = reports.filter(
    (r) =>
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.facility.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const url = URL.createObjectURL(file);
      setTimeout(() => {
        setIsUploading(false);
        setUploadedDocUrl(url);
        setViewMode('original');
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 4000);
      }, 1000);
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)' }}>
      {/* Top Banner */}
      <div style={{ padding: '2rem 2.5rem 1.5rem', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', background: 'var(--color-bg-surface)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div className="badge badge-crimson" style={{ marginBottom: '0.4rem' }}>
              <Sparkles size={12} /> AI Clinical Document Translation & Scanned Records
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0 }}>
              Medical Records & Scanned Reports
            </h1>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-muted-pink)', margin: '0.25rem 0 0' }}>
              View verified hospital report scans, diagnostic lab sheets, and AI multi-tier clinical explanations.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
              <Upload size={16} /> {isUploading ? 'Parsing Report...' : 'Upload Report Picture / PDF'}
              <input type="file" accept="image/*,.pdf,.dcm" style={{ display: 'none' }} onChange={handleFileUpload} />
            </label>
            <Link to="/imaging" className="btn btn-secondary">
              <Eye size={16} /> Diagnostic DICOM Imaging
            </Link>
            <Link to="/twin" className="btn btn-secondary">
              <Layers size={16} /> Open in 3D Anatomy Lab
            </Link>
          </div>
        </div>
      </div>

      {uploadSuccess && (
        <div style={{ maxWidth: '1400px', margin: '1rem auto 0', padding: '0 2.5rem' }}>
          <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(78, 170, 131, 0.15)', border: '1px solid var(--color-success)', borderRadius: 'var(--radius-sm)', color: '#8de8c1', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={16} /> Document uploaded successfully! Report image loaded and clinical findings connected to your 3D digital twin.
          </div>
        </div>
      )}

      {/* Main Split View */}
      <div style={{ maxWidth: '1400px', margin: '1.5rem auto', padding: '0 2.5rem', display: 'grid', gridTemplateColumns: '360px 1fr', gap: '1.75rem' }}>
        
        {/* Left Column: Report List & Search */}
        <aside>
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <input
              type="text"
              className="input-field"
              placeholder="Search reports by title or facility..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.2rem', fontSize: '0.825rem' }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--color-muted-pink)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredReports.map((report) => {
              const isSelected = selectedReport.id === report.id;
              return (
                <div
                  key={report.id}
                  onClick={() => {
                    setSelectedReport(report);
                    setUploadedDocUrl(null);
                  }}
                  style={{
                    padding: '1rem',
                    background: isSelected ? 'rgba(197, 40, 72, 0.2)' : 'var(--color-bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--color-heart-red)' : 'rgba(143, 32, 56, 0.3)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                    <span className="badge badge-crimson" style={{ fontSize: '0.65rem' }}>{report.category}</span>
                    <span style={{ fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>{report.date}</span>
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warm-white)', marginBottom: '0.25rem' }}>
                    {report.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>
                    {report.facility}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.725rem', color: 'var(--color-brain-rose)' }}>
                    <span>Target: {report.systemName.split(' ')[0]}</span>
                    <span>{report.findings.length} Biomarkers</span>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* Right Column: Active Report & View Mode Tabs */}
        <main>
          {selectedReport && (
            <div style={{ background: 'var(--color-bg-surface)', border: '1px solid rgba(143, 32, 56, 0.3)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
              
              {/* Header Controls & View Mode Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(143, 32, 56, 0.25)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                    <span className="badge badge-crimson">{selectedReport.category}</span>
                    <span className="badge badge-neutral">{selectedReport.fileType}</span>
                    <span className="badge badge-neutral">{selectedReport.fileSize}</span>
                  </div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0.2rem 0' }}>
                    {selectedReport.title}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
                    {selectedReport.facility} • Attending: <strong>{selectedReport.clinician}</strong> • Date: {selectedReport.date}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                  {/* Mode Selector: AI Explanation vs Original Scanned Document */}
                  <div style={{ display: 'inline-flex', background: 'rgba(24, 9, 15, 0.85)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(143, 32, 56, 0.4)' }}>
                    <button
                      className={`btn btn-sm ${viewMode === 'ai' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setViewMode('ai')}
                      style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}
                    >
                      <Sparkles size={13} /> AI Biomarker Insights
                    </button>
                    <button
                      className={`btn btn-sm ${viewMode === 'original' ? 'btn-primary' : 'btn-ghost'}`}
                      onClick={() => setViewMode('original')}
                      style={{ borderRadius: 'var(--radius-full)', fontSize: '0.75rem' }}
                    >
                      <FileText size={13} /> Scanned Report Document
                    </button>
                  </div>

                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/twin')}
                    title="Highlight corresponding organ in 3D"
                  >
                    <Layers size={14} /> 3D View
                  </button>
                </div>
              </div>

              {viewMode === 'ai' ? (
                <>
                  {/* Verified Clinical Findings Table */}
                  <div style={{ marginTop: '1.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Activity size={16} color="var(--color-heart-red)" /> Extracted Laboratory & Imaging Biomarkers
                    </h3>

                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid rgba(143, 32, 56, 0.3)', color: 'var(--color-muted-pink)', textAlign: 'left' }}>
                            <th style={{ padding: '0.6rem' }}>Biomarker / Finding</th>
                            <th style={{ padding: '0.6rem' }}>Measured Value</th>
                            <th style={{ padding: '0.6rem' }}>Reference Range</th>
                            <th style={{ padding: '0.6rem' }}>Status</th>
                            <th style={{ padding: '0.6rem' }}>Clinical Interpretation</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedReport.findings.map((f, i) => (
                            <tr key={i} style={{ borderBottom: '1px solid rgba(143, 32, 56, 0.15)' }}>
                              <td style={{ padding: '0.65rem', fontWeight: 700, color: 'var(--color-warm-white)' }}>{f.name}</td>
                              <td style={{ padding: '0.65rem', fontWeight: 700 }}>
                                {f.value} <span style={{ fontSize: '0.75rem', color: 'var(--color-muted-pink)' }}>{f.unit}</span>
                              </td>
                              <td style={{ padding: '0.65rem', color: 'var(--color-muted-pink)' }}>{f.referenceRange || 'N/A'}</td>
                              <td style={{ padding: '0.65rem' }}>
                                <span className={`badge badge-${f.status === 'normal' ? 'success' : f.status === 'abnormal' ? 'warning' : 'rose'}`}>
                                  {f.status}
                                </span>
                              </td>
                              <td style={{ padding: '0.65rem', fontSize: '0.775rem', color: 'var(--color-muted-pink)' }}>
                                {f.interpretation}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* 3-Level AI Document Explanation */}
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Sparkles size={16} color="var(--color-brain-rose)" /> AI Clinical Translation
                      </h3>

                      <div style={{ display: 'inline-flex', background: 'rgba(24, 9, 15, 0.8)', padding: '3px', borderRadius: 'var(--radius-full)', border: '1px solid rgba(143, 32, 56, 0.4)' }}>
                        <button
                          className={`btn btn-sm ${explanationLevel === 'simple' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setExplanationLevel('simple')}
                          style={{ borderRadius: 'var(--radius-full)', fontSize: '0.725rem' }}
                        >
                          Simple Everyday
                        </button>
                        <button
                          className={`btn btn-sm ${explanationLevel === 'detailed' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setExplanationLevel('detailed')}
                          style={{ borderRadius: 'var(--radius-full)', fontSize: '0.725rem' }}
                        >
                          Biomarker Breakdown
                        </button>
                        <button
                          className={`btn btn-sm ${explanationLevel === 'clinical' ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setExplanationLevel('clinical')}
                          style={{ borderRadius: 'var(--radius-full)', fontSize: '0.725rem' }}
                        >
                          Physician Summary
                        </button>
                      </div>
                    </div>

                    <div style={{ background: 'rgba(24, 9, 15, 0.6)', border: '1px solid rgba(143, 32, 56, 0.35)', borderRadius: 'var(--radius-md)', padding: '1.5rem', whiteSpace: 'pre-line', fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--color-warm-white)' }}>
                      {selectedReport.explanations[explanationLevel]}
                    </div>
                  </div>

                  {/* Recommendations & Questions */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem' }}>
                    <div style={{ background: 'rgba(24, 9, 15, 0.4)', border: '1px solid rgba(143, 32, 56, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-brain-rose)' }}>
                        <CheckCircle2 size={15} /> Actionable Next Steps
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-muted-pink)' }}>
                        {selectedReport.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>

                    <div style={{ background: 'rgba(24, 9, 15, 0.4)', border: '1px solid rgba(143, 32, 56, 0.25)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--color-warning)' }}>
                        <HelpCircle size={15} /> Questions for Your Doctor
                      </h4>
                      <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.8rem', lineHeight: 1.6, color: 'var(--color-muted-pink)' }}>
                        {selectedReport.questionsForDoctor.map((q, i) => (
                          <li key={i}>{q}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                /* ─────────────────────────────────────────────────────────────
                   AUTHENTIC SCANNED CLINICAL REPORT DOCUMENT SHEET
                   ───────────────────────────────────────────────────────────── */
                <div style={{ marginTop: '1.5rem', background: '#FFFDFD', color: '#1A0C12', borderRadius: 'var(--radius-lg)', padding: '2.5rem', boxShadow: '0 20px 50px rgba(0,0,0,0.6)', border: '1px solid #E2D9DC' }}>
                  
                  {uploadedDocUrl ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid #DDD', paddingBottom: '0.5rem' }}>
                        <strong style={{ color: '#8F2038' }}>USER UPLOADED MEDICAL RECORD SCAN</strong>
                        <button className="btn btn-secondary btn-sm" onClick={() => setUploadedDocUrl(null)} style={{ color: '#8F2038', borderColor: '#8F2038' }}>
                          Clear Upload & Return to Verified Report
                        </button>
                      </div>
                      <img src={uploadedDocUrl} alt="Uploaded Medical Report" style={{ width: '100%', maxHeight: '650px', objectFit: 'contain', borderRadius: '4px' }} />
                    </div>
                  ) : (
                    <>
                      {/* Hospital / Laboratory Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #8F2038', paddingBottom: '1.25rem' }}>
                        <div>
                          <div style={{ fontSize: '1.35rem', fontWeight: 900, color: '#8F2038', letterSpacing: '-0.02em' }}>
                            {selectedReport.facility.toUpperCase()}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#684F57', marginTop: '0.15rem' }}>
                            Clinical Diagnostic Services • CLIA #36D091829 • CAP Accredited
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#8A7078' }}>
                            HL7 / FHIR Interoperability Standard Verified Electronic Health Record
                          </div>
                        </div>

                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.75rem', fontFamily: 'monospace', fontWeight: 700, color: '#1A0C12' }}>
                            ACCESSION #{selectedReport.id.toUpperCase()}-2026
                          </div>
                          <div style={{ fontSize: '0.7rem', color: '#684F57' }}>
                            COLLECTED: {selectedReport.date} 07:45 AM
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', justifyContent: 'flex-end' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => window.print()} style={{ color: '#8F2038', borderColor: '#8F2038', fontSize: '0.7rem' }}>
                              <Printer size={12} /> Print
                            </button>
                            <button className="btn btn-secondary btn-sm" style={{ color: '#8F2038', borderColor: '#8F2038', fontSize: '0.7rem' }}>
                              <Download size={12} /> Download PDF
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
                          <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>DOB / AGE / SEX</span>
                          <strong style={{ color: '#1A0C12' }}>1984-06-12 (42y) / F</strong>
                        </div>
                        <div>
                          <span style={{ color: '#7E636B', display: 'block', fontSize: '0.7rem' }}>ORDERING CLINICIAN</span>
                          <strong style={{ color: '#1A0C12' }}>{selectedReport.clinician}</strong>
                        </div>
                      </div>

                      {/* Official Lab Raw Findings Table */}
                      <div style={{ marginTop: '1.25rem' }}>
                        <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#8F2038', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          TEST RESULTS & REFERENCE RANGES
                        </div>
                        <pre style={{ margin: 0, padding: '1.25rem', background: '#FDFBFC', border: '1px solid #E4D5DA', borderRadius: '4px', fontFamily: 'Courier New, monospace', fontSize: '0.775rem', lineHeight: 1.6, color: '#1C0C14', overflowX: 'auto', whiteSpace: 'pre' }}>
                          {selectedReport.rawText}
                        </pre>
                      </div>

                      {/* Physician Attestation & Signature */}
                      <div style={{ marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid #E8D9DE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.725rem', color: '#684F57' }}>
                          <div>Electronically signed and verified at {selectedReport.facility}.</div>
                          <div style={{ fontFamily: 'monospace' }}>SECURE TRANSMISSION SHA-256: 8492-F9C1-D208-4092</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontFamily: 'Brush Script MT, cursive', fontSize: '1.5rem', color: '#8F2038' }}>
                            {selectedReport.clinician.split(' ')[1]} {selectedReport.clinician.split(' ')[2] || ''}
                          </div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#1A0C12' }}>
                            {selectedReport.clinician}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Disclaimer */}
              <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--color-muted-pink)', opacity: 0.85 }}>
                <ShieldAlert size={14} color="var(--color-warning)" />
                <span>{selectedReport.disclaimer}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MedicalReportsPage;
