import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HomeTabs } from '../../components/home-tabs/home-tabs';
import { LessonService } from '../../services/lesson.service';

@Component({
  selector: 'app-lesson-list',
  imports: [RouterLink, HomeTabs],
  templateUrl: './lesson-list.html',
  styleUrl: './lesson-list.scss',
})
export class LessonList {
  private readonly lessonsService = inject(LessonService);
  readonly lessons = this.lessonsService.lessons;
}
