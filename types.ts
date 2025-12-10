export enum Difficulty {
  Easy = 'Easy',
  Medium = 'Medium',
  Hard = 'Hard',
  Insane = 'Insane'
}

export interface ScriptIdea {
  title: string;
  description: string;
  difficulty: Difficulty;
  featureContext?: string; // Hidden context for the AI generator
}

export enum UILibrary {
  Rayfield = 'Rayfield',
  Fluent = 'Fluent',
  Solaris = 'Solaris',
  Orion = 'Orion',
  Kavo = 'Kavo'
}

export interface GeneratorState {
  isLoading: boolean;
  generatedCode: string | null;
  error: string | null;
}