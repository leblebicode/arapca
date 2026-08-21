import { Component, computed, inject, signal } from '@angular/core';
import { HomeTabs } from '../../components/home-tabs/home-tabs';
import { VocabularyItem } from '../../models/lesson.model';
import { LessonService } from '../../services/lesson.service';
import { textMatchesQuery } from '../../utils/normalize';

const TURKISH_LETTERS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

interface GlossaryGroup {
  letter: string;
  items: VocabularyItem[];
}

@Component({
  selector: 'app-glossary',
  imports: [HomeTabs],
  templateUrl: './glossary.html',
  styleUrl: './glossary.scss',
})
export class Glossary {
  private readonly lessons = inject(LessonService);

  readonly query = signal('');
  readonly allWords = this.lessons.getAllVocabulary();

  readonly groups = computed(() => this.groupWords(this.filteredWords()));
  readonly matchCount = computed(() =>
    this.groups().reduce((sum, group) => sum + group.items.length, 0),
  );

  private filteredWords(): VocabularyItem[] {
    const query = this.query();
    return this.allWords
      .filter((item) => textMatchesQuery(item.arabic, item.meaning, query))
      .sort((a, b) => a.meaning.localeCompare(b.meaning, 'tr'));
  }

  onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  jumpTo(letter: string): void {
    document.getElementById(`harf-${letter}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  private groupWords(words: VocabularyItem[]): GlossaryGroup[] {
    const buckets = new Map<string, VocabularyItem[]>();

    for (const item of words) {
      const letter = this.firstLetter(item.meaning);
      const group = buckets.get(letter) ?? [];
      group.push(item);
      buckets.set(letter, group);
    }

    return [...buckets.entries()]
      .sort((a, b) => this.letterRank(a[0]) - this.letterRank(b[0]))
      .map(([letter, items]) => ({ letter, items }));
  }

  private firstLetter(meaning: string): string {
    const cleaned = meaning.replace(/^[.\s…]+/, '').trim();
    const letter = cleaned.charAt(0).toLocaleUpperCase('tr-TR');
    return letter || '#';
  }

  private letterRank(letter: string): number {
    const index = TURKISH_LETTERS.indexOf(letter);
    return index === -1 ? TURKISH_LETTERS.length + letter.charCodeAt(0) : index;
  }
}
