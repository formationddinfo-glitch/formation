
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

const PHRASES = [
  "Bonjour !",
  "Ça va bien ?",
  "L'été est chaud à Paris.",
  "jean.dupont@email.fr",
  "10 + 5 = 15",
  "Prix : 45€ (Soldes)",
  "www.mon-site-web.com",
  "#Hashtag & @Mention",
  "Attention au chien !",
  "Une pomme, une poire ; et des kiwis.",
  "Mot_de_passe_S3cr3t!",
  "C'est 100% de réussite.",
  "[Crochets] et {Accolades}"
];

export const KeyboardModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState("");
  const [targetText, setTargetText] = useState(PHRASES[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { speak } = useSound();
  
  useEffect(() => {
    speak("Module Clavier. Recopiez le texte exactement comme il est écrit. Attention aux majuscules et aux symboles.");
  }, [speak]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    
    if (val === targetText) {
      setIsCompleted(true);
      speak("Bravo ! C'est parfaitement recopié.");
    } else {
      setIsCompleted(false);
    }
  };

  const handleNextPhrase = () => {
    let newPhrase = targetText;
    while (newPhrase === targetText && PHRASES.length > 1) {
       newPhrase = PHRASES[Math.floor(Math.random() * PHRASES.length)];
    }
    setTargetText(newPhrase);
    setInputText("");
    setIsCompleted(false);
    speak("Nouveau texte. Prenez votre temps.");
  };

  const handleRestartPhrase = () => {
    setInputText("");
    setIsCompleted(false);
    speak("C'est reparti ! Recopiez le même texte.");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full p-4 md:p-8 pb-64 relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-purple-100 flex flex-col items-center relative overflow-hidden min-h-[70vh]">
         
         {/* Success Overlay for Keyboard */}
         {isCompleted && (
            <div className="absolute inset-0 bg-white/95 z-20 flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-sm">
                <div className="text-7xl mb-4">🏆</div>
                <h2 className="text-4xl font-bold text-purple-600 mb-2">Parfait !</h2>
                <p className="text-xl text-slate-600 mb-10">Vous avez tapé le texte sans aucune erreur.</p>
                <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
                    <Button onClick={handleRestartPhrase} variant="secondary" className="flex-1">
                        🔄 Refaire
                    </Button>
                    <Button onClick={handleNextPhrase} variant="success" className="flex-1">
                        Suivant ➔
                    </Button>
                </div>
            </div>
         )}

         <div className="w-full flex justify-between items-center mb-6">
            <Button onClick={onBack} variant="secondary">← Retour</Button>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 tracking-tight">Le Clavier</h2>
            <div className="w-4 md:w-24"></div> 
         </div>

         <div className="mb-6 text-center w-full">
           <p className="text-xl md:text-2xl mb-4 text-slate-600">Recopiez exactement ce texte :</p>
           
           <div className="w-full bg-slate-100 rounded-xl p-6 mb-4 min-h-[120px] flex flex-wrap items-center justify-center gap-1 select-none border-2 border-slate-200 shadow-inner">
             {targetText.split('').map((char, index) => {
               const userChar = inputText[index];
               let statusClass = "text-slate-400";
               
               if (userChar) {
                 if (userChar === char) {
                   statusClass = "text-green-600 border-b-4 border-green-500";
                 } else {
                   statusClass = "text-red-500 bg-red-100 border-b-4 border-red-500 rounded-t";
                 }
               } else if (index === inputText.length) {
                 statusClass = "text-slate-900 border-b-4 border-blue-400 bg-blue-50";
               }

               return (
                 <span 
                   key={index} 
                   className={`text-3xl md:text-5xl font-bold tracking-wide transition-all duration-150 px-1 font-mono ${statusClass}`}
                 >
                   {char === ' ' ? '\u00A0' : char}
                 </span>
               );
             })}
           </div>
         </div>

         <input 
           type="text" 
           value={inputText}
           onChange={handleChange}
           className={`w-full text-center text-3xl md:text-4xl p-6 border-4 rounded-2xl focus:outline-none focus:ring-4 transition-all mb-8 font-mono
             ${isCompleted 
               ? 'border-green-500 bg-green-50 text-green-700' 
               : 'border-blue-300 focus:border-blue-600 focus:ring-blue-100 text-slate-800'
             }`}
           placeholder="Cliquez ici pour écrire..."
           autoFocus
           autoComplete="off"
           spellCheck={false}
         />
         
         <div className="mt-auto text-slate-500 text-base bg-purple-50 p-6 rounded-2xl border border-purple-100 max-w-2xl text-left w-full">
            <p className="font-bold mb-3 text-purple-800 flex items-center gap-2">
                <span className="text-xl">💡</span> Astuces pour réussir :
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm">
                <li className="flex gap-2"><span>•</span> <strong>MAJUSCULES</strong> : Maintenez Maj (⇧) enfoncé.</li>
                <li className="flex gap-2"><span>•</span> <strong>Espace</strong> : La grande barre en bas.</li>
                <li className="flex gap-2"><span>•</span> <strong>Arobase @</strong> : Alt Gr + à (0).</li>
                <li className="flex gap-2"><span>•</span> <strong>Euro €</strong> : Alt Gr + e.</li>
            </ul>
         </div>
      </div>
    </div>
  );
};
