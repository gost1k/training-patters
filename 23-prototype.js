/**
 * PROTOTYPE PATTERN (Паттерн Прототип)
 *
 * Назначение: Позволяет копировать объекты, не вдаваясь в подробности
 * их реализации. Клонирование происходит через интерфейс clone.
 *
 * Идея: Вместо создания через new, копируем существующий образец (прототип).
 * Полезно, когда создание объекта дорого или сложна его инициализация.
 */

// ===================== БАЗОВЫЙ ПРИМЕР =====================

class Prototype {
  clone() {
    throw new Error("clone not implemented");
  }
}

class Shape extends Prototype {
  constructor(x, y, color) {
    super();
    this.x = x;
    this.y = y;
    this.color = color;
  }
  clone() {
    return new Shape(this.x, this.y, this.color);
  }
}

class Circle extends Shape {
  constructor(x, y, color, radius) {
    super(x, y, color);
    this.radius = radius;
  }
  clone() {
    return new Circle(this.x, this.y, this.color, this.radius);
  }
}

class Rectangle extends Shape {
  constructor(x, y, color, width, height) {
    super(x, y, color);
    this.width = width;
    this.height = height;
  }
  clone() {
    return new Rectangle(this.x, this.y, this.color, this.width, this.height);
  }
}

console.log("=== PROTOTYPE: базовый пример ===");
const circle1 = new Circle(10, 20, "red", 15);
const circle2 = circle1.clone();
console.log("Исходный:", circle1);
console.log("Клон:", circle2);

// ===================== ПРАКТИКА: РЕГИСТР ПРОТОТИПОВ =====================

class PrototypeRegistry {
  constructor() {
    this.map = new Map();
  }
  register(key, prototype) {
    this.map.set(key, prototype);
  }
  create(key, overrides = {}) {
    const proto = this.map.get(key);
    if (!proto) throw new Error(`prototype '${key}' not found`);
    const obj = proto.clone();
    Object.assign(obj, overrides);
    return obj;
  }
}

console.log("\n=== PROTOTYPE: реестр ===");
const registry = new PrototypeRegistry();
registry.register("small-red-circle", new Circle(0, 0, "red", 5));
registry.register("large-blue-rect", new Rectangle(0, 0, "blue", 100, 50));
const c = registry.create("small-red-circle", { x: 100, y: 100 });
const r = registry.create("large-blue-rect", { color: "green" });
console.log("Созданные объекты:", c, r);

// ===================== ГЛУБОКОЕ КЛОНИРОВАНИЕ С СОСТОЯНИЕМ =====================

class DocumentPrototype extends Prototype {
  constructor(title, meta, sections) {
    super();
    this.title = title;
    this.meta = { ...meta };
    this.sections = sections.map((s) => ({ ...s }));
  }
  clone() {
    return new DocumentPrototype(
      this.title,
      { ...this.meta },
      this.sections.map((s) => ({ ...s }))
    );
  }
}

console.log("\n=== PROTOTYPE: документ ===");
const doc1 = new DocumentPrototype("Report", { author: "Alice" }, [
  { h: "Intro", t: "..." },
]);
const doc2 = doc1.clone();
doc2.meta.author = "Bob";
doc2.sections[0].t = "Updated";
console.log("Оригинал:", doc1);
console.log("Клон:", doc2);

/**
 * Преимущества:
 * - Быстрое создание объектов на основе прототипов
 * - Снижение дублирования кода и затрат на инициализацию
 *
 * Недостатки:
 * - Сложность корректного глубокого копирования сложных графов объектов
 * - Возможные скрытые зависимости в состоянии
 *
 * Связи:
 * - Может использоваться с Factory/Abstract Factory, где фабрика возвращает клоны
 * - Сочетается с Memento при сохранении состояний
 */
