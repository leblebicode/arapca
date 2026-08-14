import { Injectable } from '@angular/core';
import { LESSONS } from '../data/lessons.data';
import { Lesson } from '../models/lesson.model';

@Injectable({ providedIn: 'root' })
export class LessonService {
  readonly lessons = LESSONS;

  getById(id: number): Lesson | undefined {
    return this.lessons.find((lesson) => lesson.id === id);
  }
}
