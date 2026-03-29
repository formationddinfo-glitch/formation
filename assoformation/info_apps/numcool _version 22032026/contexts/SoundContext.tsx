import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { speak as ttsSpeak, stopSpeech, getAvailableVoices, setSelectedVoice as ttsSetSelectedVoice, onVoicesChanged } from '../services/ttsService';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  speak: (text: string) => void;
  currentSubtitle: string | null;
  availableVoices: SpeechSynthesisVoice[];
  selectedVoiceURI: string | null;
  setSelectedVoiceURI: (uri: string | null) => void;
  isHelpEnabled: boolean;
  toggleHelp: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>("Bienvenue sur Num'Cool ! Choisissez un module pour commencer.");
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | null>(null);
  const [isHelpEnabled, setIsHelpEnabled] = useState(true);

  const toggleHelp = () => {
    setIsHelpEnabled(prev => !prev);
  };

  // Stop sound immediately if toggled off
  useEffect(() => {
    if (!isSoundEnabled) {
      stopSpeech();
    }
  }, [isSoundEnabled]);

  // Load and listen to voice changes
  useEffect(() => {
    const loadStateVoices = () => {
      setAvailableVoices(getAvailableVoices());
    };

    // Initial load
    loadStateVoices();

    // Subscribe to changes
    const unsubscribe = onVoicesChanged(loadStateVoices);
    return () => unsubscribe();
  }, []);

  const handleSetSelectedVoiceURI = (uri: string | null) => {
    setSelectedVoiceURI(uri);
    ttsSetSelectedVoice(uri);
  };

  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  const speak = useCallback((text: string) => {
    // Always update the subtitle so the user can read it
    setCurrentSubtitle(text);

    // Only produce audio if enabled
    if (isSoundEnabled) {
      ttsSpeak(text);
    }
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{
      isSoundEnabled,
      toggleSound,
      speak,
      currentSubtitle,
      availableVoices,
      selectedVoiceURI,
      setSelectedVoiceURI: handleSetSelectedVoiceURI,
      isHelpEnabled,
      toggleHelp
    }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};