import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  processMedicalQuery, 
  type ChatMessage, 
  type SupportedLanguage, 
  LANGUAGE_LABELS 
} from '../services/aiService';
import { 
  Send, 
  Mic, 
  MicOff, 
  Volume2, 
  Sparkles, 
  ShieldAlert, 
  Globe, 
  Layers
} from 'lucide-react';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    text: `Hello! I'm your "Ask Your Body" AI health intelligence assistant.
I am connected to your personal 3D digital twin and your verified clinical records (including your recent Quest Diagnostics blood panel and cardiology notes from Dr. James Chen).

How can I help you understand your health or test results today?`,
    timestamp: '10:00 AM',
    suggestedQuestions: [
      'What does my ALT level of 38 mean?',
      'Why was my blood pressure recorded at 118/78?',
      'Explain my Lisinopril medication',
      'What did my echocardiogram show about my heart?',
    ],
  },
];

export const AiAssistantPage: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Small realistic cognitive synthesis delay
      const aiResponse = await processMedicalQuery(text, undefined, language);
      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an error synthesizing this medical information. Please try again or rephrase your question.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Text-to-Speech
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      if (language === 'hi') utterance.lang = 'hi-IN';
      else if (language === 'gu') utterance.lang = 'gu-IN';
      else utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Web Speech API speech-to-text
  const toggleListening = () => {
    if (!speechSupported) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'hi' ? 'hi-IN' : language === 'gu' ? 'gu-IN' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
      };
      recognition.start();
    }
  };

  return (
    <div style={{ paddingTop: '70px', minHeight: '100vh', background: 'var(--color-bg-burgundy)', color: 'var(--color-warm-white)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Header */}
      <header style={{ padding: '1.25rem 2.5rem', background: 'var(--color-bg-surface)', borderBottom: '1px solid rgba(143, 32, 56, 0.25)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-heart-red), var(--color-crimson))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={16} color="#FFF7F7" />
            </div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
              Ask Your Body • AI Medical Assistant
            </h1>
            <span className="badge badge-crimson">FHIR HL7 Synced</span>
          </div>
          <div style={{ fontSize: '0.775rem', color: 'var(--color-muted-pink)', marginTop: '0.2rem' }}>
            Evidence-grounded medical explanations • Simple everyday language • Multi-lingual
          </div>
        </div>

        {/* Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={15} color="var(--color-brain-rose)" />
          <select
            className="input-field"
            value={language}
            onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
          >
            {(Object.keys(LANGUAGE_LABELS) as SupportedLanguage[]).map((lang) => (
              <option key={lang} value={lang}>
                {LANGUAGE_LABELS[lang].nativeName} ({LANGUAGE_LABELS[lang].name})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Chat Messages Body */}
      <div style={{ flex: 1, maxWidth: '980px', width: '100%', margin: '0 auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', overflowY: 'auto' }}>
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isUser ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  maxWidth: '85%',
                  padding: '1.1rem 1.4rem',
                  borderRadius: 'var(--radius-lg)',
                  background: isUser
                    ? 'var(--color-heart-red)'
                    : msg.isWarning
                    ? 'rgba(197, 40, 72, 0.25)'
                    : 'var(--color-bg-surface-elevated)',
                  border: `1px solid ${
                    isUser
                      ? 'transparent'
                      : msg.isWarning
                      ? 'var(--color-heart-red)'
                      : 'rgba(143, 32, 56, 0.3)'
                  }`,
                  color: 'var(--color-warm-white)',
                  fontSize: '0.875rem',
                  lineHeight: 1.6,
                  boxShadow: 'var(--shadow-sm)',
                  whiteSpace: 'pre-line',
                }}
              >
                {msg.text}

                {/* Organ Link pill */}
                {msg.referencedOrganId && (
                  <div style={{ marginTop: '0.85rem', paddingTop: '0.65rem', borderTop: '1px solid rgba(143, 32, 56, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.725rem', color: 'var(--color-brain-rose)' }}>
                      Connected Organ: <strong>{msg.referencedOrganId.toUpperCase()}</strong>
                    </span>
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => navigate('/twin')}
                      style={{ fontSize: '0.7rem', padding: '0.25rem 0.6rem' }}
                    >
                      <Layers size={12} /> View in 3D Anatomy Lab →
                    </button>
                  </div>
                )}

                {/* Citations */}
                {msg.sourceCitations && msg.sourceCitations.length > 0 && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--color-muted-pink)', opacity: 0.85 }}>
                    Sources: {msg.sourceCitations.join(' • ')}
                  </div>
                )}
              </div>

              {/* Message Footer Actions */}
              {!isUser && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.725rem', color: 'var(--color-muted-pink)' }}>
                  <span>{msg.timestamp}</span>
                  <button
                    onClick={() => handleSpeak(msg.text)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-brain-rose)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '0.725rem' }}
                  >
                    <Volume2 size={13} /> Read Aloud
                  </button>
                </div>
              )}

              {/* Suggested Follow-Up Prompts */}
              {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem', maxWidth: '85%' }}>
                  {msg.suggestedQuestions.map((q, i) => (
                    <button
                      key={i}
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleSendMessage(q)}
                      style={{ fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
                    >
                      {q} →
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div style={{ alignSelf: 'flex-start', padding: '0.85rem 1.25rem', background: 'var(--color-bg-surface-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(143, 32, 56, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--color-muted-pink)' }}>
            <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(197, 40, 72, 0.3)', borderTopColor: 'var(--color-heart-red)', animation: 'spin 1s linear infinite' }} />
            <span>Consulting physiological telemetry and clinical knowledge graphs...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box Footer */}
      <footer style={{ background: 'var(--color-bg-surface)', borderTop: '1px solid rgba(143, 32, 56, 0.25)', padding: '1rem 2rem 1.5rem' }}>
        <div style={{ maxWidth: '980px', margin: '0 auto' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}
          >
            <button
              type="button"
              className={`btn btn-secondary ${isListening ? 'active' : ''}`}
              onClick={toggleListening}
              title={isListening ? 'Listening...' : 'Speak Question with Microphone'}
              style={{ padding: '0.75rem', background: isListening ? 'var(--color-heart-red)' : undefined }}
            >
              {isListening ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <input
              type="text"
              className="input-field"
              placeholder={
                language === 'hi'
                  ? 'अपने शरीर, टेस्ट रिपोर्ट या दवाइयों के बारे में पूछें...'
                  : language === 'gu'
                  ? 'તમારા શરીર, લેબ રિપોર્ટ અથવા દવાઓ વિશે પૂછો...'
                  : 'Ask about your test reports, medications, or any organ in your body...'
              }
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              style={{ flex: 1, padding: '0.85rem 1.25rem' }}
            />

            <button
              type="submit"
              className="btn btn-primary"
              disabled={!inputText.trim() || isLoading}
              style={{ padding: '0.85rem 1.25rem' }}
            >
              <Send size={16} /> Send
            </button>
          </form>

          <div style={{ marginTop: '0.65rem', textAlign: 'center', fontSize: '0.7rem', color: 'var(--color-muted-pink)' }}>
            <ShieldAlert size={12} style={{ display: 'inline', marginRight: '4px' }} />
            Vitalis AI provides medical education and laboratory translation. Always discuss diagnostic decisions and medication adjustments with your attending physician.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AiAssistantPage;
