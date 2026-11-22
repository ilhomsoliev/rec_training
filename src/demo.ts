import { catalog } from "./data/catalog.js";
import { recommend } from "./engine.js";
import { DEFAULT_FILTERS, SURPRISE_FILTERS } from "./types.js";

const first = recommend(catalog, DEFAULT_FILTERS, ["games"], [], () => 0);
console.log("Обычный подбор:");
if (first.kind === "success") {
  console.log(first.recommendation.activity.title);
  console.log("Баллы:", first.recommendation.score);
  console.log("Почему:", first.recommendation.reasons.join("; "));
  const next = recommend(catalog, DEFAULT_FILTERS, ["games"], [first.recommendation.activity.id], () => 0);
  console.log("После «Другое»:", next.kind === "success" ? next.recommendation.activity.title : next.kind);
} else {
  console.log("Пока:", first.kind, "(допиши алгоритм в src/engine.ts)");
}
const surprise = recommend(catalog, SURPRISE_FILTERS, [], [], () => 0.5);
console.log("«Удиви меня»:", surprise.kind === "success" ? surprise.recommendation.activity.title : surprise.kind);
