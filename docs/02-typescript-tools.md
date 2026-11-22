# 02. TypeScript-инструменты, которые действительно пригодятся

Это не полный курс языка. Здесь только инструменты для движка. Попробуй все примеры **в отдельном файле**, чтобы увидеть вывод.

## Массивы и методы

```typescript
type Idea = { id: string; price: number; minutes: number };

const ideas: Idea[] = [
  { id: "a", price: 0, minutes: 30 },
  { id: "b", price: 500, minutes: 60 },
  { id: "c", price: 100, minutes: 45 },
];

const affordable = ideas.filter((x) => x.price <= 100);
const names = ideas.map((x) => x.id);
const specific = ideas.find((x) => x.id === "b");
console.log(affordable, names, specific);
```

- `filter` оставляет элементы, для которых условие `true`.
- `map` превращает каждый элемент во что-то другое.
- `find` ищет первый подходящий или `undefined`.
- `some` возвращает true, если **хотя бы один** элемент удовлетворяет условию.
- `includes` проверяет наличие значения в списке.

## Set — для уже показанных вариантов

```typescript
const shownIds = ["a", "b"];
const shown = new Set(shownIds);
const remaining = ideas.filter((idea) => !shown.has(idea.id));
```

`Set` удобен для проверки «такой ID уже был?», без повторного перебора большого массива.

## Не изменяй исходные данные

```typescript
const ordered = [...ideas].sort((a, b) => a.price - b.price);
```

`sort` изменяет **тот массив, на котором вызван**. Создай копию, когда не хочешь испортить каталог.

## readonly, union, null

```typescript
type Place = "home" | "outdoors" | "any";
const limit: number | null = null; // «без ограничения», не ноль!
```

`readonly Activity[]` означает, что функция не должна изменять входной список. `null` обозначает отсутствие ограничения; нулевой бюджет — конкретное ограничение.

**Задание на минуту:** перепиши `filter` так, чтобы оставить занятия до 45 минут. Затем возьми их ID через `map`.

[Дальше: валидация](03-validation.md).
