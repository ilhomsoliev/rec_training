import type { Activity } from "../types.js";

/** Небольшой придуманный каталог. Цены условные и нужны лишь для упражнений. */
export const catalog: readonly Activity[] = [
  { id: "a01", title: "Прогулка по скверу", category: "walks", locations: ["outdoors"], minParticipants: 1, maxParticipants: 6, durationMinutes: 60, estimatedCostPerPerson: 0, moods: ["calm", "social"], tags: ["природа"], isActive: true },
  { id: "a02", title: "Вечер настольных игр", category: "games", locations: ["home", "venue"], minParticipants: 2, maxParticipants: 8, durationMinutes: 90, estimatedCostPerPerson: 100, moods: ["social"], tags: ["компания"], isActive: true },
  { id: "a03", title: "Рисование открытки", category: "creative", locations: ["home"], minParticipants: 1, maxParticipants: 4, durationMinutes: 40, estimatedCostPerPerson: 80, moods: ["calm", "creative"], tags: ["бумага"], isActive: true },
  { id: "a04", title: "Пробежка", category: "sport", locations: ["outdoors"], minParticipants: 1, maxParticipants: 5, durationMinutes: 45, estimatedCostPerPerson: 0, moods: ["active"], tags: ["спорт"], isActive: true },
  { id: "a05", title: "Поход в музей", category: "culture", locations: ["venue"], minParticipants: 1, maxParticipants: 10, durationMinutes: 120, estimatedCostPerPerson: 600, moods: ["calm"], tags: ["искусство"], isActive: true },
  { id: "a06", title: "Квиз с друзьями", category: "games", locations: ["venue"], minParticipants: 3, maxParticipants: 10, durationMinutes: 110, estimatedCostPerPerson: 400, moods: ["social", "active"], tags: ["команда"], isActive: true },
  { id: "a07", title: "Посмотреть короткий фильм", category: "culture", locations: ["home"], minParticipants: 1, maxParticipants: 10, durationMinutes: 25, estimatedCostPerPerson: 0, moods: ["calm"], tags: ["кино"], isActive: true },
  { id: "a08", title: "Домашняя зарядка", category: "sport", locations: ["home"], minParticipants: 1, maxParticipants: 2, durationMinutes: 20, estimatedCostPerPerson: 0, moods: ["active"], tags: ["здоровье"], isActive: true },
  { id: "a09", title: "Приготовить десерт", category: "creative", locations: ["home"], minParticipants: 1, maxParticipants: 5, durationMinutes: 75, estimatedCostPerPerson: 250, moods: ["creative", "social"], tags: ["еда"], isActive: true },
  { id: "a10", title: "Велопрогулка", category: "sport", locations: ["outdoors"], minParticipants: 1, maxParticipants: 4, durationMinutes: 90, estimatedCostPerPerson: 0, moods: ["active"], tags: ["природа"], isActive: true },
  { id: "a11", title: "Посетить мастер-класс", category: "creative", locations: ["venue"], minParticipants: 1, maxParticipants: 8, durationMinutes: 150, estimatedCostPerPerson: 1200, moods: ["creative"], tags: ["обучение"], isActive: true },
  { id: "a12", title: "Старая идея (архив)", category: "games", locations: ["home"], minParticipants: 1, maxParticipants: 10, durationMinutes: 30, estimatedCostPerPerson: 0, moods: ["social"], tags: ["игра"], isActive: false },
];
