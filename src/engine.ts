import { LOCATIONS, MOODS, type Activity, type Category, type Filters } from "./types.js";

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
export function validateFilters(filters: Filters): string[] {
  const errors: string[] = [];

  if (
    filters.participants !== null &&
    (!Number.isInteger(filters.participants) || filters.participants < 1 || filters.participants > 10)
  ) {
    errors.push("Количество участников должно быть целым числом от 1 до 10");
  }

  if (
    filters.availableMinutes !== null &&
    (!Number.isFinite(filters.availableMinutes) || filters.availableMinutes <= 0)
  ) {
    errors.push("Время должно быть конечным числом больше 0");
  }

  if (
    filters.budgetPerPerson !== null &&
    (!Number.isFinite(filters.budgetPerPerson) || filters.budgetPerPerson < 0)
  ) {
    errors.push("Бюджет должен быть конечным числом не меньше 0");
  }

  if (filters.location !== "any" && !LOCATIONS.includes(filters.location)) {
    errors.push("Указано неизвестное место");
  }

  if (filters.mood !== "any" && !MOODS.includes(filters.mood)) {
    errors.push("Указано неизвестное настроение");
  }

  return errors;
}

/**
 * ЗАДАНИЕ 02. Оставь только активные и подходящие по ЖЁСТКИМ ограничениям занятия.
 * Ошибочные фильтры должны давать пустой массив.
 * Не изменяй исходный каталог.
 */
export function filterActivities(activities: readonly Activity[], filters: Filters): Activity[] {
  if (validateFilters(filters).length > 0) {
    return [];
  }

  return activities.filter(activity =>
    activity.isActive &&
    (filters.participants === null ||
      (activity.minParticipants <= filters.participants && activity.maxParticipants >= filters.participants)) &&
    (filters.availableMinutes === null || activity.durationMinutes <= filters.availableMinutes) &&
    (filters.budgetPerPerson === null || activity.estimatedCostPerPerson <= filters.budgetPerPerson) &&
    (filters.location === "any" || activity.locations.includes(filters.location)),
  );
}

/**
 * ЗАДАНИЯ 03–04. Начисли баллы, составь причины и отсортируй по убыванию score.
 * При равном score сортируй по id. Не мутируй входной массив.
 * preferredTags: бонус начисляется ОДИН раз при хотя бы одном совпадении.
 */
export function rankActivities(
  activities: readonly Activity[],
  filters: Filters,
  interests: readonly Category[],
  preferredTags: readonly string[] = [],
): RankedActivity[] {
  return activities.map(activity => {
    let score = 0;
    const reasons: string[] = [];

    if (filters.mood !== "any" && activity.moods.includes(filters.mood)) {
      score += SCORING.mood;
      reasons.push("Подходит по настроению");
    }

    if (interests.includes(activity.category)) {
      score += SCORING.interest;
      reasons.push("Совпадает с интересами");
    }

    if (activity.tags.some(tag => preferredTags.includes(tag))) {
      score += SCORING.tag;
      reasons.push("Есть предпочтительный тег");
    }

    if (
      filters.availableMinutes !== null &&
      activity.durationMinutes <= filters.availableMinutes &&
      filters.availableMinutes - activity.durationMinutes <= SCORING.timeFitWindowMinutes
    ) {
      score += SCORING.timeFit;
      reasons.push("Укладывается в доступное время с небольшим запасом");
    }

    if (reasons.length === 0) {
      reasons.push("Новая идея для компании");
    }

    return { activity, score, reasons };
  }).sort(
    (left, right) => right.score - left.score || left.activity.id.localeCompare(right.activity.id),
  );
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
  activities: readonly Activity[],
  filters: Filters,
  interests: readonly Category[],
  shownIds: readonly string[] = [],
  random: () => number = Math.random,
  preferredTags: readonly string[] = [],
): RecommendationResult {
  const errors = validateFilters(filters);
  if (errors.length > 0) {
    return { kind: "invalid", errors };
  }

  const eligible = filterActivities(activities, filters);
  if (eligible.length === 0) {
    return { kind: "empty", eligibleCount: 0 };
  }

  const shown = new Set(shownIds);
  const remaining = eligible.filter(activity => !shown.has(activity.id));
  if (remaining.length === 0) {
    return { kind: "exhausted", eligibleCount: eligible.length };
  }

  const ranked = rankActivities(remaining, filters, interests, preferredTags);
  const hasNoConstraints =
    filters.participants === null &&
    filters.availableMinutes === null &&
    filters.budgetPerPerson === null &&
    filters.location === "any" &&
    filters.mood === "any";
  const hasNoPreferences = interests.length === 0 && preferredTags.length === 0;
  const candidates = hasNoConstraints && hasNoPreferences
    ? ranked
    : ranked.slice(0, SCORING.candidateLimit);
  const randomValue = random();
  const index = Number.isFinite(randomValue)
    ? Math.min(candidates.length - 1, Math.max(0, Math.floor(randomValue * candidates.length)))
    : 0;
  const recommendation = candidates[index];

  return {
    kind: "success",
    recommendation,
    eligibleCount: eligible.length,
    remainingCount: remaining.length - 1,
  };
}
