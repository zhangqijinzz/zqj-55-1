export interface Exhibit {
  id: string;
  name: string;
  era: string;
  material: string;
  tags: string[];
  image: string;
  notes: string;
  visitOrder: number;
  visitDate: string;
  createdAt: number;
  updatedAt: number;
}

export interface Exhibition {
  id: string;
  name: string;
  category: ExhibitionCategory;
  coverColor: string;
  description: string;
  exhibitIds: string[];
  createdAt: number;
  updatedAt: number;
}

export type ExhibitionCategory = 'color' | 'animal' | 'artifact' | 'tech' | 'custom';

export interface ChallengeRecord {
  id: string;
  level: ChallengeLevel;
  exhibitCount: number;
  timeSpent: number;
  exhibitIds: string[];
  completedAt: number;
}

export type ChallengeLevel = 'beginner' | 'intermediate' | 'expert';

export interface VisitRecord {
  date: string;
  exhibitIds: string[];
  count: number;
}

export interface AppState {
  exhibits: Exhibit[];
  exhibitions: Exhibition[];
  challengeRecords: ChallengeRecord[];
}
