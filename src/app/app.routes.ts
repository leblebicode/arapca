import { Routes } from '@angular/router';
import { Flashcard } from './pages/flashcard/flashcard';
import { InputMode } from './pages/input-mode/input-mode';
import { LessonList } from './pages/lesson-list/lesson-list';
import { SentenceMode } from './pages/sentence-mode/sentence-mode';
import { Study } from './pages/study/study';
import { WordList } from './pages/word-list/word-list';

export const routes: Routes = [
  { path: '', component: LessonList },
  { path: 'lesson/:id', component: Study },
  { path: 'lesson/:id/flashcard', component: Flashcard },
  { path: 'lesson/:id/input', component: InputMode },
  { path: 'lesson/:id/sentences', component: SentenceMode },
  { path: 'lesson/:id/list', component: WordList },
  { path: '**', redirectTo: '' },
];
