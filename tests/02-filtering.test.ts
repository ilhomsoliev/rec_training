import { describe, expect, it } from "vitest";
import { filterActivities } from "../src/engine.js";
import { DEFAULT_FILTERS, SURPRISE_FILTERS, type Activity } from "../src/types.js";

const base: Activity = {
  id: "a", title: "Идея", category: "games", locations: ["home"],
  minParticipants: 2, maxParticipants: 4, durationMinutes: 60,
  estimatedCostPerPerson: 100, moods: ["social"], tags: ["компания"], isActive: true,
};
const filters = { ...DEFAULT_FILTERS, participants: 2, availableMinutes: 60, budgetPerPerson: 100, location: "home" as const };

describe("02 — жёсткая фильтрация", () => {
  it("оставляет подходящее занятие на границе времени и цены", () => {
    expect(filterActivities([base], filters).map(x => x.id)).toEqual(["a"]);
  });
  it("проверяет минимум и максимум участников", () => {
    expect(filterActivities([base], { ...filters, participants: 1 })).toEqual([]);
    expect(filterActivities([base], { ...filters, participants: 5 })).toEqual([]);
  });
  it("не пропускает слишком длинные занятия", () => {
    expect(filterActivities([{ ...base, durationMinutes: 61 }], filters)).toEqual([]);
  });
  it("не пропускает слишком дорогие занятия", () => {
    expect(filterActivities([{ ...base, estimatedCostPerPerson: 101 }], filters)).toEqual([]);
  });
  it("отличает 0 рублей от отсутствия ограничения", () => {
    const items = [base, { ...base, id: "free", estimatedCostPerPerson: 0 }];
    expect(filterActivities(items, { ...filters, budgetPerPerson: 0 }).map(x => x.id)).toEqual(["free"]);
    expect(filterActivities(items, { ...filters, budgetPerPerson: null })).toHaveLength(2);
  });
  it("проверяет место как список, а не одно значение", () => {
    expect(filterActivities([{ ...base, locations: ["outdoors", "home"] }], filters)).toHaveLength(1);
    expect(filterActivities([{ ...base, locations: ["venue"] }], filters)).toEqual([]);
  });
  it("архивные занятия исключаются даже в свободном режиме", () => {
    expect(filterActivities([{ ...base, isActive: false }], SURPRISE_FILTERS)).toEqual([]);
  });
  it("не делает настроение жёстким фильтром", () => {
    expect(filterActivities([base], { ...filters, mood: "calm" })).toHaveLength(1);
  });
  it("при ошибочных параметрах возвращает пустой массив", () => {
    expect(filterActivities([base], { ...filters, participants: 0 })).toEqual([]);
  });
  it("не меняет переданный каталог", () => {
    const frozen = Object.freeze([Object.freeze({ ...base })]);
    expect(() => filterActivities(frozen, filters)).not.toThrow();
    expect(frozen[0].id).toBe("a");
  });
});
