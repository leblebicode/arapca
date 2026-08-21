import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home-tabs',
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="tabs" aria-label="Ana menü">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dersler</a>
      <a routerLink="/sozluk" routerLinkActive="active">Sözlük</a>
    </nav>
  `,
  styles: `
    .tabs {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
      margin: 0 0 1.8rem;
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
  `,
})
export class HomeTabs {}
