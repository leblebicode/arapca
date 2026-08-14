import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { StudyTabs } from '../../components/study-tabs/study-tabs';
import { SentenceItem } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { ProgressService } from '../../services/progress.service';
import { StudySettingsService } from '../../services/study-settings.service';
import { answersMatch } from '../../utils/normalize';

@Component({
  selector: 'app-sentence-mode',
  imports: [RouterLink, StudyTabs],
  templateUrl: './sentence-mode.html',
  styleUrl: './sentence-mode.scss',
})
export class SentenceMode {
  private readonly route = inject(ActivatedRoute);
  private readonly lessons = inject(LessonService);
  private readonly progress = inject(ProgressService);
  readonly settings = inject(StudySettingsService);

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  readonly lesson = computed(() => this.lessons.getById(this.lessonId()));
  readonly deck = signal<SentenceItem[]>([]);
  readonly draft = signal('');
  readonly checked = signal(false);
  readonly correct = signal(false);

  readonly current = computed(() => this.deck()[0] ?? null);
  readonly total = computed(() => this.lesson()?.sentences.length ?? 0);
  readonly learnedCount = computed(() => this.total() - this.deck().length);

  constructor() {
    effect(() => {
      const id = this.lessonId();
      untracked(() => this.loadDeck(id));
    });
  }

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.draft.set(value);
    this.checked.set(false);
  }

  check(): void {
    const item = this.current();
    if (!item || this.checked()) {
      return;
    }
    const expected = this.settings.answer(item);
    this.correct.set(answersMatch(expected, this.draft(), this.settings.answerIsArabic()));
    this.checked.set(true);
  }

  again(): void {
    const item = this.current();
    if (!item) {
      return;
    }
    const rest = this.deck().slice(1);
    this.deck.set([...rest, item]);
    this.clearEntry();
  }

  learned(): void {
    const lesson = this.lesson();
    const item = this.current();
    if (!lesson || !item) {
      return;
    }
    this.progress.markLearned(lesson.id, 'sentences', item.id);
    this.deck.set(this.deck().slice(1));
    this.clearEntry();
  }

  continueAfterCheck(): void {
    if (this.correct()) {
      this.learned();
      return;
    }
    this.again();
  }

  restart(): void {
    const lesson = this.lesson();
    if (!lesson) {
      return;
    }
    this.progress.reset(lesson.id, 'sentences');
    this.deck.set([...lesson.sentences]);
    this.clearEntry();
  }

  private clearEntry(): void {
    this.draft.set('');
    this.checked.set(false);
    this.correct.set(false);
  }

  private loadDeck(id: number): void {
    const lesson = this.lessons.getById(id);
    this.clearEntry();
    if (!lesson) {
      this.deck.set([]);
      return;
    }
    const learned = this.progress.getLearned(lesson.id, 'sentences');
    this.deck.set(lesson.sentences.filter((item) => !learned.has(item.id)));
  }
}
