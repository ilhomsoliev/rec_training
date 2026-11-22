# 07. Случайный выбор среди лучших — но не абы как

Если каждый раз брать только первый элемент рейтинга, пользователь будет часто видеть одну и ту же идею. Поэтому выберем **случайно из не более чем 10 лучших**.

```typescript
const ranked = [{ id: "a" }, { id: "b" }, { id: "c" }];
const candidates = ranked.slice(0, 2); // только первые два
const random = () => 0.75; // подмена случайности для теста
const index = Math.floor(random() * candidates.length); // 1
const chosen = candidates[index]; // b
```

`Math.random()` выдаёт числа от 0 включительно до 1 не включительно. Умножение на количество кандидатов и `Math.floor` дают индекс.

## Зачем передавать random аргументом?

```typescript
function pickOne<T>(items: readonly T[], random: () => number = Math.random): T | undefined {
  if (items.length === 0) return undefined;
  const value = random();
  const index = Number.isFinite(value)
    ? Math.min(items.length - 1, Math.max(0, Math.floor(value * items.length)))
    : 0;
  return items[index];
}
```

Это **полная функция-пример для произвольного списка**, которую можно проверить с `() => 0` или `() => 0.999`. Твоё задание — встроить такой принцип в многошаговый `recommend`.

Защита индекса нужна, если кто-то передаст в функцию не настоящий `Math.random`, а некорректное значение `1`, `-1` или `NaN`.

**Нюанс:** внутри топ-10 все элементы выбираются с одинаковым шансом — даже если у них разные score. Это сознательный компромисс ради разнообразия; предложи альтернативу в финале.

[Задание 05](../exercises/05-random-top.md).
