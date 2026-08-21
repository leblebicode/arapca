import { Injectable } from '@angular/core';
import { LESSONS } from '../data/lessons.data';
import { Lesson, VocabularyItem } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  readonly lessons = LESSONS;

  getById(id: number): Lesson | undefined {
    return this.lessons.find((lesson) => lesson.id === id);
  }

  getAllVocabulary(): VocabularyItem[] {
    const seen = new Set<string>();
    const words: VocabularyItem[] = [];

    for (const lesson of this.lessons) {
      for (const item of lesson.vocabulary) {
        if (seen.has(item.arabic)) {
          continue;
        }
        seen.add(item.arabic);
        words.push(item);
      }
    }

    return words;
  }
}
