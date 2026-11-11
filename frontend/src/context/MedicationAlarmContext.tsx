import React, { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from 'react';

export interface MedicationAlarm {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string; // "HH:MM" in 24-hr format
  frequency: string;
  indication: string;
  instructions: string;
  prescriber: string;
  organId: string;
  alarmEnabled: boolean;
  takenToday: boolean;
  lastTakenAt?: string;
  pillColor: string;
  snoozedUntil?: number; // timestamp
}

export interface NextDoseInfo {
  medication: MedicationAlarm;
  hours: number;
  minutes: number;
  seconds: number;
  totalSecondsRemaining: number;
  formattedCountdown: string;
  isDueNow: boolean;
  isOverdue: boolean;
}

interface MedicationAlarmContextType {
  medications: MedicationAlarm[];
  nextDose: NextDoseInfo | null;
  isAlarmModalOpen: boolean;
  isAlarmRinging: boolean;
  ringingMedication: MedicationAlarm | null;
  soundEnabled: boolean;
  browserNotificationsEnabled: boolean;
  openAlarmModal: (focusMedId?: string) => void;
  closeAlarmModal: () => void;
  toggleAlarm: (id: string) => void;
  updateAlarmTime: (id: string, newTime: string) => void;
  markAsTaken: (id: string) => void;
  snoozeAlarm: (id: string, minutes?: number) => void;
  dismissAlarm: () => void;
  triggerTestAlarm: (medId?: string) => void;
  addCustomMedication: (med: Omit<MedicationAlarm, 'id' | 'takenToday'>) => void;
  deleteMedication: (id: string) => void;
  setSoundEnabled: (enabled: boolean) => void;
  requestBrowserNotifications: () => Promise<boolean>;
  playChimeSound: () => void;
}

const INITIAL_MEDICATIONS: MedicationAlarm[] = [
  {
    id: 'med-atorvastatin',
    name: 'Atorvastatin',
    dosage: '20 mg PO',
    scheduledTime: '21:00',
    frequency: 'Nightly • 21:00 PM',
    indication: 'Atherosclerotic Plaque Stabilization',
    instructions: 'Take at bedtime. Coincides with hepatic nocturnal HMG-CoA reductase peak.',
    prescriber: 'Dr. James Chen, MD (Cardiology)',
    organId: 'heart',
    alarmEnabled: true,
    takenToday: false,
    pillColor: '#F8FAFC',
  },
  {
    id: 'med-lisinopril',
    name: 'Lisinopril',
    dosage: '10 mg PO',
    scheduledTime: '08:00',
    frequency: 'Daily • 08:00 AM',
    indication: 'Primary Essential Hypertension (Cardioprotection)',
    instructions: 'Take with full glass of water. Maintain consistent morning timing.',
    prescriber: 'Dr. James Chen, MD (Cardiology)',
    organId: 'heart',
    alarmEnabled: true,
    takenToday: true,
    lastTakenAt: 'Today at 08:02 AM',
    pillColor: '#FDA4AF',
  },
  {
    id: 'med-omega3',
    name: 'Omega-3 EPA/DHA',
    dosage: '1,000 mg Softgel',
    scheduledTime: '13:00',
    frequency: 'Daily with Lunch • 13:00 PM',
    indication: 'Vascular Endothelial Health & Triglyceride Support',
    instructions: 'Take with meal for optimal lipid bioavailability.',
    prescriber: 'Cardiology Preventive Care',
    organId: 'heart',
    alarmEnabled: true,
    takenToday: false,
    pillColor: '#FBBF24',
  },
  {
    id: 'med-magnesium',
    name: 'Magnesium Glycinate',
    dosage: '400 mg PO',
    scheduledTime: '22:00',
    frequency: 'Nightly • 22:00 PM',
    indication: 'Trapezius Myofascial Relaxation & Sleep Architecture',
    instructions: 'Take 30 minutes before sleep for optimal deep REM cycle recovery.',
    prescriber: 'Dr. Karen Vance, MD (Neurology)',
    organId: 'muscular',
    alarmEnabled: true,
    takenToday: false,
    pillColor: '#C084FC',
  },
  {
    id: 'med-famotidine',
    name: 'Famotidine',
    dosage: '20 mg PO',
    scheduledTime: '19:30',
    frequency: 'PRN As Needed • 19:30 PM',
    indication: 'Antral Gastric Mucosal Protection',
    instructions: 'Take 30-60 minutes prior to evening meal if upper abdominal discomfort occurs.',
    prescriber: 'Dr. Anita Patel, MD (Gastroenterology)',
    organId: 'stomach',
    alarmEnabled: false,
    takenToday: false,
    pillColor: '#FDE047',
  },
];

export const MedicationAlarmContext = createContext<MedicationAlarmContextType | null>(null);

/* ─────────────────────────────────────────────────────────────
   Native Web Audio API Harmonic Chime Synthesizer
   Clean, soothing, medical tri-tone chime (C5 - E5 - G5)
   ───────────────────────────────────────────────────────────── */
function synthesizeMedicalChime() {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    const now = ctx.currentTime;

    const chords = [
      { freq: 523.25, time: 0.00, dur: 0.9, gain: 0.25 }, // C5
      { freq: 659.25, time: 0.18, dur: 1.1, gain: 0.30 }, // E5
      { freq: 783.99, time: 0.36, dur: 1.4, gain: 0.35 }, // G5
      { freq: 1046.50, time: 0.54, dur: 1.8, gain: 0.40 }, // C6 bell shimmer
    ];

    chords.forEach(({ freq, time, dur, gain }) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + time);

      gainNode.gain.setValueAtTime(0.001, now + time);
      gainNode.gain.exponentialRampToValueAtTime(gain, now + time + 0.04);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + time + dur);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now + time);
      osc.stop(now + time + dur);
    });
  } catch (err) {
    console.warn('AudioContext playback warning:', err);
  }
}

export const MedicationAlarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<MedicationAlarm[]>(() => {
    const saved = localStorage.getItem('vitalis_med_alarms_v1');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return INITIAL_MEDICATIONS;
  });

  const [isAlarmModalOpen, setIsAlarmModalOpen] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [ringingMedication, setRingingMedication] = useState<MedicationAlarm | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [browserNotificationsEnabled, setBrowserNotificationsEnabled] = useState(
    typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted'
  );
  const [nextDose, setNextDose] = useState<NextDoseInfo | null>(null);

  const chimeIntervalRef = useRef<number | null>(null);
  const triggeredAlarmsRef = useRef<Set<string>>(new Set());

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('vitalis_med_alarms_v1', JSON.stringify(medications));
  }, [medications]);

  const playChimeSound = useCallback(() => {
    if (soundEnabled) {
      synthesizeMedicalChime();
    }
  }, [soundEnabled]);

  // Request browser notification permission
  const requestBrowserNotifications = async (): Promise<boolean> => {
    if (!('Notification' in window)) return false;
    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setBrowserNotificationsEnabled(granted);
      return granted;
    } catch {
      return false;
    }
  };

  // Sound loop while alarm is ringing
  useEffect(() => {
    if (isAlarmRinging && soundEnabled) {
      playChimeSound();
      chimeIntervalRef.current = window.setInterval(() => {
        playChimeSound();
      }, 3500);
    } else {
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
    }
    return () => {
      if (chimeIntervalRef.current) {
        clearInterval(chimeIntervalRef.current);
        chimeIntervalRef.current = null;
      }
    };
  }, [isAlarmRinging, soundEnabled, playChimeSound]);

  // Dynamic live countdown & trigger calculation
  useEffect(() => {
    const calculateNextDose = () => {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMins = now.getMinutes();
      const currentSecs = now.getSeconds();
      const nowTotalSecs = currentHours * 3600 + currentMins * 60 + currentSecs;

      // Filter medications that have alarms enabled and not yet taken today
      const activeMeds = medications.filter((m) => m.alarmEnabled && !m.takenToday);

      if (activeMeds.length === 0) {
        setNextDose(null);
        return;
      }

      let closestMed: MedicationAlarm | null = null;
      let minRemainingSeconds = Infinity;
      let isDue = false;
      let isOverdue = false;

      activeMeds.forEach((med) => {
        // If snoozed, check snooze timestamp
        if (med.snoozedUntil && med.snoozedUntil > Date.now()) {
          const diffSec = Math.max(0, Math.floor((med.snoozedUntil - Date.now()) / 1000));
          if (diffSec < minRemainingSeconds) {
            minRemainingSeconds = diffSec;
            closestMed = med;
          }
          return;
        }

        const [schedH, schedM] = med.scheduledTime.split(':').map(Number);
        const schedTotalSecs = schedH * 3600 + schedM * 60;

        let diffSec = schedTotalSecs - nowTotalSecs;

        // If the scheduled time today has already passed by more than 15 minutes,
        // it moves to tomorrow (+ 24 hours) unless it's currently overdue by <= 45 mins
        if (diffSec < -2700) {
          diffSec += 86400; // Tomorrow
        } else if (diffSec < 0 && diffSec >= -2700) {
          // Overdue within last 45 minutes
          isOverdue = true;
          diffSec = 0;
        }

        if (diffSec < minRemainingSeconds) {
          minRemainingSeconds = diffSec;
          closestMed = med;
        }
      });

      if (!closestMed) {
        setNextDose(null);
        return;
      }

      // Check if alarm should ring (remaining <= 0 and hasn't been triggered in this minute)
      const targetMed: MedicationAlarm = closestMed;
      const alarmKey = `${targetMed.id}-${targetMed.scheduledTime}-${now.getHours()}:${now.getMinutes()}`;

      if (minRemainingSeconds === 0 && !triggeredAlarmsRef.current.has(alarmKey)) {
        triggeredAlarmsRef.current.add(alarmKey);
        setIsAlarmRinging(true);
        setRingingMedication(targetMed);

        // Native browser notification if allowed
        if (browserNotificationsEnabled && 'Notification' in window) {
          try {
            new Notification(`⏰ Vitalis Dose Alarm: ${targetMed.name}`, {
              body: `Scheduled Dose: ${targetMed.dosage} (${targetMed.scheduledTime}). ${targetMed.instructions}`,
              icon: '/favicon.ico',
            });
          } catch {
            // Ignore notification error
          }
        }
      }

      isDue = minRemainingSeconds <= 30;

      const hrs = Math.floor(minRemainingSeconds / 3600);
      const mins = Math.floor((minRemainingSeconds % 3600) / 60);
      const secs = minRemainingSeconds % 60;

      let countdownLabel = '';
      if (isDue) {
        countdownLabel = 'Due NOW';
      } else if (hrs > 0) {
        countdownLabel = `In ${hrs}h ${mins}m ${secs}s`;
      } else if (mins > 0) {
        countdownLabel = `In ${mins}m ${secs}s`;
      } else {
        countdownLabel = `In ${secs}s`;
      }

      setNextDose({
        medication: targetMed,
        hours: hrs,
        minutes: mins,
        seconds: secs,
        totalSecondsRemaining: minRemainingSeconds,
        formattedCountdown: countdownLabel,
        isDueNow: isDue,
        isOverdue,
      });
    };

    calculateNextDose();
    const interval = setInterval(calculateNextDose, 1000);
    return () => clearInterval(interval);
  }, [medications, browserNotificationsEnabled]);

  // Modal actions
  const openAlarmModal = (_focusMedId?: string) => {
    setIsAlarmModalOpen(true);
  };

  const closeAlarmModal = () => {
    setIsAlarmModalOpen(false);
  };

  const toggleAlarm = (id: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, alarmEnabled: !m.alarmEnabled } : m))
    );
  };

  const updateAlarmTime = (id: string, newTime: string) => {
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, scheduledTime: newTime } : m))
    );
  };

  const markAsTaken = (id: string) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMedications((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              takenToday: true,
              lastTakenAt: `Today at ${timeStr}`,
              snoozedUntil: undefined,
            }
          : m
      )
    );
    if (ringingMedication?.id === id) {
      setIsAlarmRinging(false);
      setRingingMedication(null);
    }
  };

  const snoozeAlarm = (id: string, minutes: number = 10) => {
    const snoozeTime = Date.now() + minutes * 60 * 1000;
    setMedications((prev) =>
      prev.map((m) => (m.id === id ? { ...m, snoozedUntil: snoozeTime } : m))
    );
    setIsAlarmRinging(false);
    setRingingMedication(null);
  };

  const dismissAlarm = () => {
    setIsAlarmRinging(false);
    setRingingMedication(null);
  };

  const triggerTestAlarm = (medId?: string) => {
    const med = medications.find((m) => m.id === medId) || nextDose?.medication || medications[0];
    setRingingMedication(med);
    setIsAlarmRinging(true);
  };

  const addCustomMedication = (medData: Omit<MedicationAlarm, 'id' | 'takenToday'>) => {
    const newId = `med-custom-${Date.now()}`;
    const newMed: MedicationAlarm = {
      ...medData,
      id: newId,
      takenToday: false,
    };
    setMedications((prev) => [newMed, ...prev]);
  };

  const deleteMedication = (id: string) => {
    setMedications((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MedicationAlarmContext.Provider
      value={{
        medications,
        nextDose,
        isAlarmModalOpen,
        isAlarmRinging,
        ringingMedication,
        soundEnabled,
        browserNotificationsEnabled,
        openAlarmModal,
        closeAlarmModal,
        toggleAlarm,
        updateAlarmTime,
        markAsTaken,
        snoozeAlarm,
        dismissAlarm,
        triggerTestAlarm,
        addCustomMedication,
        deleteMedication,
        setSoundEnabled,
        requestBrowserNotifications,
        playChimeSound,
      }}
    >
      {children}
    </MedicationAlarmContext.Provider>
  );
};

export const useMedicationAlarm = () => {
  const context = useContext(MedicationAlarmContext);
  if (!context) {
    throw new Error('useMedicationAlarm must be used within MedicationAlarmProvider');
  }
  return context;
};

