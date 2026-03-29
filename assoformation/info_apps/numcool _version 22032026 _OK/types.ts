
export enum ModuleType {
  HOME = 'HOME',
  MOUSE = 'MOUSE',
  KEYBOARD = 'KEYBOARD',
  NAVIGATION = 'NAVIGATION',
  SECURITY = 'SECURITY',
  FORM = 'FORM',
  HARDWARE = 'HARDWARE',
  ADVANCED_MOUSE = 'ADVANCED_MOUSE',
  TRAINING = 'TRAINING'
}

export interface ModuleDefinition {
  id: ModuleType;
  title: string;
  description: string;
  icon: string;
  color: string;
  badge?: string;
}

export interface ExerciseProps {
  onComplete: () => void;
  onBack: () => void;
}
