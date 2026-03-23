
import React, { useState, useEffect } from 'react';
import { ModuleType, ModuleDefinition } from './types';
import { stopSpeech } from './services/ttsService';
import { MouseModule } from './modules/MouseModule';
import { KeyboardModule } from './modules/KeyboardModule';
import { NavigationModule } from './modules/NavigationModule';
import { SecurityModule } from './modules/SecurityModule';
import { FormModule } from './modules/FormModule';
import { HardwareModule } from './modules/HardwareModule';
import { Button } from './components/Button';
import { SoundProvider, useSound } from './contexts/SoundContext';

// Composant Logo Personnalisé : Numérique Durable & Inclusif
const Logo = () => (
  <svg viewBox="0 0 100 100" className="w-10 h-10 md:w-14 md:h-14 drop-shadow-md" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="48" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
    <path d="M50 20C35 20 25 35 25 55C25 75 50 85 50 85C50 85 75 75 75 55C75 35 65 20 50 20Z" fill="#22c55e" />
    <path d="M50 85V45" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 55L65 40" stroke="white" strokeWidth="4" strokeLinecap="round"/>
    <path d="M50 65L35 50" stroke="white" strokeWidth="4" strokeLinecap="round"/>
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
  }
];

const AppContent: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.HOME);
  const [introPlayed, setIntroPlayed] = useState(false);
  const { speak, isSoundEnabled, toggleSound, currentSubtitle } = useSound();

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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative"> 
      <div className="fixed top-4 right-4 z-50">
        <button 
          onClick={toggleSound}
          className={`p-3 md:p-4 rounded-full shadow-lg border-2 transition-all ${isSoundEnabled ? 'bg-white text-blue-600 border-blue-200' : 'bg-slate-200 text-slate-500 border-slate-300'}`}
        >
          {isSoundEnabled ? (
             <span className="text-2xl md:text-3xl">🔊</span>
          ) : (
             <span className="text-2xl md:text-3xl">🔇</span>
          )}
        </button>
      </div>

      {currentModule !== ModuleType.HOME ? (
        <div className="fixed inset-0 bg-slate-50 overflow-y-auto z-40">
            {renderModule()}
        </div>
      ) : (
        <div className="p-4 md:p-6 flex flex-col items-center max-w-6xl mx-auto h-screen justify-center">
          <header className="w-full flex flex-row items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
              <Logo />
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none">Num'Cool</h1>
                <p className="text-slate-500 text-sm hidden md:block font-medium">Le numérique durable & inclusif.</p>
              </div>
            </div>
            <Button onClick={handleWelcomeSpeech} variant="secondary" className="py-2 px-4 text-sm md:text-base">
              💬 Aide
            </Button>
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

      {currentSubtitle && (
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
