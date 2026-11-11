import React from 'react';
import { useMedicationAlarm } from '../context/MedicationAlarmContext';
import { Bell, BellRing, Clock } from 'lucide-react';
import './NextMedicationPill.css';

export const NextMedicationPill: React.FC = () => {
  const { nextDose, openAlarmModal, isAlarmRinging } = useMedicationAlarm();

  if (!nextDose) {
    return (
      <button
        onClick={() => openAlarmModal()}
        className="next-med-pill next-med-pill--empty"
        title="All medications taken for today. Click to view schedule or set new alarm."
      >
        <span className="next-med-pill__icon">
          <Bell size={13} />
        </span>
        <span className="next-med-pill__label">Meds Complete</span>
      </button>
    );
  }

  const { medication, formattedCountdown, isDueNow, isOverdue } = nextDose;

  return (
    <button
      onClick={() => openAlarmModal(medication.id)}
      className={`next-med-pill ${isDueNow || isAlarmRinging ? 'next-med-pill--alerting' : ''} ${isOverdue ? 'next-med-pill--overdue' : ''}`}
      title={`Next: ${medication.name} (${medication.dosage}) scheduled at ${medication.scheduledTime}. Click to manage alarms.`}
    >
      <div className="next-med-pill__left">
        <span className="next-med-pill__pulse-dot" />
        <span className="next-med-pill__icon">
          {isAlarmRinging || isDueNow ? (
            <BellRing size={13} className="bell-shake-anim" />
          ) : (
            <Bell size={13} />
          )}
        </span>
        <span className="next-med-pill__name">{medication.name}</span>
      </div>

      <div className="next-med-pill__right">
        <Clock size={11} />
        <span className="next-med-pill__countdown">{formattedCountdown}</span>
      </div>
    </button>
  );
};

export default NextMedicationPill;

