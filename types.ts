

export type GameStage = 
  | 'INTRO' 
  // ACT 1: The "Gifted Child" Test (14 Puzzles - Expanded)
  | 'ACT_1_P1' 
  | 'ACT_1_P2' 
  | 'ACT_1_P3' 
  | 'ACT_1_P4' 
  | 'ACT_1_P5' 
  | 'ACT_1_P6' 
  | 'ACT_1_P7' 
  | 'ACT_1_P8' 
  | 'ACT_1_P9' 
  | 'ACT_1_P10' 
  | 'ACT_1_P11' 
  | 'ACT_1_P12' 
  | 'ACT_1_P13' 
  | 'ACT_1_P14' 
  | 'ACT_1_WIN' 
  // TRANSITION
  | 'TRANSITION' 
  // ACT 2: System Breach (Renumbered P15+)
  | 'ACT_2_INTRO' 
  | 'ACT_2_P15' 
  | 'ACT_2_P16' 
  | 'ACT_2_P17' 
  | 'ACT_2_P18' 
  | 'ACT_2_P19' // Map
  | 'ACT_2_P20' 
  // P21 REMOVED
  | 'ACT_2_P22' // Lock Fear
  | 'ACT_2_P23' // FINAL CORE ROOM
  // ENDINGS
  | 'FINALE_CHOICE' 
  | 'ENDING_1' 
  | 'ENDING_2'
  | 'HAPPY_ENDING' // The False Hope
  | 'CINEMA_ENDING'; // The Truth (Video)

export interface PuzzleData {
  id: string;
  question: string;
  image?: string;
  type: 'text' | 'choice' | 'count' | 'map' | 'lock' | 'core_room';
  options?: string[]; // For choice
  correctAnswer: string;
  hints: string[]; // Changed from single hint to array of 3
}

export interface GameState {
  stage: GameStage;
  hasAudio: boolean;
  inventory: string[];
  mistakes: number;
  startTime: number | null;
  endTime: number | null;
  penaltySeconds: number;
}