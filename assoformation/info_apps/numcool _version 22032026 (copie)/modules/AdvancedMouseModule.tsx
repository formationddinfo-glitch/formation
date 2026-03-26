import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

export const AdvancedMouseModule: React.FC<ExerciseProps> = ({ onComplete, onBack }) => {
  const { speak } = useSound();

  const triggerHelp = () => {
    speak("Faire défiler le menu à droite pour découvrir le contenu.");
  };

  useEffect(() => {
    speak("Bienvenue dans l'éditeur de décoration interne en 3D. Faire défiler le menu à droite pour découvrir le contenu.");
  }, [speak]);

  return (
    <div className="flex flex-col w-full h-screen p-4 md:p-6 bg-slate-50 relative pb-20">
      <div className="w-full flex justify-between items-center mb-4 shrink-0">
        <Button onClick={onBack} variant="secondary">← Retour</Button>
        <div className="text-xl md:text-2xl font-bold text-slate-500">Module 7 : Souris Avancée (Déco 3D)</div>
        <Button onClick={onComplete} variant="success">Terminer</Button>
      </div>
      
      <div className="w-full flex-grow bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-slate-200 mb-4">
        <iframe 
          src="/decointerne/index.html" 
          title="Éditeur de Déco 3D"
          className="w-full h-full border-0"
        ></iframe>
      </div>

      <div 
        onClick={triggerHelp}
        className="shrink-0 flex justify-center items-center text-slate-600 font-medium bg-white p-3 rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <span>💬 <strong>Aide et vocal :</strong> Faire défiler le menu à droite pour découvrir le contenu</span>
      </div>
    </div>
  );
};
