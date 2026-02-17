import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

export const SecurityModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const [popups, setPopups] = useState([1, 2, 3]);
  const { speak } = useSound();

  useEffect(() => {
    speak("Module Sécurité. Des fenêtres gênantes sont apparues. Trouvez la petite croix pour les fermer. Ne cliquez pas sur les publicités !");
  }, [speak]);

  const closePopup = (id: number) => {
    setPopups(prev => prev.filter(p => p !== id));
    speak("Fenêtre fermée.");
    if (popups.length === 1) { // Since we're filtering the *previous* state, if length is 1 now, it will be 0 after update
        setTimeout(() => speak("Bravo, votre écran est propre !"), 1000);
    }
  };

  return (
    <div className="relative w-full h-full bg-slate-200 overflow-hidden pb-64">
        <div className="absolute top-4 left-4 z-50">
           <Button onClick={onBack} variant="secondary">← Quitter l'exercice</Button>
        </div>

        {/* Fake Desktop Background */}
        <div className="w-full h-full flex items-center justify-center text-slate-400 text-4xl font-bold select-none">
            BUREAU
        </div>

        {popups.map((id, index) => (
            <div 
                key={id}
                className="absolute bg-white border-2 border-slate-400 shadow-2xl rounded-lg w-80 md:w-96 flex flex-col"
                style={{ 
                    top: `${20 + index * 10}%`, 
                    left: `${20 + index * 15}%`,
                    zIndex: 10 + index
                }}
            >
                <div className="bg-red-600 text-white p-2 flex justify-between items-center rounded-t-lg">
                    <span className="font-bold">Publicité !</span>
                    <button 
                        onClick={() => closePopup(id)}
                        className="bg-red-800 hover:bg-red-900 text-white w-8 h-8 flex items-center justify-center rounded font-bold text-xl"
                        aria-label="Fermer la publicité"
                    >
                        X
                    </button>
                </div>
                <div className="p-6 flex flex-col items-center bg-yellow-50 rounded-b-lg">
                    <p className="text-xl font-bold text-red-600 mb-4 text-center">GAGNEZ 1000€ !!!</p>
                    <button className="bg-green-500 text-white px-4 py-2 rounded opacity-50 cursor-not-allowed">
                        Cliquer ici (Faux bouton)
                    </button>
                </div>
            </div>
        ))}

        {popups.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
                 <div className="bg-white p-12 rounded-3xl text-center">
                     <div className="text-6xl mb-4">🛡️</div>
                     <h2 className="text-3xl font-bold text-green-600 mb-4">Sécurité Maîtrisée !</h2>
                     <p className="text-xl mb-8">Vous savez ignorer les fausses alertes.</p>
                     <Button onClick={onBack}>Retour au menu</Button>
                 </div>
             </div>
        )}
    </div>
  );
};