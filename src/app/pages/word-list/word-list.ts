import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { StudyTabs } from '../../components/study-tabs/study-tabs';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-word-list',
  imports: [RouterLink, StudyTabs],
  templateUrl: './word-list.html',
  styleUrl: './word-list.scss',
})
export class WordList {
  private readonly route = inject(ActivatedRoute);
  private readonly lessons = inject(LessonService);

  private readonly lessonId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  readonly lesson = computed(() => this.lessons.getById(this.lessonId()));
}
