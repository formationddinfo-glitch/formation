// Simple wrapper for the Web Speech API with cross-browser optimizations
let voices: SpeechSynthesisVoice[] = [];
let selectedVoiceURI: string | null = null;
let voicesListeners: (() => void)[] = [];

// Initialize voices and update them when they change
if (typeof window !== 'undefined' && window.speechSynthesis) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices();
    voicesListeners.forEach(listener => listener());
  };
  loadVoices();
  // Ensure the onvoiceschanged event updates the local cache
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  // Return all French voices available
  return voices.filter(v => v.lang.startsWith('fr'));
};

export const setSelectedVoice = (uri: string | null) => {
  selectedVoiceURI = uri;
};

// Allows React components to subscribe to voice list changes
export const onVoicesChanged = (listener: () => void) => {
  voicesListeners.push(listener);
  return () => {
    voicesListeners = voicesListeners.filter(l => l !== listener);
  };
};

export const speak = (text: string) => {
  if (!window.speechSynthesis) return;

  // Cancel any ongoing speech to avoid overlap
  window.speechSynthesis.cancel();

  // Short timeout to ensure the cancel operation is processed by the browser
  setTimeout(() => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Detect browser
    const isFirefox = navigator.userAgent.toLowerCase().includes('firefox');
    
    // Filter for French voices
    const frVoices = voices.filter(v => v.lang.startsWith('fr'));
    
    let voiceToUse: SpeechSynthesisVoice | undefined;

    // Use the user's selected voice if they have chosen one
    if (selectedVoiceURI) {
      voiceToUse = frVoices.find(v => v.voiceURI === selectedVoiceURI);
    }

    // Fallback to the default priority list if no selection or not found
    if (!voiceToUse) {
      // Selection criteria:
      // 1. Google/Microsoft/Natural voices (best)
      // 2. Standard system voices like Hortense or Julie (good)
      // 3. Any French voice (fallback)
      voiceToUse = frVoices.find(v => 
        v.name.includes('Google') || 
        v.name.includes('Microsoft') || 
        v.name.includes('Natural') ||
        v.name.includes('Hortense') || 
        v.name.includes('Julie') ||
        v.name.includes('Premium')
      ) || frVoices[0];
    }

    if (voiceToUse) {
      utterance.voice = voiceToUse;
    }

    utterance.lang = 'fr-FR'; 

    /**
     * Browser specific tuning for clarity:
     * Firefox's default system voices can sound "choppy" if the rate is too low.
     * We keep pitch at 1.0 to avoid distortion.
     */
    if (isFirefox) {
      utterance.rate = 0.9; 
      utterance.pitch = 1.0; 
    } else {
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
    }

    window.speechSynthesis.speak(utterance);
  }, 50);
};

export const stopSpeech = () => {
  if (window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
};
