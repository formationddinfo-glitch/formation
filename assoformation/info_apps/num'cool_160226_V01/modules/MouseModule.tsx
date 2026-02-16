
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

enum MouseStep {
  INTRO = 0,
  HOVER = 1,
  CLICK = 2,
  RIGHT_CLICK = 3,
  SCROLL = 4,
  DRAG = 5,
  COPY_PASTE = 6,
  COMPLETE = 7
}

interface Balloon {
  id: number;
  popped: boolean;
}

export const MouseModule: React.FC<ExerciseProps> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState<MouseStep>(MouseStep.INTRO);
  const [stepCompleted, setStepCompleted] = useState(false);
  const { speak } = useSound();
  
  // State for exercises
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [targets, setTargets] = useState<{id: number, x: number, y: number, color: string}[]>([]);
  const [rightClickTargets, setRightClickTargets] = useState<{id: number, x: number, y: number}[]>([]);
  const [isDropped, setIsDropped] = useState(false);
  
  // Copy Paste exercise state
  const [sourceText, setSourceText] = useState("");
  const [pastedText, setPastedText] = useState("");
  const [activeKeys, setActiveKeys] = useState<{ [key: string]: boolean }>({});

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Track keys for visual feedback
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys(prev => ({ ...prev, [key]: true, 'control': e.ctrlKey }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      setActiveKeys(prev => ({ ...prev, [key]: false, 'control': e.ctrlKey }));
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Initialize steps
  const initStep = (targetStep: MouseStep) => {
    setStepCompleted(false);
    switch (targetStep) {
      case MouseStep.HOVER:
        setBalloons(Array.from({ length: 8 }, (_, i) => ({ id: i, popped: false })));
        speak("Exercice 1 : Le survol. Bougez votre souris pour toucher les ballons et les faire éclater.");
        break;
      case MouseStep.CLICK:
        generateTargets();
        speak("Exercice 2 : Le clic gauche. Cliquez sur les cercles de couleur.");
        break;
      case MouseStep.RIGHT_CLICK:
        generateRightClickTargets();
        speak("Exercice 3 : Le clic droit. Utilisez le bouton de droite sur les carrés oranges.");
        break;
      case MouseStep.SCROLL:
        speak("Exercice 4 : La molette. Faites rouler la petite roue pour trouver le bouton caché en bas.");
        break;
      case MouseStep.DRAG:
        setIsDropped(false);
        speak("Exercice 5 : Glisser-Déposer. Déplacez le carré bleu dans la zone verte.");
        break;
      case MouseStep.COPY_PASTE:
        setSourceText("");
        setPastedText("");
        speak("Exercice 6 : Copier-Coller. Écrivez un mot, copiez-le et collez-le dans la deuxième case.");
        break;
    }
  };

  useEffect(() => {
    if (step === MouseStep.INTRO) {
      speak("Bienvenue dans le module Souris. Cliquez sur le bouton bleu Commencer.");
    } else if (step === MouseStep.COMPLETE) {
      speak("Félicitations ! Vous maîtrisez toutes les fonctions de la souris.");
    } else {
      initStep(step);
    }
  }, [step]);

  const generateTargets = () => {
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];
    setTargets(Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 10,
      color: colors[i % colors.length]
    })));
  };

  const generateRightClickTargets = () => {
    setRightClickTargets(Array.from({ length: 3 }, (_, i) => ({
      id: i,
      x: 20 + (i * 30),
      y: 40
    })));
  };

  const handleHoverBalloon = (id: number) => {
    setBalloons(prev => {
        const updated = prev.map(b => b.id === id ? { ...b, popped: true } : b);
        const remaining = updated.filter(b => !b.popped).length;
        if (remaining === 0) {
            setStepCompleted(true);
            speak("Bravo ! Vous avez fait éclater tous les ballons.");
        }
        return updated;
    });
  };

  const handleClickTarget = (id: number) => {
    const newTargets = targets.filter(t => t.id !== id);
    setTargets(newTargets);
    if (newTargets.length === 0) {
      setStepCompleted(true);
      speak("Excellent ! Vous savez cliquer avec précision.");
    } else {
      speak("Bien ! Continuez.");
    }
  };

  const handleRightClickTarget = (e: React.MouseEvent, id: number) => {
    e.preventDefault(); 
    const newTargets = rightClickTargets.filter(t => t.id !== id);
    setRightClickTargets(newTargets);
    if (newTargets.length === 0) {
      setStepCompleted(true);
      speak("Super ! Vous maîtrisez le clic droit.");
    } else {
      speak("Clic droit réussi !");
    }
  };

  const handleScrollFinish = () => {
      setStepCompleted(true);
      speak("Parfait ! Vous savez utiliser la molette.");
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "drag-item");
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDropped(true);
    setStepCompleted(true);
    speak("Bien joué ! Vous avez réussi le glisser-déposer.");
  };

  const handleCopy = () => {
    speak("Texte copié ! Maintenant, allez dans la case de droite pour le coller.");
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData('Text');
    setTimeout(() => {
        if (text.trim() !== "" && text === sourceText) {
          setPastedText(text);
          setStepCompleted(true);
          speak("Bravo ! Le copier-coller est réussi.");
        } else if (text !== "") {
          setPastedText(text);
          speak("Ce n'est pas le même texte. Réessayez.");
        }
    }, 50);
  };

  const handlePastedInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPastedText(val);
    if (val.trim() !== "" && val === sourceText) {
      setStepCompleted(true);
      speak("Bravo ! Copier-coller réussi.");
    }
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const restartStep = () => {
    initStep(step);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-full p-4 relative pb-64">
      {/* Progress Bar */}
      <div className="absolute top-0 left-0 w-full h-4 bg-slate-200">
        <div 
          className="h-full bg-blue-500 transition-all duration-500" 
          style={{ width: `${(step / 7) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-4xl min-h-full flex flex-col items-center pt-8">
        <div className="w-full flex justify-between items-center mb-8">
          <Button onClick={onBack} variant="secondary">← Retour</Button>
          <div className="text-2xl font-bold text-slate-500">Module 1 : La Souris</div>
          <div className="w-24 md:w-32"></div>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-2xl p-8 relative border-4 border-blue-100 min-h-[60vh] flex flex-col">
          
          {/* Transition / Success Message Overlay */}
          {stepCompleted && step !== MouseStep.COMPLETE && (
            <div className="absolute inset-0 bg-white/95 rounded-2xl z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-sm">
              <div className="text-7xl mb-4">✨</div>
              <h2 className="text-4xl font-bold text-green-600 mb-2">Réussi !</h2>
              <p className="text-xl text-slate-600 mb-10">Prenez votre temps. Vous pouvez refaire cet exercice ou passer au suivant.</p>
              
              <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                <Button onClick={restartStep} variant="secondary" className="flex-1">
                  🔄 Refaire
                </Button>
                <Button onClick={nextStep} variant="success" className="flex-1">
                  Suivant ➔
                </Button>
              </div>
            </div>
          )}

          {step === MouseStep.INTRO && (
            <div className="flex flex-col items-center justify-center flex-grow py-8 text-center space-y-8">
              <div className="text-8xl">🖱️</div>
              <h2 className="text-4xl font-bold text-blue-800">Apprenons à utiliser la souris</h2>
              <p className="text-2xl text-slate-600 max-w-2xl">Apprenez à bouger, cliquer, utiliser la molette et copier-coller à votre rythme.</p>
              <Button onClick={() => setStep(MouseStep.HOVER)} className="text-3xl px-12 py-6">Commencer</Button>
            </div>
          )}

          {step === MouseStep.HOVER && (
            <div className="h-full w-full relative flex-grow">
               <h3 className="text-2xl font-bold text-center mb-4 text-slate-500">Touchez les ballons rouges</h3>
               <div className="grid grid-cols-4 gap-8 h-96 place-items-center mt-8">
                 {balloons.map(balloon => (
                   <div key={balloon.id}
                     className={`w-24 h-24 md:w-32 md:h-32 bg-red-400 rounded-full shadow-lg transform transition-all duration-300 flex items-center justify-center animate-bounce ${balloon.popped ? 'opacity-0 scale-0 pointer-events-none' : 'opacity-100 scale-100 cursor-pointer hover:scale-110'}`}
                     onMouseEnter={() => !balloon.popped && handleHoverBalloon(balloon.id)}>
                     <span className="text-4xl">🎈</span>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {step === MouseStep.CLICK && (
            <div className="h-96 w-full relative flex-grow">
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-500">CLIC GAUCHE sur les cercles</h3>
              {targets.map(t => (
                <button key={t.id} onClick={() => handleClickTarget(t.id)} style={{ top: `${t.y}%`, left: `${t.x}%` }}
                  className={`absolute w-24 h-24 ${t.color} rounded-full shadow-xl flex items-center justify-center transform hover:scale-105 active:scale-95 transition-all cursor-pointer`}>
                  <span className="text-white font-bold text-xl">CLIC</span>
                </button>
              ))}
            </div>
          )}

          {step === MouseStep.RIGHT_CLICK && (
            <div className="h-96 w-full relative flex-grow">
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-500">CLIC DROIT sur les carrés oranges</h3>
              {rightClickTargets.map(t => (
                <div key={t.id} onContextMenu={(e) => handleRightClickTarget(e, t.id)} style={{ top: `${t.y}%`, left: `${t.x}%` }}
                  className="absolute w-32 h-32 bg-orange-500 border-4 border-orange-600 rounded-xl shadow-xl flex flex-col items-center justify-center transform hover:scale-105 transition-all cursor-context-menu">
                  <span className="text-4xl mb-2">🖱️</span>
                  <span className="text-white font-bold text-lg">CLIC DROIT</span>
                </div>
              ))}
            </div>
          )}

          {step === MouseStep.SCROLL && (
            <div className="flex-grow w-full flex flex-col items-center">
                <h3 className="text-2xl font-bold text-center mb-4 text-slate-500">Utilisez la MOLETTE pour descendre</h3>
                <div ref={scrollContainerRef} className="w-full max-w-md h-80 bg-blue-50 border-4 border-blue-200 rounded-xl overflow-y-auto p-4 shadow-inner relative">
                    <div className="space-y-12 text-center pb-8">
                        <p className="text-xl pt-4">Début de la page...</p>
                        <div className="text-4xl">⬇️</div>
                        <p className="text-xl">Continuez de rouler...</p>
                        <div className="bg-white p-4 rounded shadow">On descend encore !</div>
                        <div className="text-4xl">⬇️</div>
                        <p className="text-xl">Presque arrivé !</p>
                        <div className="pt-8">
                            <Button onClick={handleScrollFinish} variant="success">J'ai trouvé le bouton !</Button>
                        </div>
                    </div>
                </div>
            </div>
          )}

          {step === MouseStep.DRAG && (
            <div className="flex-grow w-full flex flex-row items-center justify-around h-96">
               {!isDropped ? (
                 <div draggable onDragStart={handleDragStart} className="w-40 h-40 bg-blue-600 rounded-xl shadow-2xl cursor-grab active:cursor-grabbing flex items-center justify-center text-white font-bold text-2xl z-10">PRENEZ-MOI</div>
               ) : <div className="w-40 h-40"></div>}
               <div className="text-4xl text-slate-300">➔</div>
               <div onDragOver={handleDragOver} onDrop={handleDrop} className={`w-48 h-48 border-4 border-dashed rounded-xl flex items-center justify-center transition-colors ${isDropped ? 'bg-green-100 border-green-500' : 'bg-slate-50 border-slate-300'}`}>
                 {isDropped ? <div className="text-green-600 text-6xl">✓</div> : <span className="text-slate-400 font-bold">DÉPOSEZ ICI</span>}
               </div>
            </div>
          )}

          {step === MouseStep.COPY_PASTE && (
            <div className="flex-grow w-full flex flex-col items-center py-4">
              <h3 className="text-2xl font-bold text-center mb-6 text-slate-700">COPIER et COLLER</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mb-8">
                <div className="flex flex-col gap-3">
                  <label className="text-lg font-bold text-slate-500 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span> Écrivez ici
                  </label>
                  <input type="text" value={sourceText} onChange={(e) => setSourceText(e.target.value)} onCopy={handleCopy} placeholder="Tapez un mot..." className="w-full text-2xl p-6 border-4 border-blue-200 rounded-2xl focus:border-blue-500 outline-none" />
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-xs text-blue-600 italic">Sélectionnez le mot, puis Clic Droit &gt; Copier.</div>
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-lg font-bold text-slate-500 flex items-center gap-2">
                    <span className="bg-green-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span> Collez ici
                  </label>
                  <input type="text" value={pastedText} onChange={handlePastedInputChange} onPaste={handlePaste} placeholder="Clic droit &gt; Coller ici" className={`w-full text-2xl p-6 border-4 rounded-2xl outline-none transition-all ${pastedText === sourceText && pastedText !== "" ? 'border-green-500 bg-green-50 font-bold' : 'border-slate-300 bg-white'}`} />
                  <div className="p-3 bg-green-50 rounded-xl border border-green-100 text-xs text-green-800 italic">Faites un Clic Droit ici, puis Coller.</div>
                </div>
              </div>
              <div className="bg-slate-100 p-6 rounded-2xl border-2 border-slate-200 w-full max-w-2xl">
                 <h4 className="text-center font-bold text-slate-700 mb-4 uppercase tracking-wider text-sm">Méthode Clavier</h4>
                 <div className="flex flex-wrap justify-center gap-12 items-center">
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">COPIER</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-14 h-14 rounded-xl border-2 font-bold flex items-center justify-center ${activeKeys['control'] ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-slate-300'}`}>Ctrl</div>
                            <span className="text-xl font-bold text-slate-300">+</span>
                            <div className={`w-14 h-14 rounded-xl border-2 font-bold flex items-center justify-center ${activeKeys['c'] ? 'bg-blue-500 text-white border-blue-600' : 'bg-white border-slate-300'}`}>C</div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">COLLER</span>
                        <div className="flex items-center gap-2">
                            <div className={`w-14 h-14 rounded-xl border-2 font-bold flex items-center justify-center ${activeKeys['control'] ? 'bg-green-500 text-white border-green-600' : 'bg-white border-slate-300'}`}>Ctrl</div>
                            <span className="text-xl font-bold text-slate-300">+</span>
                            <div className={`w-14 h-14 rounded-xl border-2 font-bold flex items-center justify-center ${activeKeys['v'] ? 'bg-green-500 text-white border-green-600' : 'bg-white border-slate-300'}`}>V</div>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {step === MouseStep.COMPLETE && (
            <div className="flex flex-col items-center justify-center flex-grow h-full text-center space-y-8 animate-fade-in">
              <div className="text-8xl">🏆</div>
              <h2 className="text-4xl font-bold text-green-600">Bravo !</h2>
              <p className="text-2xl text-slate-600">Vous maîtrisez toutes les fonctions de la souris.</p>
              <Button onClick={onComplete} variant="success" className="text-3xl px-12 py-6">Retourner au menu</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
