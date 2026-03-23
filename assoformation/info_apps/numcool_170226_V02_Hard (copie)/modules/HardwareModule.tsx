
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

enum HardwareTab {
  OVERVIEW = 'overview',
  INTERNAL = 'internal',
  FLOW = 'flow',
  MOUSE = 'mouse',
  KEYBOARD = 'keyboard'
}

interface ComponentInfo {
  name: string;
  description: string;
}

export const HardwareModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<HardwareTab>(HardwareTab.OVERVIEW);
  const [selectedElement, setSelectedElement] = useState<ComponentInfo | null>(null);
  
  // Stockage des images personnalisées par onglet
  const [userImages, setUserImages] = useState<Partial<Record<HardwareTab, string>>>({});
  
  const [isFlowAnimating, setIsFlowAnimating] = useState(false);
  const [flowStep, setFlowStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { speak } = useSound();

  useEffect(() => {
    speak("Découverte du matériel. Explorez les différents éléments en cliquant sur les boutons en haut de l'image.");
  }, [speak]);

  const handleElementClick = (name: string, description: string) => {
    setSelectedElement({ name, description });
    speak(`${name} : ${description}`);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setUserImages(prev => ({ ...prev, [activeTab]: base64 }));
        speak("Image personnalisée chargée pour cet élément !");
      };
      reader.readAsDataURL(file);
    }
    // Reset value to allow uploading the same file again if needed
    e.target.value = '';
  };

  const resetImage = () => {
    setUserImages(prev => {
      const next = { ...prev };
      delete next[activeTab];
      return next;
    });
    speak("Image réinitialisée.");
  };

  const startFlowAnimation = () => {
    if (isFlowAnimating) return;
    setIsFlowAnimating(true);
    setFlowStep(0);
    speak("Lancement de l'action. Regardez comment l'information voyage.");
    
    const steps = [
      "Vous tapez sur le clavier.",
      "L'information va au processeur, le cerveau.",
      "Elle passe par la mémoire vive RAM pour être traitée vite.",
      "Elle peut être enregistrée sur le disque dur.",
      "Le résultat s'affiche enfin sur votre écran !"
    ];

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setFlowStep(current);
      if (current < steps.length) {
        speak(steps[current]);
      }
      if (current >= 5) {
        clearInterval(interval);
        setTimeout(() => {
            setIsFlowAnimating(false);
            setFlowStep(0);
        }, 2000);
      }
    }, 2500);
  };

  const tabs = [
    { id: HardwareTab.OVERVIEW, label: "1. L'ordinateur", icon: "💻" },
    { id: HardwareTab.INTERNAL, label: "2. L'intérieur", icon: "🔧" },
    { id: HardwareTab.FLOW, label: "3. Le voyage", icon: "⚡" },
    { id: HardwareTab.MOUSE, label: "4. La souris", icon: "🖱️" },
    { id: HardwareTab.KEYBOARD, label: "5. Le clavier", icon: "⌨️" },
  ];

  const overviewComponents = [
    { name: "Écran", icon: "🖥️", desc: "Il affiche les images et le texte. C'est ici que vous voyez votre travail." },
    { name: "Clavier", icon: "⌨️", desc: "Il sert à taper des lettres, des chiffres et des commandes." },
    { name: "HDMI", icon: "🔌", desc: "Prise pour brancher l'ordinateur sur une télévision ou un grand écran." },
    { name: "Port USB", icon: "📀", desc: "Pour brancher une clé USB, une souris ou une imprimante." },
    { name: "Alimentation", icon: "⚡", desc: "Prise pour brancher le chargeur et donner de l'énergie à la batterie." },
    { name: "Microphone", icon: "🎤", desc: "Un petit trou qui capte votre voix pour parler par internet." },
    { name: "Pavé Tactile", icon: "👆", desc: "La zone sous le clavier qui remplace la souris sur un portable." }
  ];

  // Helper to render the common upload controls
  const renderUploadControls = (tabId: HardwareTab) => {
    const hasUserImage = !!userImages[tabId];
    return (
      <div className="absolute top-4 left-4 flex gap-2 z-30">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white/95 hover:bg-white text-slate-800 px-3 py-2 rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 text-xs md:text-sm backdrop-blur-sm border border-slate-200"
        >
          📷 {hasUserImage ? "Changer" : "Ma photo"}
        </button>
        {hasUserImage && (
          <button 
            onClick={resetImage}
            className="bg-red-500 text-white px-3 py-2 rounded-xl font-bold shadow-lg transition-all text-xs md:text-sm"
          >
            🔄 Reset
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center min-h-full w-full p-4 md:p-8 pb-64">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-teal-100 flex flex-col min-h-[85vh]">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <Button onClick={onBack} variant="secondary">← Retour</Button>
            <h2 className="text-2xl md:text-3xl font-bold text-teal-800">Dessous du capot – Le matériel</h2>
            <div className="w-4 md:w-24"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => {
                        setActiveTab(tab.id);
                        setSelectedElement(null);
                        speak(`Onglet ${tab.label}`);
                    }}
                    className={`px-4 py-3 rounded-xl font-bold transition-all flex items-center gap-2 border-b-4 ${activeTab === tab.id ? 'bg-teal-600 text-white border-teal-800 scale-105 shadow-md' : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'}`}
                >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                </button>
            ))}
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col items-center relative bg-slate-100 rounded-2xl overflow-hidden border-2 border-slate-200 min-h-[500px]">
            
            {/* 1. OVERVIEW */}
            {activeTab === HardwareTab.OVERVIEW && (
                <div className="w-full h-full flex flex-col">
                    <div className="bg-white p-4 border-b-2 border-slate-200 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 z-20">
                        {overviewComponents.map(comp => (
                            <button
                                key={comp.name}
                                onClick={() => handleElementClick(comp.name, comp.desc)}
                                className={`flex flex-col items-center p-2 rounded-lg border-2 transition-all hover:bg-teal-50 ${selectedElement?.name === comp.name ? 'border-teal-500 bg-teal-50 shadow-inner' : 'border-slate-100 bg-white'}`}
                            >
                                <span className="text-xl mb-1">{comp.icon}</span>
                                <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase text-center">{comp.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex-grow relative flex items-center justify-center p-6 bg-slate-100">
                        <div className="relative max-w-2xl w-full h-full max-h-[400px] shadow-2xl rounded-2xl overflow-hidden group border-4 border-white bg-slate-200">
                            {renderUploadControls(HardwareTab.OVERVIEW)}
                            <img 
                                src={userImages[HardwareTab.OVERVIEW] || "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=1200"} 
                                alt="Ordinateur" 
                                className="w-full h-full object-contain"
                            />
                            {selectedElement && (
                                <div className="absolute inset-x-0 bottom-0 bg-teal-900/90 text-white p-6 backdrop-blur-md animate-slide-up border-t-4 border-teal-400 z-40">
                                    <h4 className="text-xl font-bold mb-2 flex items-center gap-2">
                                        {overviewComponents.find(c => c.name === selectedElement.name)?.icon} {selectedElement.name}
                                    </h4>
                                    <p className="text-lg leading-snug opacity-90">{selectedElement.description}</p>
                                    <button onClick={() => setSelectedElement(null)} className="mt-4 text-xs font-bold uppercase tracking-widest text-teal-300 hover:text-white transition-colors">Fermer cette explication</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 2. INTERNAL */}
            {activeTab === HardwareTab.INTERNAL && (
                <div className="w-full h-full flex flex-col">
                    <div className="bg-white p-4 border-b-2 border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-2">
                        {[
                            { name: "Processeur", icon: "⚙️", desc: "Le cerveau de la machine. Il exécute tous les calculs très vite." },
                            { name: "RAM", icon: "🧠", desc: "La mémoire de travail rapide. Elle s'efface quand on éteint l'ordinateur." },
                            { name: "Stockage", icon: "📁", desc: "L'armoire de rangement pour vos photos et documents (Disque dur)." },
                            { name: "Carte Mère", icon: "🌐", desc: "Le grand plateau vert qui relie tous les morceaux entre eux." }
                        ].map(comp => (
                            <button
                                key={comp.name}
                                onClick={() => handleElementClick(comp.name, comp.desc)}
                                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:bg-teal-50 ${selectedElement?.name === comp.name ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white'}`}
                            >
                                <span className="text-2xl mb-1">{comp.icon}</span>
                                <span className="text-xs font-bold text-slate-600 uppercase">{comp.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex-grow flex items-center justify-center p-4">
                        <div className="relative max-w-xl w-full h-full max-h-[400px] shadow-xl rounded-xl overflow-hidden border-4 border-white bg-slate-200">
                            {renderUploadControls(HardwareTab.INTERNAL)}
                            <img 
                                src={userImages[HardwareTab.INTERNAL] || "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=1200"} 
                                alt="Intérieur" 
                                className="w-full h-full object-contain"
                            />
                            {selectedElement && (
                                <div className="absolute inset-0 bg-white/95 flex flex-col items-center justify-center p-8 text-center animate-fade-in z-40">
                                    <h4 className="text-2xl font-bold text-teal-700 mb-4">{selectedElement.name}</h4>
                                    <p className="text-xl text-slate-700 mb-6">{selectedElement.description}</p>
                                    <Button onClick={() => setSelectedElement(null)} variant="secondary" className="py-2 text-sm">Fermer</Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 3. FLOW */}
            {activeTab === HardwareTab.FLOW && (
                <div className="w-full flex flex-col items-center p-8 justify-center h-full">
                    <div className="flex flex-wrap justify-center items-center gap-4 mb-12 relative w-full">
                        {[
                          { id: 1, icon: "⌨️", name: "Clavier" },
                          { id: 2, icon: "⚙️", name: "Processeur" },
                          { id: 3, icon: "🧠", name: "Mémoire" },
                          { id: 4, icon: "📁", name: "Disque" },
                          { id: 5, icon: "🖥️", name: "Écran" }
                        ].map((node, idx) => (
                           <React.Fragment key={node.id}>
                               <div className={`flex flex-col items-center p-5 rounded-2xl border-4 transition-all duration-500 shadow-md
                                 ${flowStep === node.id ? 'bg-teal-100 border-teal-500 scale-125 z-10 shadow-xl' : 'bg-white border-slate-200 opacity-40'}
                               `}>
                                   <span className="text-4xl mb-2">{node.icon}</span>
                                   <span className="text-xs font-bold uppercase tracking-widest">{node.name}</span>
                               </div>
                               {idx < 4 && (
                                 <div className={`text-2xl font-bold transition-colors ${flowStep > node.id ? 'text-teal-500' : 'text-slate-200'}`}>➔</div>
                               )}
                           </React.Fragment>
                        ))}
                    </div>
                    
                    <Button 
                        onClick={startFlowAnimation} 
                        variant={isFlowAnimating ? "secondary" : "success"}
                        className={`${!isFlowAnimating && 'animate-bounce'}`}
                    >
                        {isFlowAnimating ? "Voyage en cours..." : "Lancer une action"}
                    </Button>
                </div>
            )}

            {/* 4. MOUSE */}
            {activeTab === HardwareTab.MOUSE && (
                <div className="w-full h-full flex flex-col">
                    <div className="bg-white p-4 border-b-2 border-slate-200 flex justify-center gap-4">
                        {[
                            { name: "Clic Gauche", icon: "👈", desc: "Le bouton principal pour cliquer, choisir et valider." },
                            { name: "Clic Droit", icon: "👉", desc: "Pour ouvrir des menus secrets avec plus d'options." },
                            { name: "Molette", icon: "🖱️", desc: "Faites-la rouler pour descendre dans une page comme celle d'un journal." }
                        ].map(comp => (
                            <button
                                key={comp.name}
                                onClick={() => handleElementClick(comp.name, comp.desc)}
                                className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all hover:bg-teal-50 ${selectedElement?.name === comp.name ? 'border-teal-500 bg-teal-50' : 'border-slate-100 bg-white'}`}
                            >
                                <span className="text-2xl mb-1">{comp.icon}</span>
                                <span className="text-xs font-bold text-slate-600 uppercase">{comp.name}</span>
                            </button>
                        ))}
                    </div>
                    <div className="flex-grow flex items-center justify-center p-8">
                         <div className="relative max-w-md w-full h-full max-h-[350px] shadow-2xl rounded-3xl overflow-hidden bg-slate-200 border-8 border-white">
                            {renderUploadControls(HardwareTab.MOUSE)}
                            <img 
                                src={userImages[HardwareTab.MOUSE] || "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=1200"} 
                                alt="Souris" 
                                className="w-full h-full object-contain"
                            />
                            {selectedElement && (
                                <div className="absolute inset-0 bg-teal-900/80 text-white flex flex-col items-center justify-center p-6 text-center animate-fade-in z-40">
                                    <h4 className="text-2xl font-bold mb-4">{selectedElement.name}</h4>
                                    <p className="text-lg leading-relaxed">{selectedElement.description}</p>
                                    <button onClick={() => setSelectedElement(null)} className="mt-6 px-6 py-2 bg-white text-teal-900 rounded-full font-bold">J'ai compris</button>
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            )}

            {/* 5. KEYBOARD - IMAGE FIX (NON-APPLE) */}
            {activeTab === HardwareTab.KEYBOARD && (
                <div className="w-full h-full flex flex-col">
                    {/* Key Inventory */}
                    <div className="bg-white p-4 border-b-2 border-slate-200 grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-2 z-20">
                        {[
                            { name: "Échap", icon: "⎋", desc: "Touche de secours ! Elle sert à annuler une action ou fermer un menu ouvert par erreur." },
                            { name: "Tab", icon: "⇥", desc: "La touche Tabulation. Elle sert à sauter d'une case à une autre dans un formulaire." },
                            { name: "Majuscule", icon: "⇧", desc: "Maintenez-la enfoncée pour écrire une lettre en GRAND." },
                            { name: "Ctrl", icon: "⌃", desc: "La touche Contrôle. Elle sert à faire des raccourcis magiques comme Ctrl+C pour copier." },
                            { name: "Espace", icon: "␣", desc: "La plus grande touche. Elle sert à mettre un vide entre deux mots." },
                            { name: "Alt", icon: "⌥", desc: "Sert à accéder à des fonctions spéciales ou des symboles cachés." },
                            { name: "Entrée", icon: "↵", desc: "La touche de validation. Elle sert à confirmer un choix ou aller à la ligne." },
                            { name: "Effacer", icon: "⌫", desc: "Pour corriger une erreur et supprimer la dernière lettre tapée." },
                            { name: "Suppr", icon: "⌦", desc: "Sert à supprimer un élément sélectionné, comme une photo ou un fichier." }
                        ].map(comp => (
                            <button
                                key={comp.name}
                                onClick={() => handleElementClick(comp.name, comp.desc)}
                                className={`flex flex-col items-center p-2 rounded-xl border-2 transition-all hover:bg-slate-100 shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:shadow-none active:translate-y-1 ${selectedElement?.name === comp.name ? 'border-teal-500 bg-teal-50 scale-105 shadow-[0_4px_0_0_rgba(20,184,166,0.3)]' : 'border-slate-200 bg-slate-50'}`}
                            >
                                <span className="text-xl md:text-2xl mb-1 font-mono font-bold text-teal-600">{comp.icon}</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase">{comp.name}</span>
                            </button>
                        ))}
                    </div>
                    
                    <div className="flex-grow flex flex-col items-center justify-center p-4 bg-slate-100 min-h-[450px]">
                         <div className="relative w-full max-w-5xl h-[350px] md:h-[450px] shadow-2xl rounded-2xl overflow-hidden bg-white border-8 border-white group">
                            {renderUploadControls(HardwareTab.KEYBOARD)}
                            <img 
                                src={userImages[HardwareTab.KEYBOARD] || "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=2071&auto=format&fit=crop"} 
                                alt="Clavier PC Portable Standard" 
                                className="w-full h-full object-contain bg-slate-50 opacity-95 transition-opacity group-hover:opacity-100"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&q=80&w=1600";
                                }}
                            />
                            
                            {/* Information Overlay */}
                            {selectedElement && (
                                <div className="absolute inset-0 bg-slate-900/90 text-white flex flex-col items-center justify-center p-8 text-center animate-fade-in backdrop-blur-md z-40">
                                    <div className="bg-teal-500 text-white w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-xl font-mono font-bold border-b-4 border-teal-700">
                                        {['Échap', 'Tab', 'Majuscule', 'Ctrl', 'Espace', 'Alt', 'Entrée', 'Effacer', 'Suppr'].map((n, i) => n === selectedElement.name ? ['⎋', '⇥', '⇧', '⌃', '␣', '⌥', '↵', '⌫', '⌦'][i] : null)}
                                    </div>
                                    <h4 className="text-3xl font-bold mb-4 text-teal-300">Touche {selectedElement.name}</h4>
                                    <p className="text-xl md:text-2xl leading-relaxed max-w-2xl text-slate-100 font-medium">{selectedElement.description}</p>
                                    <button 
                                        onClick={() => setSelectedElement(null)} 
                                        className="mt-10 px-10 py-3 bg-teal-600 hover:bg-teal-500 text-white rounded-full font-bold text-lg shadow-lg transition-all active:scale-95"
                                    >
                                        Retour au clavier
                                    </button>
                                </div>
                            )}
                            
                            {!selectedElement && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-6 py-2 rounded-full text-white text-xs md:text-sm font-bold pointer-events-none border border-white/20 z-20">
                                    Cliquez sur les touches en haut pour découvrir leurs secrets
                                </div>
                            )}
                         </div>
                    </div>
                </div>
            )}

        </div>

        {/* Footer info box */}
        <div className="mt-6 text-slate-600 text-center text-sm md:text-base bg-teal-50 p-4 rounded-xl border-2 border-teal-100 italic">
             <p>Astuce : Si votre matériel est différent, utilisez le bouton "Ma photo" en haut à gauche pour charger l'image du vôtre !</p>
        </div>

      </div>
    </div>
  );
};
