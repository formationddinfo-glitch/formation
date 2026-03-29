
import React, { useState, useEffect } from 'react';
import { ModuleType, ModuleDefinition } from './types';
import { stopSpeech } from './services/ttsService';
import { MouseModule } from './modules/MouseModule';
import { KeyboardModule } from './modules/KeyboardModule';
import { NavigationModule } from './modules/NavigationModule';
import { SecurityModule } from './modules/SecurityModule';
import { FormModule } from './modules/FormModule';
import { HardwareModule } from './modules/HardwareModule';
import { AdvancedMouseModule } from './modules/AdvancedMouseModule';
import { TrainingModule } from './modules/TrainingModule';
import { Button } from './components/Button';
import { SoundProvider, useSound } from './contexts/SoundContext';

// Composant Logo Personnalisé : Numérique Durable & Inclusif
const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" strokeWidth="1" />
    <path d="M50 20C35 20 25 35 25 55C25 75 50 85 50 85C50 85 75 75 75 55C75 35 65 20 50 20Z" fill="#22c55e" />
    <path d="M50 85V45" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55L65 40" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 65L35 50" stroke="white" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="40" r="5" fill="#2563eb" />
    <circle cx="65" cy="35" r="4" fill="#2563eb" />
    <circle cx="35" cy="45" r="4" fill="#2563eb" />
    <circle cx="50" cy="50" r="50" stroke="#2563eb" strokeWidth="4" strokeDasharray="10 5" className="opacity-20" />
  </svg>
);

const MODULES: ModuleDefinition[] = [
  {
    id: ModuleType.HARDWARE,
    title: "1. Matériel",
    description: "Le dessous du capot",
    icon: "🔎",
    color: "bg-teal-100 border-teal-300 hover:bg-teal-200"
  },
  {
    id: ModuleType.MOUSE,
    title: "2. La Souris",
    description: "Cliquer et bouger",
    icon: "🖱️",
    color: "bg-blue-100 border-blue-300 hover:bg-blue-200"
  },
  {
    id: ModuleType.KEYBOARD,
    title: "3. Le Clavier",
    description: "Écrire des lettres",
    icon: "⌨️",
    color: "bg-purple-100 border-purple-300 hover:bg-purple-200"
  },
  {
    id: ModuleType.NAVIGATION,
    title: "4. Naviguer",
    description: "Explorer une page",
    icon: "🌐",
    color: "bg-orange-100 border-orange-300 hover:bg-orange-200"
  },
  {
    id: ModuleType.SECURITY,
    title: "5. Sécurité",
    description: "Fermer les pubs",
    icon: "🛡️",
    color: "bg-green-100 border-green-300 hover:bg-green-200"
  },
  {
    id: ModuleType.FORM,
    title: "6. Formulaires",
    description: "Remplir des cases",
    icon: "📝",
    color: "bg-pink-100 border-pink-300 hover:bg-pink-200"
  },
  {
    id: ModuleType.ADVANCED_MOUSE,
    title: "7. Souris Avancée",
    description: "Éditeur 3D (Déco)",
    icon: "🏠",
    color: "bg-indigo-100 border-indigo-300 hover:bg-indigo-200"
  },
  {
    id: ModuleType.TRAINING,
    title: "8. Entrainement",
    description: "Souris & Clavier",
    icon: "🎯",
    color: "bg-cyan-100 border-cyan-300 hover:bg-cyan-200"
  }
];

const AppContent: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.HOME);
  const [introPlayed, setIntroPlayed] = useState(false);
  const { speak, isSoundEnabled, toggleSound, currentSubtitle, availableVoices, selectedVoiceURI, setSelectedVoiceURI, isHelpEnabled, toggleHelp } = useSound();
  const isFirefox = typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('firefox');
  const [showVoiceWarning, setShowVoiceWarning] = useState(false);

  useEffect(() => {
    stopSpeech();
  }, [currentModule]);

  const handleModuleSelect = (module: ModuleType) => {
    setCurrentModule(module);
  };

  const handleBack = () => {
    setCurrentModule(ModuleType.HOME);
    speak("Retour au menu principal.");
  };

  const handleWelcomeSpeech = () => {
    speak("Bienvenue sur Num'Cool. Choisissez un exercice pour commencer.");
    setIntroPlayed(true);
  };

  const renderModule = () => {
    switch (currentModule) {
      case ModuleType.MOUSE:
        return <MouseModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.KEYBOARD:
        return <KeyboardModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.NAVIGATION:
        return <NavigationModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.SECURITY:
        return <SecurityModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.FORM:
        return <FormModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.HARDWARE:
        return <HardwareModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.ADVANCED_MOUSE:
        return <AdvancedMouseModule onComplete={handleBack} onBack={handleBack} />;
      case ModuleType.TRAINING:
        return <TrainingModule onComplete={handleBack} onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {currentModule !== ModuleType.HOME && (
        <div className="fixed top-4 right-4 z-[60] flex flex-col items-end gap-2">
          <div className="flex gap-2 items-center">
            {availableVoices.length > 0 && isSoundEnabled && (
              <select
                value={selectedVoiceURI || ''}
                onChange={(e) => setSelectedVoiceURI(e.target.value || null)}
                onFocus={() => setShowVoiceWarning(true)}
                onBlur={() => setShowVoiceWarning(false)}
                onMouseEnter={() => setShowVoiceWarning(true)}
                onMouseLeave={() => setShowVoiceWarning(false)}
                className="bg-white border-2 border-slate-200 text-slate-700 text-xs md:text-sm rounded-xl px-3 py-2 shadow-lg focus:outline-none focus:border-blue-400 max-w-[150px] md:max-w-[200px] truncate"
                title="Choisir la voix de synthèse"
              >
                <option value="">Voix par défaut</option>
                {availableVoices.map(v => (
                  <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                ))}
              </select>
            )}
            <button
              onClick={toggleSound}
              className={`p-3 md:p-4 rounded-full shadow-lg border-2 transition-all ${isSoundEnabled ? 'bg-white text-blue-600 border-blue-200' : 'bg-slate-200 text-slate-500 border-slate-300'}`}
              title={isSoundEnabled ? "Désactiver la voix" : "Activer la voix"}
            >
              {isSoundEnabled ? (
                <span className="text-2xl md:text-3xl">🔊</span>
              ) : (
                <span className="text-2xl md:text-3xl">🔇</span>
              )}
            </button>
          </div>
          <button
            onClick={toggleHelp}
            className={`px-3 py-1.5 mt-1 rounded-full shadow-md border text-xs md:text-sm font-medium transition-all ${isHelpEnabled ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' : 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'}`}
            title={isHelpEnabled ? "Désactiver l'aide en bas de page" : "Activer l'aide en bas de page"}
          >
            {isHelpEnabled ? '💡 Désactiver aide' : '💡 Activer aide'}
          </button>
          {isFirefox && showVoiceWarning && isSoundEnabled && (
            <div className="bg-orange-100 border border-orange-300 text-orange-800 p-2 md:p-3 rounded-xl shadow-lg text-xs max-w-[250px] animate-slide-up text-right relative mr-16">
              ⚠️ <strong>Info :</strong> Voix saccadée sur Firefox/Linux.<br />Nous recommandons <strong>Chrome</strong>.
            </div>
          )}
        </div>
      )}

      {currentModule !== ModuleType.HOME ? (
        <div className="fixed inset-0 bg-slate-50 overflow-y-auto z-40">
          {renderModule()}
        </div>
      ) : (
        <div className="p-4 md:p-6 flex flex-col items-center max-w-6xl mx-auto h-screen justify-center">
          <header className="w-full flex flex-col md:flex-row items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200 gap-4">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none">Num'Cool</h1>
                <p className="text-slate-500 text-sm hidden md:block font-medium">Le numérique durable & inclusif.</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 flex-1">
              {availableVoices.length > 0 && isSoundEnabled && (
                <div className="relative">
                  <select
                    value={selectedVoiceURI || ''}
                    onChange={(e) => setSelectedVoiceURI(e.target.value || null)}
                    onFocus={() => setShowVoiceWarning(true)}
                    onBlur={() => setShowVoiceWarning(false)}
                    onMouseEnter={() => setShowVoiceWarning(true)}
                    onMouseLeave={() => setShowVoiceWarning(false)}
                    className="bg-white border-2 border-slate-200 text-slate-700 text-xs md:text-sm rounded-xl px-3 py-2 shadow-sm focus:outline-none focus:border-blue-400 max-w-[150px] md:max-w-[200px] truncate"
                    title="Choisir la voix de synthèse"
                  >
                    <option value="">Voix par défaut</option>
                    {availableVoices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI}>{v.name}</option>
                    ))}
                  </select>
                  {isFirefox && showVoiceWarning && isSoundEnabled && (
                    <div className="absolute top-full left-0 mt-2 bg-orange-100 border border-orange-300 text-orange-800 p-2 rounded-xl shadow-lg text-xs w-max max-w-[250px] z-50">
                      ⚠️ <strong>Info :</strong> Voix saccadée sur Firefox/Linux.<br />Nous recommandons Chrome.
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={toggleSound}
                className={`p-2.5 md:p-3 flex-shrink-0 rounded-full shadow-sm border-2 transition-all ${isSoundEnabled ? 'bg-white text-blue-600 border-blue-200' : 'bg-slate-200 text-slate-500 border-slate-300'}`}
                title={isSoundEnabled ? "Désactiver la voix" : "Activer la voix"}
              >
                {isSoundEnabled ? (
                  <span className="text-xl md:text-2xl leading-none block">🔊</span>
                ) : (
                  <span className="text-xl md:text-2xl leading-none block">🔇</span>
                )}
              </button>

              <button
                onClick={toggleHelp}
                className={`px-3 py-2 rounded-xl shadow-sm border text-xs md:text-sm font-medium transition-all flex-shrink-0 ${isHelpEnabled ? 'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200' : 'bg-slate-200 text-slate-500 border-slate-300 hover:bg-slate-300'}`}
                title={isHelpEnabled ? "Désactiver l'aide" : "Activer l'aide"}
              >
                {isHelpEnabled ? '💡 Désactiver aide' : '💡 Activer aide'}
              </button>

              <div className="w-px h-8 bg-slate-200 mx-1 hidden md:block"></div>

              <Button onClick={handleWelcomeSpeech} variant="secondary" className="py-2 px-4 flex-shrink-0 text-sm md:text-base">
                💬 Aide
              </Button>
            </div>
          </header>

          <main className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {MODULES.map((module, index) => (
              <button
                key={module.id}
                onClick={() => handleModuleSelect(module.id)}
                className={`
                  relative
                  ${module.color} 
                  border-4 rounded-2xl p-4 md:p-6 
                  flex items-center gap-4 
                  transition-all duration-300 
                  hover:scale-[1.02] hover:shadow-xl active:scale-95
                  text-left group w-full h-28 md:h-36
                  ${index === MODULES.length - 1 && MODULES.length % 3 !== 0 ? 'lg:col-span-1' : ''}
                `}
              >
                {module.badge && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md transform rotate-3 z-10">
                    {module.badge}
                  </span>
                )}
                <div className="text-4xl md:text-5xl group-hover:scale-110 transition-transform flex-shrink-0">
                  {module.icon}
                </div>
                <div className="flex flex-col overflow-hidden">
                  <span className="text-lg md:text-xl font-bold text-slate-800 truncate">
                    {module.title}
                  </span>
                  <span className="text-sm md:text-base text-slate-600 line-clamp-2">
                    {module.description}
                  </span>
                </div>
              </button>
            ))}
          </main>

          <footer className="mt-6 text-slate-400 text-center text-sm italic">
            <p>Apprendre à son rythme, pour un futur numérique conscient.</p>
          </footer>
        </div>
      )}

      {currentSubtitle && isHelpEnabled && (
        <div className="fixed bottom-0 left-0 w-full bg-yellow-100 border-t-4 border-yellow-400 p-3 shadow-lg z-[100] animate-slide-up">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <span className="text-2xl">💡</span>
            <p className="text-lg md:text-xl font-bold text-slate-800">
              {currentSubtitle}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
};

export default App;
