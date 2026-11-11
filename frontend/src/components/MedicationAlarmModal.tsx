import React, { useState } from 'react';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import {
  X,
  Bell,
  BellRing,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  Plus,
  Play,
  Check,
  Pill,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import './MedicationAlarmModal.css';

export const MedicationAlarmModal: React.FC = () => {
  const {
    medications,
    nextDose,
    isAlarmModalOpen,
    closeAlarmModal,
    toggleAlarm,
    updateAlarmTime,
    markAsTaken,
    triggerTestAlarm,
    addCustomMedication,
    deleteMedication,
    soundEnabled,
    setSoundEnabled,
    browserNotificationsEnabled,
    requestBrowserNotifications,
    playChimeSound,
  } = useMedicationAlarm();

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedTime, setNewMedTime] = useState('12:00');
  const [newMedFrequency, setNewMedFrequency] = useState('Daily');
  const [newMedIndication, setNewMedIndication] = useState('');
  const [newMedInstructions, setNewMedInstructions] = useState('');
  const [notifMessage, setNotifMessage] = useState<string | null>(null);

  if (!isAlarmModalOpen) return null;

  const handleCreateMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedDosage.trim()) return;

    addCustomMedication({
      name: newMedName.trim(),
      dosage: newMedDosage.trim(),
      scheduledTime: newMedTime,
      frequency: `${newMedFrequency} • ${newMedTime}`,
      indication: newMedIndication.trim() || 'Health Optimization',
      instructions: newMedInstructions.trim() || 'Take as directed by your clinician.',
      prescriber: 'Patient Self-Managed / EHR Reconciled',
      organId: 'heart',
      alarmEnabled: true,
      pillColor: '#38BDF8',
    });

    setNewMedName('');
    setNewMedDosage('');
    setNewMedIndication('');
    setNewMedInstructions('');
    setShowAddForm(false);
    playChimeSound();
  };

  const handleRequestNotif = async () => {
    const granted = await requestBrowserNotifications();
    if (granted) {
      setNotifMessage('✓ Desktop Notifications Enabled!');
    } else {
      setNotifMessage('Notification permission not granted.');
    }
    setTimeout(() => setNotifMessage(null), 3000);
  };

  const takenCount = medications.filter((m) => m.takenToday).length;
  const adherencePct = Math.round((takenCount / (medications.length || 1)) * 100);

  return (
    <div className="med-modal-backdrop" onClick={closeAlarmModal}>
      <div
        className="med-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="med-hub-title"
      >
        {/* Top Header */}
        <div className="med-modal-header">
          <div className="med-modal-title-group">
            <div className="med-modal-icon-badge">
              <BellRing size={20} color="var(--color-heart-red)" />
            </div>
            <div>
              <h2 id="med-hub-title" className="med-modal-title">
                Medication Dose & Alarm Hub
              </h2>
              <div className="med-modal-subtitle">
                Longitudinal Chronopharmacology • Patient Sarah Mitchell (#4092-SM)
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button
              onClick={() => triggerTestAlarm()}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '0.75rem', gap: '0.35rem', display: 'flex', alignItems: 'center' }}
              title="Test Alarm Sound & Visual Alert"
            >
              <Play size={13} />
              <span>Test Alarm</span>
            </button>
            <button
              onClick={closeAlarmModal}
              className="med-modal-close-btn"
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="med-modal-body">
          {/* Hero: Next Scheduled Medicine Alarm */}
          {nextDose ? (
            <div className="med-hero-countdown-card">
              <div className="med-hero-top">
                <div className="med-hero-badge">
                  <span className="pulse-indicator" />
                  <span>NEXT UPCOMING DOSE</span>
                </div>
                <div className="med-hero-clock">
                  <Clock size={14} />
                  <span>Scheduled: {nextDose.medication.scheduledTime}</span>
                </div>
              </div>

              <div className="med-hero-main">
                <div className="med-hero-info">
                  <h3 className="med-hero-name">
                    {nextDose.medication.name}
                  </h3>
                  <div className="med-hero-meta">
                    <span className="med-hero-dosage">{nextDose.medication.dosage}</span>
                    <span>•</span>
                    <span className="med-hero-indication">{nextDose.medication.indication}</span>
                  </div>
                  <div className="med-hero-instructions">
                    {nextDose.medication.instructions}
                  </div>
                </div>

                <div className="med-hero-timer">
                  <div className="med-hero-timer-label">Time Remaining</div>
                  <div className="med-hero-timer-value">
                    {nextDose.formattedCountdown}
                  </div>
                  <button
                    onClick={() => markAsTaken(nextDose.medication.id)}
                    className="btn btn-primary btn-sm med-hero-take-btn"
                  >
                    <Check size={14} /> Mark Taken Now
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="med-hero-countdown-card med-hero-complete">
              <CheckCircle2 size={36} color="var(--color-success, #10b981)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff' }}>
                  All Scheduled Doses Completed!
                </h3>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
                  100% medication adherence achieved today. Next dose cycle resumes tomorrow morning.
                </p>
              </div>
            </div>
          )}

          {/* Controls Bar: Sound, Notifications & Adherence */}
          <div className="med-toolbar">
            <div className="med-toolbar-controls">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`med-tool-pill ${soundEnabled ? 'active' : ''}`}
              >
                {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                <span>{soundEnabled ? 'Alarm Sound: ON' : 'Alarm Sound: OFF'}</span>
              </button>

              <button
                onClick={handleRequestNotif}
                className={`med-tool-pill ${browserNotificationsEnabled ? 'active' : ''}`}
              >
                <Bell size={14} />
                <span>
                  {browserNotificationsEnabled
                    ? 'Desktop Push: Active'
                    : 'Enable Push Notifications'}
                </span>
              </button>
            </div>

            <div className="med-adherence-pill">
              <ShieldCheck size={14} color="var(--color-success, #10b981)" />
              <span>Today's Adherence: {takenCount}/{medications.length} ({adherencePct}%)</span>
            </div>
          </div>

          {notifMessage && (
            <div className="med-notif-toast">
              {notifMessage}
            </div>
          )}

          {/* List of Medications with Time Adjustment & Alarm Switch */}
          <div className="med-list-section">
            <div className="med-section-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Pill size={15} color="var(--color-heart-red)" />
                <span className="med-section-title">Active Prescription Alarms</span>
              </div>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', gap: '0.35rem' }}
              >
                <Plus size={14} /> {showAddForm ? 'Cancel' : 'Add Medicine Alarm'}
              </button>
            </div>

            {/* Add Medicine Expandable Form */}
            {showAddForm && (
              <form onSubmit={handleCreateMedicine} className="med-add-form">
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-warm-white)', marginBottom: '0.75rem' }}>
                  Create New Medication Dose Alarm
                </div>
                <div className="med-form-grid">
                  <div>
                    <label className="med-form-label">Medication Name</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Metformin, CoQ10"
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      required
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>
                  <div>
                    <label className="med-form-label">Dosage & Route</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. 500 mg PO Tablet"
                      value={newMedDosage}
                      onChange={(e) => setNewMedDosage(e.target.value)}
                      required
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                    />
                  </div>
                  <div>
                    <label className="med-form-label">Alarm Time</label>
                    <input
                      type="time"
                      className="input-field"
                      value={newMedTime}
                      onChange={(e) => setNewMedTime(e.target.value)}
                      required
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', colorScheme: 'dark' }}
                    />
                  </div>
                  <div>
                    <label className="med-form-label">Frequency</label>
                    <select
                      className="input-field"
                      value={newMedFrequency}
                      onChange={(e) => setNewMedFrequency(e.target.value)}
                      style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', colorScheme: 'dark' }}
                    >
                      <option value="Daily Morning">Daily Morning</option>
                      <option value="Daily with Lunch">Daily with Lunch</option>
                      <option value="Nightly at Bedtime">Nightly at Bedtime</option>
                      <option value="Twice Daily">Twice Daily</option>
                      <option value="PRN As Needed">PRN As Needed</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: '0.65rem' }}>
                  <label className="med-form-label">Clinical Indication (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Glycemic Regulation, Neuroprotection"
                    value={newMedIndication}
                    onChange={(e) => setNewMedIndication(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  />
                </div>

                <div style={{ marginTop: '0.65rem' }}>
                  <label className="med-form-label">Patient Instructions (Optional)</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="e.g. Take with food and 8 oz water"
                    value={newMedInstructions}
                    onChange={(e) => setNewMedInstructions(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-ghost btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Alarm Schedule
                  </button>
                </div>
              </form>
            )}

            {/* Med cards */}
            <div className="med-cards-container">
              {medications.map((med) => {
                const isNext = nextDose?.medication.id === med.id;
                return (
                  <div
                    key={med.id}
                    className={`med-item-card ${isNext ? 'med-item-card--next' : ''} ${med.takenToday ? 'med-item-card--taken' : ''}`}
                  >
                    <div className="med-item-left">
                      <div
                        className="med-item-pill-icon"
                        style={{ borderLeftColor: med.pillColor }}
                      >
                        <Pill size={18} color="var(--color-heart-red)" />
                      </div>

                      <div>
                        <div className="med-item-title-row">
                          <span className="med-item-name">{med.name}</span>
                          <span className="med-item-dosage">({med.dosage})</span>
                          {isNext && <span className="badge badge-crimson">Next Dose</span>}
                          {med.takenToday && <span className="badge badge-success">✓ Completed</span>}
                        </div>

                        <div className="med-item-meta">
                          <span>{med.indication}</span>
                          <span>•</span>
                          <span>{med.prescriber}</span>
                        </div>

                        <div className="med-item-instructions">
                          {med.instructions}
                        </div>
                      </div>
                    </div>

                    <div className="med-item-right">
                      {/* Scheduled Time Input */}
                      <div className="med-time-editor">
                        <label className="med-time-label">Alarm Time</label>
                        <input
                          type="time"
                          value={med.scheduledTime}
                          onChange={(e) => updateAlarmTime(med.id, e.target.value)}
                          className="med-time-input"
                          title="Click to adjust scheduled alarm time"
                        />
                      </div>

                      {/* Action buttons */}
                      <div className="med-item-actions">
                        <button
                          onClick={() => toggleAlarm(med.id)}
                          className={`btn-alarm-toggle ${med.alarmEnabled ? 'active' : ''}`}
                          title={med.alarmEnabled ? 'Alarm Active (Click to disable)' : 'Alarm Disabled (Click to activate)'}
                        >
                          {med.alarmEnabled ? <BellRing size={14} /> : <Bell size={14} />}
                          <span>{med.alarmEnabled ? 'Active' : 'Off'}</span>
                        </button>

                        <button
                          onClick={() => markAsTaken(med.id)}
                          className={`btn btn-sm ${med.takenToday ? 'btn-ghost' : 'btn-primary'}`}
                          style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                          title={med.takenToday ? 'Dose confirmed taken' : 'Mark dose as taken'}
                        >
                          {med.takenToday ? '✓ Done' : 'Take'}
                        </button>

                        <button
                          onClick={() => triggerTestAlarm(med.id)}
                          className="btn-icon-test"
                          title="Test ring this medicine"
                        >
                          <Play size={12} />
                        </button>

                        {med.id.startsWith('med-custom-') && (
                          <button
                            onClick={() => deleteMedication(med.id)}
                            className="btn-icon-delete"
                            title="Remove medication"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationAlarmModal;
