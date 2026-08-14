import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { StudyTabs } from '../../components/study-tabs/study-tabs';
import { VocabularyItem } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { ProgressService } from '../../services/progress.service';
import { StudySettingsService } from '../../services/study-settings.service';

@Component({
  selector: 'app-flashcard',
  imports: [RouterLink, StudyTabs],
  templateUrl: './flashcard.html',
  styleUrl: './flashcard.scss',
})
export class Flashcard {
  private readonly route = inject(ActivatedRoute);
  private readonly lessons = inject(LessonService);
  private readonly progress = inject(ProgressService);
  readonly settings = inject(StudySettingsService);

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  readonly lesson = computed(() => this.lessons.getById(this.lessonId()));
  readonly deck = signal<VocabularyItem[]>([]);
  readonly flipped = signal(false);

  readonly current = computed(() => this.deck()[0] ?? null);
  readonly visible = computed(() => {
    const item = this.current();
    return item ? [item] : [];
  });
  readonly total = computed(() => this.lesson()?.vocabulary.length ?? 0);
  readonly learnedCount = computed(() => this.total() - this.deck().length);

  constructor() {
    effect(() => {
      const id = this.lessonId();
      untracked(() => this.loadDeck(id));
    });
  }

  flip(): void {
    if (this.current()) {
      this.flipped.update((value) => !value);
    }
  }

  again(): void {
    const item = this.current();
    if (!item) {
      return;
    }
    this.flipped.set(false);
    const rest = this.deck().slice(1);
    this.deck.set([...rest, item]);
  }

  learned(): void {
    const lesson = this.lesson();
    const item = this.current();
    if (!lesson || !item) {
      return;
    }
    this.progress.markLearned(lesson.id, 'flashcard', item.id);
    this.flipped.set(false);
    this.deck.set(this.deck().slice(1));
  }

  restart(): void {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    this.progress.reset(lesson.id, 'flashcard');
    this.flipped.set(false);
    this.deck.set([...lesson.vocabulary]);
  }

  private loadDeck(id: number): void {
    const lesson = this.lessons.getById(id);
    this.flipped.set(false);
    if (!lesson) {
      this.deck.set([]);
      return;
    }
    const learned = this.progress.getLearned(lesson.id, 'flashcard');
    this.deck.set(lesson.vocabulary.filter((item) => !learned.has(item.id)));
  }
}
