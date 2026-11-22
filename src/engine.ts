import type { Activity, Category, Filters } from "./types.js";

export const SCORING = {
  mood: 3,
  interest: 2,
  tag: 1,
  timeFit: 1,
  timeFitWindowMinutes: 30,
  candidateLimit: 10,
} as const;

export interface RankedActivity {
  activity: Activity;
  score: number;
  reasons: string[];
}

export type RecommendationResult =
  | { kind: "success"; recommendation: RankedActivity; eligibleCount: number; remainingCount: number }
  | { kind: "empty" | "exhausted"; eligibleCount: number }
  | { kind: "invalid"; errors: string[] };

/**
 * ЗАДАНИЕ 01. Верни список ошибок. Если всё верно — [].
 * Проверь участников (1–10), время (>0), бюджет (>=0), место и настроение.
 * null и "any" означают отсутствие соответствующего ограничения.
 */
export function validateFilters(_filters: Filters): string[] {
  // TODO: начни с этого
  return [];
}

/**
 * ЗАДАНИЕ 02. Оставь только активные и подходящие по ЖЁСТКИМ ограничениям занятия.
 * Ошибочные фильтры должны давать пустой массив.
 * Не изменяй исходный каталог.
 */
export function filterActivities(activities: readonly Activity[], _filters: Filters): Activity[] {
  // TODO: этот временный вариант НЕ фильтрует
  return [...activities];
}

/**
 * ЗАДАНИЯ 03–04. Начисли баллы, составь причины и отсортируй по убыванию score.
 * При равном score сортируй по id. Не мутируй входной массив.
 * preferredTags: бонус начисляется ОДИН раз при хотя бы одном совпадении.
 */
export function rankActivities(
  activities: readonly Activity[],
  _filters: Filters,
  _interests: readonly Category[],
  _preferredTags: readonly string[] = [],
): RankedActivity[] {
  // TODO: оценки пока фиктивные
  return activities.map(activity => ({ activity, score: 0, reasons: ["Пока без объяснения"] }));
}

/**
 * ЗАДАНИЯ 05–07. Собери полный процесс:
 * проверка → фильтрация → исключение показанных → ранжирование →
 * выбор из не более чем 10 лучших → результат.
 *
 * random можно подменить в тестах на () => 0 или () => 0.999.
 * preferredTags передай в rankActivities (не потеряй аргумент).
 */
export function recommend(
  _activities: readonly Activity[],
  _filters: Filters,
  _interests: readonly Category[],
  _shownIds: readonly string[] = [],
  _random: () => number = Math.random,
  _preferredTags: readonly string[] = [],
): RecommendationResult {
  // TODO: замени заглушку своим алгоритмом
  return { kind: "empty", eligibleCount: 0 };
}
