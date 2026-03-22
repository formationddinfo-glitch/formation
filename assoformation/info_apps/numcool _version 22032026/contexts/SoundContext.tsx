import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { speak as ttsSpeak, stopSpeech } from '../services/ttsService';

interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  speak: (text: string) => void;
  currentSubtitle: string | null;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [currentSubtitle, setCurrentSubtitle] = useState<string | null>(null);

  // Stop sound immediately if toggled off
  useEffect(() => {
    if (!isSoundEnabled) {
      stopSpeech();
    }
  }, [isSoundEnabled]);

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
    <SoundContext.Provider value={{ isSoundEnabled, toggleSound, speak, currentSubtitle }}>
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