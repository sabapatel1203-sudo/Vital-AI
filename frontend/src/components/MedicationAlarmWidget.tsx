import React from 'react';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import { Clock, Check, Play, Sliders, Pill } from 'lucide-react';
import './MedicationAlarmWidget.css';

interface MedicationAlarmWidgetProps {
  compact?: boolean;
}

export const MedicationAlarmWidget: React.FC<MedicationAlarmWidgetProps> = ({ compact = false }) => {
  const {
    nextDose,
    openAlarmModal,
    markAsTaken,
    triggerTestAlarm,
    isAlarmRinging,
  } = useMedicationAlarm();

  if (!nextDose) {
    return (
      <div className={`med-alarm-widget med-alarm-widget--complete ${compact ? 'med-alarm-widget--compact' : ''}`}>
        <div className="med-alarm-widget__left">
          <div className="med-alarm-widget__icon med-alarm-widget__icon--done">
            <Check size={16} />
          </div>
          <div>
            <div className="med-alarm-widget__title">All Today's Doses Completed</div>
            <div className="med-alarm-widget__sub">Next cycle begins tomorrow 08:00 AM</div>
          </div>
        </div>
        <button
          onClick={() => openAlarmModal()}
          className="btn btn-secondary btn-sm"
          style={{ fontSize: '0.725rem', padding: '0.35rem 0.65rem' }}
        >
          View Schedule
        </button>
      </div>
    );
  }

  const { medication, formattedCountdown, isDueNow } = nextDose;

  return (
    <div
      className={`med-alarm-widget ${isDueNow || isAlarmRinging ? 'med-alarm-widget--alerting' : ''} ${compact ? 'med-alarm-widget--compact' : ''}`}
    >
      <div className="med-alarm-widget__top">
        <div className="med-alarm-widget__badge">
          <span className="pulse-indicator" />
          <span>NEXT DOSE ALARM</span>
        </div>

        <div className="med-alarm-widget__countdown">
          <Clock size={12} />
          <span>{formattedCountdown}</span>
        </div>
      </div>

      <div className="med-alarm-widget__content">
        <div className="med-alarm-widget__left">
          <div className="med-alarm-widget__icon">
            <Pill size={16} color="var(--color-heart-red)" />
          </div>
          <div>
            <div className="med-alarm-widget__name">
              {medication.name} <span className="med-alarm-widget__dosage">({medication.dosage})</span>
            </div>
            <div className="med-alarm-widget__sub">
              Scheduled for <strong>{medication.scheduledTime}</strong> • {medication.indication}
            </div>
          </div>
        </div>

        <div className="med-alarm-widget__actions">
          <button
            onClick={() => markAsTaken(medication.id)}
            className="btn btn-primary btn-sm med-alarm-widget__btn-take"
            title="Mark as taken"
          >
            <Check size={13} />
            <span>Take Now</span>
          </button>

          <button
            onClick={() => triggerTestAlarm(medication.id)}
            className="btn-widget-icon"
            title="Test alarm chime"
          >
            <Play size={12} />
          </button>

          <button
            onClick={() => openAlarmModal(medication.id)}
            className="btn-widget-icon"
            title="Adjust alarm schedule & settings"
          >
            <Sliders size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicationAlarmWidget;
