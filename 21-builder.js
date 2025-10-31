/**
 * BUILDER PATTERN (Паттерн Строитель)
 *
 * Назначение: Отделяет конструирование сложного объекта от его представления,
 * так что один и тот же процесс конструирования может создавать разные
 * представления.
 *
 * Идея: Director управляет порядком шагов, а конкретные Builder-ы
 * реализуют детали создания частей. Также распространен Fluent Builder.
 */

// ===================== БАЗОВЫЙ ПРИМЕР: СОЗДАНИЕ КОМПЛЕКСНОГО ОБЪЕКТА =====================

class Product {
  constructor() {
    this.parts = [];
  }
  addPart(part) {
    this.parts.push(part);
  }
  description() {
    return `Product with parts: ${this.parts.join(", ")}`;
  }
}

class Builder {
  reset() {
    throw new Error("reset not implemented");
  }
  buildPartA() {
    throw new Error("buildPartA not implemented");
  }
  buildPartB() {
    throw new Error("buildPartB not implemented");
  }
  getResult() {
    throw new Error("getResult not implemented");
  }
}

class ConcreteBuilder1 extends Builder {
  constructor() {
    super();
    this.reset();
  }
  reset() {
    this.product = new Product();
  }
  buildPartA() {
    this.product.addPart("PartA1");
  }
  buildPartB() {
    this.product.addPart("PartB1");
  }
  getResult() {
    const p = this.product;
    this.reset();
    return p;
  }
}

class ConcreteBuilder2 extends Builder {
  constructor() {
    super();
    this.reset();
  }
  reset() {
    this.product = new Product();
  }
  buildPartA() {
    this.product.addPart("PartA2");
  }
  buildPartB() {
    this.product.addPart("PartB2");
  }
  getResult() {
    const p = this.product;
    this.reset();
    return p;
  }
}

class Director {
  setBuilder(builder) {
    this.builder = builder;
  }
  buildMinimalViableProduct() {
    this.builder.reset();
    this.builder.buildPartA();
  }
  buildFullFeaturedProduct() {
    this.builder.reset();
    this.builder.buildPartA();
    this.builder.buildPartB();
  }
}

console.log("=== BUILDER: базовый пример ===");
const director = new Director();
const b1 = new ConcreteBuilder1();
director.setBuilder(b1);
director.buildFullFeaturedProduct();
console.log(b1.getResult().description());
const b2 = new ConcreteBuilder2();
director.setBuilder(b2);
director.buildMinimalViableProduct();
console.log(b2.getResult().description());

// ===================== ПРАКТИКА #1: FLUENT BUILDER ДЛЯ HTTP ЗАПРОСА =====================

class HttpRequest {
  constructor({ method, url, headers, query, body, timeout }) {
    this.method = method;
    this.url = url;
    this.headers = headers;
    this.query = query;
    this.body = body;
    this.timeout = timeout;
  }
}

class HttpRequestBuilder {
  constructor() {
    this.reset();
  }
  reset() {
    this._method = "GET";
    this._url = "/";
    this._headers = {};
    this._query = {};
    this._body = null;
    this._timeout = 30000;
    return this;
  }
  method(m) {
    this._method = m;
    return this;
  }
  url(u) {
    this._url = u;
    return this;
  }
  header(k, v) {
    this._headers[k] = v;
    return this;
  }
  query(k, v) {
    this._query[k] = v;
    return this;
  }
  json(obj) {
    this._body = JSON.stringify(obj);
    this.header("Content-Type", "application/json");
    return this;
  }
  timeout(ms) {
    this._timeout = ms;
    return this;
  }
  build() {
    const req = new HttpRequest({
      method: this._method,
      url: this._url,
      headers: { ...this._headers },
      query: { ...this._query },
      body: this._body,
      timeout: this._timeout,
    });
    this.reset();
    return req;
  }
}

console.log("\n=== BUILDER: HTTP запрос ===");
const req = new HttpRequestBuilder()
  .method("POST")
  .url("/api/users")
  .header("X-Trace-Id", "abc123")
  .query("active", "true")
  .json({ name: "Alice", age: 30 })
  .timeout(10000)
  .build();
console.log("Request:", req);

// ===================== ПРАКТИКА #2: ПОСТРОЕНИЕ ДОМА =====================

class House {
  constructor({ walls, roof, windows, doors, garage, pool, garden }) {
    this.walls = walls;
    this.roof = roof;
    this.windows = windows;
    this.doors = doors;
    this.garage = garage;
    this.pool = pool;
    this.garden = garden;
  }
  description() {
    return `House: walls=${this.walls}, roof=${this.roof}, windows=${this.windows}, doors=${this.doors}, garage=${this.garage}, pool=${this.pool}, garden=${this.garden}`;
  }
}

class HouseBuilder {
  constructor() {
    this.reset();
  }
  reset() {
    this._walls = 4;
    this._roof = "gabled";
    this._windows = 4;
    this._doors = 1;
    this._garage = false;
    this._pool = false;
    this._garden = false;
    return this;
  }
  walls(n) {
    this._walls = n;
    return this;
  }
  roof(type) {
    this._roof = type;
    return this;
  }
  windows(n) {
    this._windows = n;
    return this;
  }
  doors(n) {
    this._doors = n;
    return this;
  }
  garage(v = true) {
    this._garage = v;
    return this;
  }
  pool(v = true) {
    this._pool = v;
    return this;
  }
  garden(v = true) {
    this._garden = v;
    return this;
  }
  build() {
    const h = new House({
      walls: this._walls,
      roof: this._roof,
      windows: this._windows,
      doors: this._doors,
      garage: this._garage,
      pool: this._pool,
      garden: this._garden,
    });
    this.reset();
    return h;
  }
}

console.log("\n=== BUILDER: дом ===");
const cottage = new HouseBuilder().windows(6).garden().build();
const villa = new HouseBuilder()
  .walls(10)
  .roof("flat")
  .windows(12)
  .doors(4)
  .garage()
  .pool()
  .garden()
  .build();
console.log(cottage.description());
console.log(villa.description());

/**
 * Преимущества:
 * - Контроль пошагового создания сложных объектов
 * - Разные представления через разные билдеры или конфигурации
 * - Удобный Fluent API
 *
 * Недостатки:
 * - Больше классов/кода по сравнению с конструктором
 * - Не всегда необходим для простых объектов
 *
 * Связи:
 * - Часто используется с Director; может сочетаться с Abstract Factory
 */
