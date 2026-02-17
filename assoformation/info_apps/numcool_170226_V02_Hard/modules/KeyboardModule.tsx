
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

const PHRASES = [
  "Bonjour !",
  "Comment allez-vous ?",
  "C'est l'été à Paris.",
  "jean-du_pont@orange.fr",
  "Total : 15,50 €",
  "1 + 2 * 3 / 4 = ?",
  "L'oiseau s'envole...",
  "www.service-public.fr",
  "Code : #12345",
  "ç, à, é, è, ù, î, ô, ë",
  "(Parenthèses) & [Crochets]",
  "Attention au chien !",
  "Prix : 45€ (Soldes -20%)",
  "L'adresse est : 12 bis, rue d'Alésia.",
  "Majuscule / minuscule",
  "1234567890",
  "~ # { [ | \ ^ @ ] }",
  "C'est 100% de réussite !"
];

export const KeyboardModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const [inputText, setInputText] = useState("");
  const [targetText, setTargetText] = useState(PHRASES[0]);
  const [isCompleted, setIsCompleted] = useState(false);
  const { speak } = useSound();
  
  useEffect(() => {
    speak("Module Clavier. Recopiez le texte exactement comme il est écrit. Utilisez les boutons en bas pour changer de texte.");
  }, [speak]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);
    
    if (val === targetText) {
      setIsCompleted(true);
      speak("Bravo ! C'est parfait.");
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
    speak("Nouveau texte généré. À vous de jouer.");
  };

  const handleRestartPhrase = () => {
    setInputText("");
    setIsCompleted(false);
    speak("C'est reparti !");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-full w-full p-4 md:p-8 pb-64 relative">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-purple-100 flex flex-col items-center relative min-h-[75vh]">
         
         <div className="w-full flex justify-between items-center mb-6">
            <Button onClick={onBack} variant="secondary">← Retour</Button>
            <h2 className="text-2xl md:text-3xl font-bold text-purple-800 tracking-tight">Le Clavier</h2>
            <div className="w-4 md:w-24"></div> 
         </div>

         <div className="mb-6 text-center w-full">
           <p className="text-xl md:text-2xl mb-4 text-slate-600">Recopiez ce texte (attention aux symboles) :</p>
           
           <div className="w-full bg-slate-100 rounded-xl p-6 mb-4 min-h-[140px] flex flex-wrap items-center justify-center gap-1 select-none border-2 border-slate-200 shadow-inner">
             {targetText.split('').map((char, index) => {
               const userChar = inputText[index];
               let statusClass = "text-slate-400";
               
               if (userChar !== undefined) {
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

         <div className="w-full relative group">
           <input 
             type="text" 
             value={inputText}
             onChange={handleChange}
             className={`w-full text-center text-3xl md:text-4xl p-6 border-4 rounded-2xl focus:outline-none focus:ring-4 transition-all mb-4 font-mono
               ${isCompleted 
                 ? 'border-green-500 bg-green-50 text-green-700' 
                 : 'border-blue-300 focus:border-blue-600 focus:ring-blue-100 text-slate-800'
               }`}
             placeholder="Cliquez ici et tapez au clavier..."
             autoFocus
             autoComplete="off"
             spellCheck={false}
           />
           {isCompleted && (
             <div className="absolute -top-4 -right-4 bg-green-500 text-white p-3 rounded-full shadow-lg animate-bounce z-10">
               <span className="text-2xl font-bold">✨ BIEN !</span>
             </div>
           )}
         </div>

         {/* Action Buttons inside the main window */}
         <div className="flex flex-wrap gap-4 mb-8">
            <Button onClick={handleRestartPhrase} variant="secondary" className="px-6 py-3 text-lg">
                🔄 Effacer tout
            </Button>
            <Button onClick={handleNextPhrase} variant={isCompleted ? "success" : "primary"} className="px-6 py-3 text-lg">
                {isCompleted ? "Autre texte ➔" : "Nouveau texte"}
            </Button>
         </div>
         
         {/* Enhanced Tips Panel */}
         <div className="mt-auto text-slate-600 bg-purple-50 p-6 rounded-2xl border border-purple-100 w-full">
            <h4 className="font-bold mb-4 text-purple-800 flex items-center gap-2">
                <span className="text-xl">⌨️</span> Guide des touches importantes :
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm md:text-base">
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Majuscules (Shift ⇧)</strong> : Maintenez enfoncé pour une lettre capitale ou les chiffres du haut.
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Alt Gr</strong> : À droite de l'espace. Maintenez pour l'arobase (@), l'euro (€) ou le dièse (#).
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Effacer (⌫)</strong> : Au-dessus de la touche Entrée. Pour corriger une erreur.
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Apostrophe (')</strong> : Sur la touche du chiffre 4 (sans appuyer sur Maj).
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Accents</strong> : Les touches é, è, ç, à sont directement accessibles en bas des chiffres.
                </div>
                <div className="bg-white p-3 rounded-xl border border-purple-100">
                    <strong className="text-purple-700">Ponctuation</strong> : Le point (.) nécessite souvent Maj (⇧) + la touche point-virgule (;).
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};
