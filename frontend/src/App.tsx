import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import HumanWorkspacePage from './pages/HumanWorkspace';
import DashboardPage from './pages/Dashboard';
import DoctorWorkspacePage from './pages/DoctorWorkspace';
import AvatarOnboardingPage from './pages/AvatarOnboarding';
import MedicalReportsPage from './pages/MedicalReports';
import DiseaseExplorerPage from './pages/DiseaseExplorer';
import AiAssistantPage from './pages/AiAssistant';
import MedicalImagingPage from './pages/MedicalImaging';
import PlatformPage from './pages/Platform';
import ResearchPage from './pages/Research';
import AboutPage from './pages/About';
import SecurityPage from './pages/Security';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import { AuthContext } from './auth/AuthContext';
import { MedicationAlarmProvider } from './context/MedicationAlarmContext';
import MedicationAlarmRingingOverlay from './components/MedicationAlarmRingingOverlay';
import MedicationAlarmModal from './components/MedicationAlarmModal';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <MedicationAlarmProvider>
      <Router>
        <div className="app-container" style={{ backgroundColor: 'var(--color-bg-burgundy)', minHeight: '100vh' }}>
          <Navbar />
          <MedicationAlarmRingingOverlay />
          <MedicationAlarmModal />
          <Routes>
            {/* Main Cinematic Landing */}
            <Route path="/" element={<LandingPage />} />

            {/* First-Time User Experience: Create Your Digital Human */}
            <Route path="/onboarding" element={<AvatarOnboardingPage />} />

            {/* Dedicated Interactive 3D Human Anatomy Workspace */}
            <Route path="/twin" element={<HumanWorkspacePage />} />

            {/* Patient Clinical Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* AI Medical Report Explanation Engine */}
            <Route path="/reports" element={<MedicalReportsPage />} />

            {/* AI Health Impact & Disease Explorer */}
            <Route path="/explorer" element={<DiseaseExplorerPage />} />

            {/* "Ask Your Body" AI Health Assistant */}
            <Route path="/assistant" element={<AiAssistantPage />} />

            {/* Volumetric Diagnostic Imaging Viewer (DICOM / CT / MRI) */}
            <Route path="/imaging" element={<MedicalImagingPage />} />

            {/* Doctor Clinical Command Center */}
            <Route path="/doctor" element={<DoctorWorkspacePage />} />

            {/* Platform Architecture & Evidence */}
            <Route path="/platform" element={<PlatformPage />} />

            {/* Genomic & Population Health Research */}
            <Route path="/research" element={<ResearchPage />} />

            {/* Medical Privacy & Sovereign Security */}
            <Route path="/security" element={<SecurityPage />} />

            {/* About Vitalis Health Technologies */}
            <Route path="/about" element={<AboutPage />} />

            {/* Split-Screen Authentication */}
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/register" element={user ? <Navigate to="/onboarding" replace /> : <RegisterPage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </MedicationAlarmProvider>
  );
}

export default App;
