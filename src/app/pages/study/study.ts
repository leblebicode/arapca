import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { StudyDirection, StudyMode } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { ProgressService } from '../../services/progress.service';
import { StudySettingsService } from '../../services/study-settings.service';

@Component({
  selector: 'app-study',
  imports: [RouterLink],
  templateUrl: './study.html',
  styleUrl: './study.scss',
})
export class Study {
  private readonly route = inject(ActivatedRoute);
  private readonly lessons = inject(LessonService);
  private readonly progress = inject(ProgressService);
  readonly settings = inject(StudySettingsService);

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  readonly lesson = computed(() => this.lessons.getById(this.lessonId()));

  readonly flashLearned = computed(() => {
    const lesson = this.lesson();
    return lesson ? this.progress.learnedCount(lesson.id, 'flashcard') : 0;
  });

  readonly inputLearned = computed(() => {
    const lesson = this.lesson();
    return lesson ? this.progress.learnedCount(lesson.id, 'input') : 0;
  });

  readonly sentenceLearned = computed(() => {
    const lesson = this.lesson();
    return lesson ? this.progress.learnedCount(lesson.id, 'sentences') : 0;
  });

  readonly hasAnyProgress = computed(
    () => this.flashLearned() > 0 || this.inputLearned() > 0 || this.sentenceLearned() > 0,
  );

  setDirection(direction: StudyDirection): void {
    this.settings.setDirection(direction);
  }

  resetMode(mode: StudyMode): void {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    if (!confirm('Bu modun ilerlemesi silinsin mi?')) {
      return;
    }
    this.progress.reset(lesson.id, mode);
  }

  resetAll(): void {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    if (!confirm('Bu dersteki tüm ilerleme silinsin mi?')) {
      return;
    }
    this.progress.resetLesson(lesson.id);
  }
}
