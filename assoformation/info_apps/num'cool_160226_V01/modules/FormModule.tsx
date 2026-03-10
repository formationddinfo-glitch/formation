
import React, { useState, useEffect } from 'react';
import { Button } from '../components/Button';
import { useSound } from '../contexts/SoundContext';
import { ExerciseProps } from '../types';

export const FormModule: React.FC<ExerciseProps> = ({ onBack }) => {
  const { speak } = useSound();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    indicatif: '+33',
    telephone: '',
    civilite: '',
    pays: 'France',
    ingredients: [] as string[],
    loisirs: [] as string[],
    satisfaction: 5,
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    speak("Bienvenue dans le module Formulaire. Les cases avec une étoile rouge sont obligatoires. Remplissez votre nom et votre prénom pour pouvoir envoyer la fiche.");
  }, [speak]);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (value: string) => {
    setFormData(prev => {
      const newLoisirs = prev.loisirs.includes(value)
        ? prev.loisirs.filter(l => l !== value)
        : [...prev.loisirs, value];
      
      if (prev.loisirs.includes(value)) {
        speak(`Vous avez décoché ${value}`);
      } else {
        speak(`Vous avez choisi ${value}`);
      }
      return { ...prev, loisirs: newLoisirs };
    });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
    setFormData(prev => ({ ...prev, ingredients: selectedOptions }));
    
    if (selectedOptions.length > 1) {
        speak(`Vous avez sélectionné ${selectedOptions.length} ingrédients.`);
    } else if (selectedOptions.length === 1) {
        speak(`Ingrédient sélectionné : ${selectedOptions[0]}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nom || !formData.prenom) {
        speak("Attention, les champs avec une étoile rouge sont obligatoires. Veuillez remplir votre Nom et votre Prénom.");
        return;
    }
    setSubmitted(true);
    speak("Formulaire envoyé avec succès ! Bravo !");
  };

  const handleReset = () => {
    setFormData({
        nom: '',
        prenom: '',
        email: '',
        indicatif: '+33',
        telephone: '',
        civilite: '',
        pays: 'France',
        ingredients: [],
        loisirs: [],
        satisfaction: 5,
        message: ''
    });
    setSubmitted(false);
    speak("Le formulaire a été effacé. Vous pouvez recommencer.");
  };

  return (
    <div className="flex flex-col items-center min-h-full w-full p-4 md:p-8 pb-64">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-4 border-pink-100">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
            <Button onClick={onBack} variant="secondary">← Retour</Button>
            <h2 className="text-3xl font-bold text-pink-700">Remplir un formulaire</h2>
            <div className="w-4 md:w-24"></div>
        </div>

        {!submitted && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
                <span className="text-red-500 font-bold text-2xl">*</span>
                <p className="text-red-700 font-semibold">Les champs avec une étoile sont obligatoires.</p>
            </div>
        )}

        {submitted ? (
            <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-8 rounded-lg text-center animate-fade-in">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-3xl font-bold mb-4">Bravo !</h3>
                <p className="text-xl mb-8">Vous avez réussi à remplir et envoyer le formulaire.</p>
                <div className="text-left bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto space-y-2">
                    <p><strong>Nom :</strong> {formData.nom} {formData.prenom}</p>
                    <p><strong>Email :</strong> {formData.email || 'Non renseigné'}</p>
                    <p><strong>Téléphone :</strong> {formData.telephone ? `${formData.indicatif} ${formData.telephone}` : 'Non renseigné'}</p>
                    <p><strong>Pays :</strong> {formData.pays}</p>
                    <p><strong>Ingrédients :</strong> {formData.ingredients.join(', ') || 'Aucun'}</p>
                    <p><strong>Loisirs :</strong> {formData.loisirs.join(', ') || 'Aucun'}</p>
                </div>
                <div className="mt-8">
                     <Button onClick={handleReset} variant="primary">Recommencer</Button>
                </div>
            </div>
        ) : (
            <form onSubmit={handleSubmit} className="space-y-8">
                
                {/* Section 1: Identité */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">1. Qui êtes-vous ?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="nom" className="block text-lg font-semibold text-slate-600 mb-2">
                                Votre Nom <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="nom"
                                value={formData.nom}
                                onChange={(e) => handleInputChange('nom', e.target.value)}
                                onFocus={() => speak("Écrivez votre nom de famille ici. Ce champ est obligatoire.")}
                                className={`w-full text-2xl p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all ${!formData.nom ? 'border-red-200 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                placeholder="Ex: Dupont"
                            />
                        </div>
                        <div>
                            <label htmlFor="prenom" className="block text-lg font-semibold text-slate-600 mb-2">
                                Votre Prénom <span className="text-red-500 font-bold">*</span>
                            </label>
                            <input 
                                type="text" 
                                id="prenom"
                                value={formData.prenom}
                                onChange={(e) => handleInputChange('prenom', e.target.value)}
                                onFocus={() => speak("Écrivez votre prénom ici. Ce champ est obligatoire.")}
                                className={`w-full text-2xl p-4 border-2 rounded-xl focus:ring-4 outline-none transition-all ${!formData.prenom ? 'border-red-200 bg-red-50/30' : 'border-slate-300 focus:border-blue-500 focus:ring-blue-100'}`}
                                placeholder="Ex: Jean"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Coordonnées */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">2. Vos Coordonnées</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="email" className="block text-lg font-semibold text-slate-600 mb-2">Adresse E-mail</label>
                            <input 
                                type="email" 
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                onFocus={() => speak("Écrivez votre adresse mail ici. N'oubliez pas le signe arobase.")}
                                className="w-full text-2xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                placeholder="nom@exemple.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="telephone" className="block text-lg font-semibold text-slate-600 mb-2">Numéro de téléphone</label>
                            <div className="flex gap-2">
                                <select
                                    value={formData.indicatif}
                                    onChange={(e) => {
                                        handleInputChange('indicatif', e.target.value);
                                        speak(`Indicatif pays changé pour ${e.target.selectedOptions[0].text}`);
                                    }}
                                    className="w-1/3 text-xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none bg-white"
                                    aria-label="Indicatif pays"
                                >
                                    <option value="+33">🇫🇷 +33 (FR)</option>
                                    <option value="+32">🇧🇪 +32 (BE)</option>
                                    <option value="+41">🇨🇭 +41 (CH)</option>
                                    <option value="+1">🇨🇦 +1 (CA)</option>
                                </select>
                                <input 
                                    type="tel" 
                                    id="telephone"
                                    value={formData.telephone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9\s]/g, '');
                                        handleInputChange('telephone', val);
                                    }}
                                    onFocus={() => speak("Entrez votre numéro de téléphone sans le premier zéro.")}
                                    className="w-2/3 text-2xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                                    placeholder="06 12 34 56 78"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Informations */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">3. Informations complémentaires</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <span className="block text-lg font-semibold text-slate-600 mb-2">Civilité</span>
                            <div className="flex gap-4">
                                {['Madame', 'Monsieur'].map((option) => (
                                    <label 
                                        key={option} 
                                        className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.civilite === option ? 'bg-blue-100 border-blue-500 text-blue-800' : 'bg-white border-slate-300 hover:bg-slate-100'}`}
                                        onClick={() => {
                                            handleInputChange('civilite', option);
                                            speak(`Vous avez sélectionné ${option}`);
                                        }}
                                    >
                                        <input 
                                            type="radio" 
                                            name="civilite" 
                                            value={option}
                                            checked={formData.civilite === option}
                                            onChange={() => {}}
                                            className="w-6 h-6"
                                        />
                                        <span className="text-xl font-bold">{option}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label htmlFor="pays" className="block text-lg font-semibold text-slate-600 mb-2">Pays de résidence</label>
                            <select 
                                id="pays"
                                value={formData.pays}
                                onChange={(e) => {
                                    handleInputChange('pays', e.target.value);
                                    speak(`Pays choisi : ${e.target.value}`);
                                }}
                                onFocus={() => speak("Cliquez pour voir la liste des pays.")}
                                className="w-full text-2xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white"
                            >
                                <option value="France">France</option>
                                <option value="Belgique">Belgique</option>
                                <option value="Suisse">Suisse</option>
                                <option value="Canada">Canada</option>
                                <option value="Autre">Autre</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section 4: Multi-Select */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">4. Sélection multiple</h3>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                            <label htmlFor="ingredients" className="block text-lg font-semibold text-slate-600 mb-2">
                                Composants d'un ordinateur (Maintenez <span className="text-blue-600 font-bold border border-blue-200 px-1 rounded bg-blue-50 text-sm">Ctrl</span> pour en choisir plusieurs)
                            </label>
                            <select 
                                multiple
                                id="ingredients"
                                value={formData.ingredients}
                                onChange={handleMultiSelectChange}
                                onFocus={() => speak("Pour choisir plusieurs ingrédients, maintenez la touche Contrôle appuyée pendant que vous cliquez.")}
                                className="w-full text-xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none bg-white h-48"
                            >
                                <option value="Microprocesseur">Microprocesseur</option>
                                <option value="Mémoire RAM">Mémoire RAM</option>
                                <option value="Disque dur ssd ">Disque dur ssd </option>
                                <option value="Cable HDMI PC vers TV">Cable HDMI PC vers TV</option>
                                <option value="Cable USB type A/C/micro/mini">Cable USB type A/C/micro/mini</option>
                                <option value="Disque dur externe USB">Disque dur externe USB</option>
                                <option value="carte mère">Carte mère</option>
                                <option value="Carte graphique">Carte graphique</option>
                            </select>
                        </div>
                        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-200 flex flex-col justify-center">
                            <h4 className="text-lg font-bold text-slate-500 mb-2">Votre panier :</h4>
                            {formData.ingredients.length === 0 ? (
                                <p className="text-slate-400 italic">Rien de sélectionné...</p>
                            ) : (
                                <ul className="list-disc pl-5 space-y-1">
                                    {formData.ingredients.map(ing => (
                                        <li key={ing} className="text-xl font-bold text-blue-600">{ing}</li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                {/* Section 5: Preferences */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700 mb-4 border-b pb-2">5. Vos préférences</h3>
                    
                    <div className="mb-8">
                        <span className="block text-lg font-semibold text-slate-600 mb-4">Vos loisirs</span>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {['Sport', 'Musique', 'Lecture', 'Jardinage'].map((loisir) => (
                                <label 
                                    key={loisir}
                                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${formData.loisirs.includes(loisir) ? 'bg-green-100 border-green-500' : 'bg-white border-slate-300'}`}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={formData.loisirs.includes(loisir)}
                                        onChange={() => handleCheckboxChange(loisir)}
                                        className="w-6 h-6 rounded focus:ring-green-500"
                                    />
                                    <span className="text-xl">{loisir}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                         <label htmlFor="range" className="block text-lg font-semibold text-slate-600 mb-2">
                             Satisfaction ({formData.satisfaction}/10)
                         </label>
                         <input 
                            type="range" 
                            id="range"
                            min="0" 
                            max="10" 
                            value={formData.satisfaction}
                            onChange={(e) => handleInputChange('satisfaction', e.target.value)}
                            onFocus={() => speak("C'est un curseur. Faites-le glisser vers la droite pour augmenter la note.")}
                            className="w-full h-4 bg-slate-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                         />
                    </div>
                </div>

                {/* Section 6: Envoi */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <div className="mb-6">
                        <label htmlFor="message" className="block text-lg font-semibold text-slate-600 mb-2">Un dernier mot ?</label>
                        <textarea 
                            id="message"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => handleInputChange('message', e.target.value)}
                            onFocus={() => speak("Vous pouvez écrire un message libre ici.")}
                            className="w-full text-xl p-4 border-2 border-slate-300 rounded-xl focus:border-blue-500 outline-none"
                            placeholder="Écrivez ici..."
                        />
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 items-center border-t pt-6">
                        <Button 
                            onClick={() => {/* Form submit logic */}} 
                            variant="success" 
                            className="w-full md:w-auto text-2xl"
                        >
                            Envoyer le formulaire
                        </Button>

                        <Button 
                            onClick={(e) => { e.preventDefault(); handleReset(); }} 
                            variant="secondary"
                            className="w-full md:w-auto"
                        >
                            Tout effacer
                        </Button>
                    </div>
                </div>

            </form>
        )}
      </div>
    </div>
  );
};
