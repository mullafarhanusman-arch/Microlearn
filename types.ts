export enum AudienceLevel {
  ELEMENTARY = '5th Grade',
  MIDDLE_SCHOOL = '8th Grade',
  HIGH_SCHOOL = 'High School',
  UNIVERSITY = 'University Intro',
  PROFESSIONAL = 'Professional',
  EXPERT = 'Post-Graduate Expert'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface ResearchPaper {
  title: string;
  source: string;
  date: string;
  summary: string;
  url?: string;
}

export interface Microlesson {
  title: string;
  targetAudience: string;
  objective: string;
  keyConcepts: string[];
  content: string;
  quiz: QuizQuestion[];
  researchPapers?: ResearchPaper[];
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
  error?: string;
}