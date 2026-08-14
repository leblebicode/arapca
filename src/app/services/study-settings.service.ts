import { Injectable, signal } from '@angular/core';
import { StudyDirection, StudyItem } from '../models/lesson.model';

const STORAGE_KEY = 'arapca.v1.direction';

@Injectable({ providedIn: 'root' })
export class StudySettingsService {
  readonly direction = signal<StudyDirection>(this.read());

  setDirection(direction: StudyDirection): void {
    this.direction.set(direction);
    localStorage.setItem(STORAGE_KEY, direction);
  }

  prompt(item: StudyItem): string {
    return this.direction() === 'tr-ar' ? item.meaning : item.arabic;
  }

  answer(item: StudyItem): string {
    return this.direction() === 'tr-ar' ? item.arabic : item.meaning;
  }

  promptIsArabic(): boolean {
    return this.direction() === 'ar-tr';
  }

  answerIsArabic(): boolean {
    return this.direction() === 'tr-ar';
  }

  private read(): StudyDirection {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'ar-tr' ? 'ar-tr' : 'tr-ar';
  }
}
