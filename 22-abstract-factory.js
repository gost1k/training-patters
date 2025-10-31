/**
 * ABSTRACT FACTORY PATTERN (Абстрактная фабрика)
 *
 * Назначение: Предоставляет интерфейс для создания семейств связанных
 * или зависимых объектов без указания их конкретных классов.
 *
 * Идея: Клиент работает с фабрикой, не зная, какие конкретные продукты
 * она создает. Разные фабрики создают согласованные семейства продуктов.
 */

// ===================== ПРИМЕР: GUI КОМПОНЕНТЫ (Win / Mac) =====================

class Button {
  render() {
    throw new Error("render not implemented");
  }
}
class Checkbox {
  render() {
    throw new Error("render not implemented");
  }
}

class WinButton extends Button {
  render() {
    console.log("[WinButton] Рендер");
  }
}
class WinCheckbox extends Checkbox {
  render() {
    console.log("[WinCheckbox] Рендер");
  }
}
class MacButton extends Button {
  render() {
    console.log("[MacButton] Render");
  }
}
class MacCheckbox extends Checkbox {
  render() {
    console.log("[MacCheckbox] Render");
  }
}

class GUIFactory {
  createButton() {
    throw new Error("createButton not implemented");
  }
  createCheckbox() {
    throw new Error("createCheckbox not implemented");
  }
}
class WinFactory extends GUIFactory {
  createButton() {
    return new WinButton();
  }
  createCheckbox() {
    return new WinCheckbox();
  }
}
class MacFactory extends GUIFactory {
  createButton() {
    return new MacButton();
  }
  createCheckbox() {
    return new MacCheckbox();
  }
}

class Application {
  constructor(factory) {
    this.button = factory.createButton();
    this.checkbox = factory.createCheckbox();
  }
  render() {
    this.button.render();
    this.checkbox.render();
  }
}

console.log("=== ABSTRACT FACTORY: GUI ===");
const appWin = new Application(new WinFactory());
appWin.render();
const appMac = new Application(new MacFactory());
appMac.render();

// ===================== ПРИМЕР: БД ДРАЙВЕРЫ (SQL / NoSQL) =====================

class SqlConnection {
  connect() {
    console.log("[SQL] connect");
  }
  query(q) {
    console.log("[SQL] query:", q);
  }
}
class SqlTransaction {
  begin() {
    console.log("[SQL] tx begin");
  }
  commit() {
    console.log("[SQL] tx commit");
  }
  rollback() {
    console.log("[SQL] tx rollback");
  }
}

class NoSqlConnection {
  connect() {
    console.log("[NoSQL] connect");
  }
  find(coll, f) {
    console.log("[NoSQL] find", coll, f);
  }
}
class NoSqlTransaction {
  begin() {
    console.log("[NoSQL] tx begin");
  }
  commit() {
    console.log("[NoSQL] tx commit");
  }
  rollback() {
    console.log("[NoSQL] tx rollback");
  }
}

class DbFactory {
  createConnection() {
    throw new Error("createConnection not implemented");
  }
  createTransaction() {
    throw new Error("createTransaction not implemented");
  }
}
class SqlFactory extends DbFactory {
  createConnection() {
    return new SqlConnection();
  }
  createTransaction() {
    return new SqlTransaction();
  }
}
class NoSqlFactory extends DbFactory {
  createConnection() {
    return new NoSqlConnection();
  }
  createTransaction() {
    return new NoSqlTransaction();
  }
}

class Repository {
  constructor(factory) {
    this.conn = factory.createConnection();
    this.tx = factory.createTransaction();
  }
  run() {
    this.conn.connect();
    this.tx.begin();
    /* ... */ this.tx.commit();
  }
}

console.log("\n=== ABSTRACT FACTORY: БД ===");
new Repository(new SqlFactory()).run();
new Repository(new NoSqlFactory()).run();

/**
 * Преимущества:
 * - Гарантирует совместимость продуктов внутри семейства
 * - Заменяет целые семейства, не меняя клиентский код
 *
 * Недостатки:
 * - Усложнение из-за множества интерфейсов и классов
 * - Трудно добавлять новые виды продуктов в существующие фабрики
 *
 * Связи:
 * - Часто используется совместно с Factory Method внутри реализации
 * - Может сочетаться с Builder для конфигурируемого создания
 */
