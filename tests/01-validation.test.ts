import { describe, expect, it } from "vitest";
import { validateFilters } from "../src/engine.js";
import { DEFAULT_FILTERS, SURPRISE_FILTERS, type Filters } from "../src/types.js";

describe("01 — проверка параметров", () => {
  it("принимает обычные параметры", () => {
    expect(validateFilters(DEFAULT_FILTERS)).toEqual([]);
  });
  it("принимает режим без ограничений", () => {
    expect(validateFilters(SURPRISE_FILTERS)).toEqual([]);
  });
  it("разрешает нулевой бюджет", () => {
    expect(validateFilters({ ...DEFAULT_FILTERS, budgetPerPerson: 0 })).toEqual([]);
  });
  it.each([0, -1, 11, 1.5, Number.NaN])("отклоняет участников: %s", (participants) => {
    expect(validateFilters({ ...DEFAULT_FILTERS, participants }).length).toBeGreaterThan(0);
  });
  it.each([0, -1, Number.POSITIVE_INFINITY, Number.NaN])("отклоняет время: %s", (availableMinutes) => {
    expect(validateFilters({ ...DEFAULT_FILTERS, availableMinutes }).length).toBeGreaterThan(0);
  });
  it.each([-1, Number.NaN, Number.POSITIVE_INFINITY])("отклоняет бюджет: %s", (budgetPerPerson) => {
    expect(validateFilters({ ...DEFAULT_FILTERS, budgetPerPerson }).length).toBeGreaterThan(0);
  });
  it("отклоняет неизвестное место", () => {
    expect(validateFilters({ ...DEFAULT_FILTERS, location: "moon" as Filters["location"] })).not.toEqual([]);
  });
  it("отклоняет неизвестное настроение", () => {
    expect(validateFilters({ ...DEFAULT_FILTERS, mood: "sleepy" as Filters["mood"] })).not.toEqual([]);
  });
  it("собирает несколько ошибок одновременно", () => {
    expect(validateFilters({ ...DEFAULT_FILTERS, participants: 0, budgetPerPerson: -5 }).length).toBeGreaterThanOrEqual(2);
  });
});
