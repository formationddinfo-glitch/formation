import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

export const TrainingModule: React.FC<ExerciseProps> = ({ onComplete, onBack }) => {
  const { speak } = useSound();

  const triggerHelp = () => {
    speak("Suivez les instructions à l'écran pour vous entraîner avec la souris et le clavier.");
  };

  useEffect(() => {
    speak("Bienvenue dans l'entraînement Souris et Clavier. Suivez les instructions à l'écran.");
  }, [speak]);

  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-6 bg-slate-50 relative pb-20">
      <div className="w-full flex justify-between items-center mb-4 shrink-0">
        <Button onClick={onBack} variant="secondary">← Retour</Button>
        <div className="text-xl md:text-2xl font-bold text-slate-500">Module 8 : Entraînement Souris & Clavier</div>
        <Button onClick={onComplete} variant="success">Terminer</Button>
      </div>
      
      <div className="w-full flex-grow bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-200 mb-4">
        <iframe 
          src="/exercices/index.html" 
          title="Entraînement Souris & Clavier"
          className="w-full h-full border-0"
        ></iframe>
      </div>

      <div 
        onClick={triggerHelp}
        className="shrink-0 flex justify-center items-center text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span>💬 <strong>Aide et vocal :</strong> Suivez les instructions à l'écran pour vous entraîner</span>
      </div>
    </div>
  );
};
