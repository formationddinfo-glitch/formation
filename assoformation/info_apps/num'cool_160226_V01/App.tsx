
import React, { useState, useEffect } from 'react';
import { ModuleType, ModuleDefinition } from './types';
import { stopSpeech } from './services/ttsService';
import { MouseModule } from './modules/MouseModule';
import { KeyboardModule } from './modules/KeyboardModule';
import { NavigationModule } from './modules/NavigationModule';
import { SecurityModule } from './modules/SecurityModule';
import { FormModule } from './modules/FormModule';
import { Button } from './components/Button';
import { SoundProvider, useSound } from './contexts/SoundContext';

// Module definitions used for the home menu
const MODULES: ModuleDefinition[] = [
  {
    id: ModuleType.MOUSE,
    title: "1. La Souris",
    description: "Cliquer et bouger",
    icon: "🖱️",
    color: "bg-blue-100 border-blue-300 hover:bg-blue-200"
  },
  {
    id: ModuleType.KEYBOARD,
    title: "2. Le Clavier",
    description: "Écrire des lettres",
    icon: "⌨️",
    color: "bg-purple-100 border-purple-300 hover:bg-purple-200"
  },
  {
    id: ModuleType.NAVIGATION,
    title: "3. Naviguer",
    description: "Explorer une page",
    icon: "🌐",
    color: "bg-orange-100 border-orange-300 hover:bg-orange-200"
  },
  {
    id: ModuleType.SECURITY,
    title: "4. Sécurité",
    description: "Fermer les pubs",
    icon: "🛡️",
    color: "bg-green-100 border-green-300 hover:bg-green-200"
  },
  {
    id: ModuleType.FORM,
    title: "5. Formulaires",
    description: "Remplir des cases",
    icon: "📝",
    color: "bg-pink-100 border-pink-300 hover:bg-pink-200"
  }
];

// Inner component to access Context
const AppContent: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<ModuleType>(ModuleType.HOME);
  const [introPlayed, setIntroPlayed] = useState(false);
  
  // Use the new hook instead of direct service
  const { speak, isSoundEnabled, toggleSound, currentSubtitle } = useSound();

  useEffect(() => {
    // Basic cleanup when module changes
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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative"> 
      
      {/* Global Sound Toggle */}
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
          {/* Header Compact */}
          <header className="w-full flex flex-row items-center justify-between mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl shadow-md">
                😎
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight leading-none">Num'Cool</h1>
                <p className="text-slate-500 text-sm hidden md:block">L'informatique sans se presser.</p>
              </div>
            </div>
            <Button onClick={handleWelcomeSpeech} variant="secondary" className="py-2 px-4 text-sm md:text-base">
              💬 Aide
            </Button>
          </header>

          {/* Main Grid Compact - 3 columns on desktop for better fit */}
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
                  <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full shadow-md transform rotate-3 z-10">
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

          {/* Footer ultra-compact */}
          <footer className="mt-6 text-slate-400 text-center text-sm italic">
            <p>Apprendre à son rythme, dans la coolitude.</p>
          </footer>
        </div>
      )}

      {/* Persistent Subtitle Bar */}
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

// Root App component wrapping with Provider
const App: React.FC = () => {
  return (
    <SoundProvider>
      <AppContent />
    </SoundProvider>
  );
};

export default App;
