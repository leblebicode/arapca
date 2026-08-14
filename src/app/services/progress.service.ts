import { Injectable, signal } from '@angular/core';
import { StudyMode } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly revision = signal(0);

  learnedCount(lessonId: number, mode: StudyMode): number {
    this.revision();
    return this.getLearned(lessonId, mode).size;
  }

  getLearned(lessonId: number, mode: StudyMode): Set<string> {
    this.revision();
    try {
      const raw = localStorage.getItem(this.key(lessonId, mode));
      const ids = raw ? (JSON.parse(raw) as string[]) : [];
      return new Set(ids);
    } catch {
      return new Set();
    }
  }

  markLearned(lessonId: number, mode: StudyMode, vocabId: string): void {
    const learned = this.getLearned(lessonId, mode);
    learned.add(vocabId);
    this.save(lessonId, mode, learned);
  }

  reset(lessonId: number, mode: StudyMode): void {
    localStorage.removeItem(this.key(lessonId, mode));
    this.revision.update((n) => n + 1);
  }

  resetLesson(lessonId: number): void {
    this.reset(lessonId, 'flashcard');
    this.reset(lessonId, 'input');
    this.reset(lessonId, 'sentences');
  }

  private save(lessonId: number, mode: StudyMode, learned: Set<string>): void {
    localStorage.setItem(this.key(lessonId, mode), JSON.stringify([...learned]));
    this.revision.update((n) => n + 1);
  }

  private key(lessonId: number, mode: StudyMode): string {
    return `medine.v1.learned.${lessonId}.${mode}`;
  }
}
