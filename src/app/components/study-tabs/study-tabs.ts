import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-study-tabs',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="tabs" aria-label="Çalışma biçimi">
      <a [routerLink]="['/lesson', lessonId(), 'flashcard']" routerLinkActive="active">Flashcard</a>
      <a [routerLink]="['/lesson', lessonId(), 'input']" routerLinkActive="active">Yazarak çalış</a>
      <a [routerLink]="['/lesson', lessonId(), 'sentences']" routerLinkActive="active">Cümleler</a>
      <a [routerLink]="['/lesson', lessonId(), 'list']" routerLinkActive="active">Liste</a>
    </nav>
  `,
  styles: `
    .tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 0.2rem;
      margin: 0.2rem 0 1.4rem;
      border-bottom: 1px solid var(--line);
    }

    a {
      padding: 0.65rem 0.7rem;
      border-bottom: 2px solid transparent;
      color: var(--ink-soft);
      text-decoration: none;
      font-size: 0.92rem;
      margin-bottom: -1px;
    }

    a.active,
    a:hover {
      color: var(--ink);
    }

    a.active {
      border-bottom-color: var(--teal);
    }

    @media (max-width: 520px) {
      a {
        flex: 1 1 auto;
        text-align: center;
        font-size: 0.82rem;
        padding-inline: 0.35rem;
      }
    }
  `,
})
export class StudyTabs {
  readonly lessonId = input.required<number>();
}
