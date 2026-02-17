
import React, { useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

export const NavigationModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const { speak } = useSound();
    
  useEffect(() => {
    speak("Module Navigation. Pour descendre dans la page, vous pouvez utiliser la petite molette sur votre souris, ou cliquer sur la barre de défilement grise située tout à droite de votre écran et la faire glisser vers le bas.");
  }, [speak]);

  return (
    <div className="flex flex-col h-full bg-slate-100 pb-64">
        {/* Browser Header Overlay */}
        <div className="bg-white p-4 shadow-md flex items-center justify-between sticky top-0 z-10">
            <Button onClick={onBack} variant="secondary">← Retour</Button>
            <div className="flex-1 mx-8 bg-slate-100 p-3 rounded-full text-slate-500 text-center font-mono text-sm md:text-base overflow-hidden whitespace-nowrap">
                https://www.num-cool.fr/le-tresor
            </div>
        </div>

        {/* Educational Instruction Banner */}
        <div className="bg-blue-600 text-white p-4 text-center shadow-lg animate-fade-in flex flex-col md:flex-row items-center justify-center gap-4">
            <span className="text-2xl">💡</span>
            <p className="text-lg md:text-xl font-bold">
                Pour descendre : utilisez la <span className="underline decoration-2 underline-offset-4">molette</span> de la souris OU la <span className="underline decoration-2 underline-offset-4">barre de défilement</span> à droite.
            </p>
        </div>

        <div className="flex-1 overflow-y-auto p-8 text-center space-y-32">
            <div className="h-64 flex flex-col justify-center items-center bg-blue-100 rounded-3xl p-8 border-2 border-blue-200">
                <h2 className="text-4xl font-bold text-blue-800 mb-4">Le haut de la page</h2>
                <p className="text-xl text-blue-600 font-semibold">Le trésor est caché tout en bas !</p>
                <div className="text-6xl animate-bounce mt-8">⬇️</div>
            </div>

            <div className="h-64 flex flex-col justify-center items-center bg-white rounded-3xl p-8 border-2 border-slate-200 shadow-sm">
                <h2 className="text-3xl font-bold text-slate-700">Vous descendez bien...</h2>
                <p className="text-xl text-slate-500">Continuez à faire défiler la page.</p>
            </div>

            <div className="h-64 flex flex-col justify-center items-center bg-purple-100 rounded-3xl p-8 border-2 border-purple-200">
                <h2 className="text-3xl font-bold text-purple-800">On y est presque !</h2>
                <p className="text-xl text-purple-600">Encore un petit effort de molette...</p>
            </div>

            <div className="h-96 flex flex-col justify-center items-center bg-green-100 rounded-3xl p-8 border-4 border-green-400 shadow-xl">
                <div className="text-9xl mb-4 animate-pulse">🎁</div>
                <h2 className="text-4xl font-bold text-green-800 mb-2">BRAVO !</h2>
                <h3 className="text-2xl font-bold text-green-700 mb-6">Vous avez trouvé le trésor !</h3>
                <p className="text-xl mb-8 text-green-800 max-w-lg">
                    Vous savez maintenant naviguer de haut en bas sur un site internet.
                </p>
                <Button onClick={() => speak("Félicitations, vous maîtrisez le défilement ! Vous pouvez retourner au menu.")} variant="success">
                    Terminer l'exercice
                </Button>
            </div>
            
            {/* Safe margin */}
            <div className="h-32"></div>
        </div>
    </div>
  );
};
