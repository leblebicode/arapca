export interface StudyItem {
  id: string;
  arabic: string;
  meaning: string;
}

export type VocabularyItem = StudyItem;
export type SentenceItem = StudyItem;

export interface Lesson {
  id: number;
  title: string;
  vocabulary: VocabularyItem[];
  sentences: SentenceItem[];
}

export type StudyMode = 'flashcard' | 'input' | 'sentences';

export type StudyDirection = 'tr-ar' | 'ar-tr';
