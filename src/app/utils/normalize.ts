const ARABIC_MARKS = /[\u064B-\u065F\u0670\u0640]/g;

export function answersMatch(expected: string, given: string, expectedIsArabic: boolean): boolean {
  if (expectedIsArabic) {
    return normalizeArabic(expected) === normalizeArabic(given);
  }
  return normalizeTurkish(expected) === normalizeTurkish(given);
}

function normalizeArabic(value: string): string {
  return value.trim().replace(ARABIC_MARKS, '').replace(/\s+/g, '');
}

function normalizeTurkish(value: string): string {
  return value.trim().toLocaleLowerCase('tr-TR').replace(/\s+/g, ' ');
}
