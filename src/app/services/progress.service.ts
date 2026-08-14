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
    this.remove(this.key(lessonId, mode));
    this.revision.update((n) => n + 1);
  }

  resetLesson(lessonId: number): void {
    this.remove(this.key(lessonId, 'flashcard'));
    this.remove(this.key(lessonId, 'input'));
    this.remove(this.key(lessonId, 'sentences'));
    this.revision.update((n) => n + 1);
  }

  private save(lessonId: number, mode: StudyMode, learned: Set<string>): void {
    localStorage.setItem(this.key(lessonId, mode), JSON.stringify([...learned]));
    this.revision.update((n) => n + 1);
  }

  private remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // Some mobile privacy modes can block storage access.
    }
  }

  private key(lessonId: number, mode: StudyMode): string {
    return `arapca.v1.learned.${lessonId}.${mode}`;
  }
}
