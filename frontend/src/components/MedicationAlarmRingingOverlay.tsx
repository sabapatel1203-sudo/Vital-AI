import React from 'react';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import { BellRing, Check, Clock, Volume2, VolumeX, AlertCircle, X } from 'lucide-react';
import './MedicationAlarmRingingOverlay.css';

export const MedicationAlarmRingingOverlay: React.FC = () => {
  const {
    isAlarmRinging,
    ringingMedication,
    markAsTaken,
    snoozeAlarm,
    dismissAlarm,
    soundEnabled,
    setSoundEnabled,
  } = useMedicationAlarm();

  if (!isAlarmRinging || !ringingMedication) return null;

  return (
    <div className="alarm-ringing-backdrop">
      <div className="alarm-ringing-dialog" role="dialog" aria-modal="true" aria-labelledby="alarm-modal-title">
        {/* Pulsing Alert Radiance */}
        <div className="alarm-ringing-radiance" />

        {/* Top Header */}
        <div className="alarm-ringing-header">
          <div className="alarm-badge">
            <span className="alarm-beacon" />
            <span>ACTIVE MEDICAL DOSE ALARM</span>
          </div>

          <div className="alarm-header-actions">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="alarm-tool-btn"
              title={soundEnabled ? 'Mute Chime' : 'Unmute Chime'}
            >
              {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} color="#f87171" />}
            </button>
            <button
              onClick={dismissAlarm}
              className="alarm-tool-btn"
              title="Close Alarm"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Hero Alert Graphic */}
        <div className="alarm-icon-container">
          <div className="alarm-pulse-ring ring-1" />
          <div className="alarm-pulse-ring ring-2" />
          <div className="alarm-pulse-ring ring-3" />
          <div className="alarm-center-icon">
            <BellRing size={42} className="bell-shake-anim" />
          </div>
        </div>

        {/* Medicine Details */}
        <div className="alarm-body-content">
          <div className="alarm-scheduled-tag">
            <Clock size={13} />
            <span>Scheduled for {ringingMedication.scheduledTime} ({ringingMedication.frequency})</span>
          </div>

          <h2 id="alarm-modal-title" className="alarm-med-name">
            {ringingMedication.name}
          </h2>
          <div className="alarm-med-dosage">{ringingMedication.dosage}</div>

          <div className="alarm-indication-badge">
            Target Indication: <strong>{ringingMedication.indication}</strong>
          </div>

          <div className="alarm-instruction-box">
            <AlertCircle size={15} color="var(--color-brain-rose)" />
            <span>{ringingMedication.instructions}</span>
          </div>

          <div className="alarm-prescriber-note">
            Prescribing Physician: {ringingMedication.prescriber}
          </div>
        </div>

        {/* Action Controls */}
        <div className="alarm-action-grid">
          <button
            onClick={() => markAsTaken(ringingMedication.id)}
            className="alarm-btn-take"
          >
            <Check size={18} />
            <span>Mark Dose Taken & Log Adherence</span>
          </button>

          <div className="alarm-secondary-row">
            <button
              onClick={() => snoozeAlarm(ringingMedication.id, 10)}
              className="alarm-btn-snooze"
            >
              <Clock size={15} />
              <span>Snooze 10 Mins</span>
            </button>

            <button
              onClick={() => snoozeAlarm(ringingMedication.id, 30)}
              className="alarm-btn-snooze"
            >
              <Clock size={15} />
              <span>Snooze 30 Mins</span>
            </button>

            <button
              onClick={dismissAlarm}
              className="alarm-btn-dismiss"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationAlarmRingingOverlay;

