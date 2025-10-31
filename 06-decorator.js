/**
 * DECORATOR PATTERN (Паттерн Декоратор)
 *
 * Назначение: Динамически добавляет объекту новые обязанности,
 * не изменяя его исходный код. Декоратор предоставляет гибкую
 * альтернативу наследованию для расширения функциональности.
 *
 * Когда использовать:
 * - Когда нужно динамически добавлять функциональность объектам
 * - Когда нужно избежать создания подклассов для расширения функциональности
 * - Когда нужно комбинировать различные варианты функциональности
 * - Когда нужно добавлять и удалять обязанности во время выполнения
 *
 * Примеры использования:
 * - Обработка ввода/вывода с различными фильтрами
 * - UI компоненты с дополнительными возможностями
 * - Логирование и мониторинг
 * - Кэширование и валидация
 * - Сжатие и шифрование данных
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Абстрактный компонент
 * Определяет интерфейс для объектов, которые могут быть декорированы
 */
class Component {
  /**
   * Операция, которая может быть декорирована
   * @returns {string}
   */
  operation() {
    throw new Error("Метод operation должен быть переопределен");
  }

  /**
   * Возвращает стоимость компонента
   * @returns {number}
   */
  getCost() {
    throw new Error("Метод getCost должен быть переопределен");
  }

  /**
   * Возвращает описание компонента
   * @returns {string}
   */
  getDescription() {
    throw new Error("Метод getDescription должен быть переопределен");
  }
}

/**
 * Конкретный компонент
 * Базовая реализация компонента
 */
class ConcreteComponent extends Component {
  constructor(name = "Базовый компонент", cost = 10) {
    super();
    this.name = name;
    this.cost = cost;
  }

  operation() {
    return `Выполняю операцию: ${this.name}`;
  }

  getCost() {
    return this.cost;
  }

  getDescription() {
    return this.name;
  }
}

/**
 * Абстрактный декоратор
 * Базовый класс для всех декораторов
 */
class Decorator extends Component {
  constructor(component) {
    super();
    this.component = component;
  }

  /**
   * Делегирует операцию обернутому компоненту
   * @returns {string}
   */
  operation() {
    return this.component.operation();
  }

  /**
   * Делегирует получение стоимости обернутому компоненту
   * @returns {number}
   */
  getCost() {
    return this.component.getCost();
  }

  /**
   * Делегирует получение описания обернутому компоненту
   * @returns {string}
   */
  getDescription() {
    return this.component.getDescription();
  }
}

// ===== КОНКРЕТНЫЕ ДЕКОРАТОРЫ =====

/**
 * Декоратор для добавления логирования
 */
class LoggingDecorator extends Decorator {
  constructor(component, loggerName = "Logger") {
    super(component);
    this.loggerName = loggerName;
  }

  operation() {
    console.log(`[${this.loggerName}] Начинаю выполнение операции`);
    const result = super.operation();
    console.log(`[${this.loggerName}] Операция завершена: ${result}`);
    return result;
  }

  getCost() {
    const cost = super.getCost();
    console.log(`[${this.loggerName}] Получена стоимость: ${cost}`);
    return cost;
  }

  getDescription() {
    const description = super.getDescription();
    console.log(`[${this.loggerName}] Получено описание: ${description}`);
    return description;
  }
}

/**
 * Декоратор для добавления кэширования
 */
class CachingDecorator extends Decorator {
  constructor(component) {
    super(component);
    this.cache = new Map();
  }

  operation() {
    const cacheKey = "operation";

    if (this.cache.has(cacheKey)) {
      console.log("[CachingDecorator] Возвращаем результат из кэша");
      return this.cache.get(cacheKey);
    }

    console.log("[CachingDecorator] Выполняем операцию и кэшируем результат");
    const result = super.operation();
    this.cache.set(cacheKey, result);
    return result;
  }

  getCost() {
    const cacheKey = "cost";

    if (this.cache.has(cacheKey)) {
      console.log("[CachingDecorator] Возвращаем стоимость из кэша");
      return this.cache.get(cacheKey);
    }

    console.log("[CachingDecorator] Получаем стоимость и кэшируем");
    const cost = super.getCost();
    this.cache.set(cacheKey, cost);
    return cost;
  }

  /**
   * Очищает кэш
   */
  clearCache() {
    this.cache.clear();
    console.log("[CachingDecorator] Кэш очищен");
  }

  /**
   * Возвращает размер кэша
   * @returns {number}
   */
  getCacheSize() {
    return this.cache.size;
  }
}

/**
 * Декоратор для добавления валидации
 */
class ValidationDecorator extends Decorator {
  constructor(component, validator) {
    super(component);
    this.validator = validator;
  }

  operation() {
    console.log("[ValidationDecorator] Проверяем валидность перед выполнением");

    if (this.validator && !this.validator.isValid()) {
      throw new Error("Компонент не прошел валидацию");
    }

    console.log("[ValidationDecorator] Валидация пройдена, выполняем операцию");
    return super.operation();
  }

  getCost() {
    console.log(
      "[ValidationDecorator] Проверяем валидность перед получением стоимости"
    );

    if (this.validator && !this.validator.isValid()) {
      throw new Error("Компонент не прошел валидацию");
    }

    return super.getCost();
  }
}

/**
 * Простой валидатор
 */
class SimpleValidator {
  constructor() {
    this.valid = true;
  }

  /**
   * Устанавливает валидность
   * @param {boolean} valid - Валидность
   */
  setValid(valid) {
    this.valid = valid;
  }

  /**
   * Проверяет валидность
   * @returns {boolean}
   */
  isValid() {
    return this.valid;
  }
}

/**
 * Декоратор для добавления мониторинга производительности
 */
class PerformanceDecorator extends Decorator {
  constructor(component) {
    super(component);
    this.metrics = {
      operationCount: 0,
      totalOperationTime: 0,
      costRequests: 0,
      totalCostTime: 0,
    };
  }

  operation() {
    const startTime = performance.now();
    this.metrics.operationCount++;

    const result = super.operation();

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    this.metrics.totalOperationTime += executionTime;

    console.log(
      `[PerformanceDecorator] Операция выполнена за ${executionTime.toFixed(
        2
      )}ms`
    );
    return result;
  }

  getCost() {
    const startTime = performance.now();
    this.metrics.costRequests++;

    const cost = super.getCost();

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    this.metrics.totalCostTime += executionTime;

    console.log(
      `[PerformanceDecorator] Получение стоимости заняло ${executionTime.toFixed(
        2
      )}ms`
    );
    return cost;
  }

  /**
   * Возвращает метрики производительности
   * @returns {Object}
   */
  getMetrics() {
    return {
      ...this.metrics,
      averageOperationTime:
        this.metrics.operationCount > 0
          ? this.metrics.totalOperationTime / this.metrics.operationCount
          : 0,
      averageCostTime:
        this.metrics.costRequests > 0
          ? this.metrics.totalCostTime / this.metrics.costRequests
          : 0,
    };
  }

  /**
   * Сбрасывает метрики
   */
  resetMetrics() {
    this.metrics = {
      operationCount: 0,
      totalOperationTime: 0,
      costRequests: 0,
      totalCostTime: 0,
    };
    console.log("[PerformanceDecorator] Метрики сброшены");
  }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР DECORATOR ===");

// Создаем базовый компонент
const basicComponent = new ConcreteComponent("Простой компонент", 25);

console.log("Базовый компонент:");
console.log("Операция:", basicComponent.operation());
console.log("Стоимость:", basicComponent.getCost());
console.log("Описание:", basicComponent.getDescription());

// Декорируем компонент логированием
const loggedComponent = new LoggingDecorator(basicComponent, "Основной логгер");

console.log("\nКомпонент с логированием:");
loggedComponent.operation();
loggedComponent.getCost();

// Декорируем компонент кэшированием
const cachedComponent = new CachingDecorator(basicComponent);

console.log("\nКомпонент с кэшированием:");
cachedComponent.operation(); // Первый вызов - кэшируем
cachedComponent.operation(); // Второй вызов - из кэша
cachedComponent.getCost(); // Первый вызов - кэшируем
cachedComponent.getCost(); // Второй вызов - из кэша

console.log(`Размер кэша: ${cachedComponent.getCacheSize()}`);

// Комбинируем несколько декораторов
const performanceLoggedComponent = new PerformanceDecorator(
  new LoggingDecorator(basicComponent, "Производительность")
);

console.log("\nКомпонент с логированием и мониторингом производительности:");
performanceLoggedComponent.operation();
performanceLoggedComponent.operation();
performanceLoggedComponent.getCost();

console.log(
  "Метрики производительности:",
  performanceLoggedComponent.getMetrics()
);

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА УВЕДОМЛЕНИЙ =====

/**
 * Базовый класс уведомления
 */
class Notification {
  constructor(message, recipient) {
    this.message = message;
    this.recipient = recipient;
    this.sent = false;
    this.sentAt = null;
  }

  send() {
    this.sent = true;
    this.sentAt = new Date();
    return `Уведомление отправлено: "${this.message}" для ${this.recipient}`;
  }

  getMessage() {
    return this.message;
  }

  getRecipient() {
    return this.recipient;
  }

  isSent() {
    return this.sent;
  }

  getSentAt() {
    return this.sentAt;
  }
}

/**
 * Декоратор для добавления приоритета
 */
class PriorityDecorator extends Notification {
  constructor(notification, priority = "normal") {
    super(notification.message, notification.recipient);
    this.notification = notification;
    this.priority = priority;
    this.priorityLevels = { low: 1, normal: 2, high: 3, urgent: 4 };
  }

  send() {
    const priorityPrefix = `[${this.priority.toUpperCase()}] `;
    const result = this.notification.send();
    return priorityPrefix + result;
  }

  getPriority() {
    return this.priority;
  }

  getPriorityLevel() {
    return this.priorityLevels[this.priority] || 0;
  }

  isHighPriority() {
    return this.getPriorityLevel() >= 3;
  }
}

/**
 * Декоратор для добавления шифрования
 */
class EncryptionDecorator extends Notification {
  constructor(notification, encryptionKey = "default-key") {
    super(notification.message, notification.recipient);
    this.notification = notification;
    this.encryptionKey = encryptionKey;
  }

  send() {
    const encryptedMessage = this.encrypt(this.notification.getMessage());
    console.log(
      `[EncryptionDecorator] Сообщение зашифровано: ${encryptedMessage}`
    );

    const result = this.notification.send();
    return result + ` (зашифровано ключом: ${this.encryptionKey})`;
  }

  /**
   * Простое шифрование (для демонстрации)
   * @param {string} message - Сообщение для шифрования
   * @returns {string}
   */
  encrypt(message) {
    return message
      .split("")
      .map((char) =>
        String.fromCharCode(char.charCodeAt(0) + this.encryptionKey.length)
      )
      .join("");
  }

  /**
   * Расшифровка сообщения
   * @param {string} encryptedMessage - Зашифрованное сообщение
   * @returns {string}
   */
  decrypt(encryptedMessage) {
    return encryptedMessage
      .split("")
      .map((char) =>
        String.fromCharCode(char.charCodeAt(0) - this.encryptionKey.length)
      )
      .join("");
  }
}

/**
 * Декоратор для добавления логирования
 */
class NotificationLoggingDecorator extends Notification {
  constructor(notification, logger) {
    super(notification.message, notification.recipient);
    this.notification = notification;
    this.logger = logger;
  }

  send() {
    const startTime = Date.now();

    this.logger.log(`Отправка уведомления для ${this.recipient}`);

    try {
      const result = this.notification.send();
      const endTime = Date.now();
      const duration = endTime - startTime;

      this.logger.log(`Уведомление успешно отправлено за ${duration}ms`);
      return result;
    } catch (error) {
      this.logger.log(`Ошибка отправки уведомления: ${error.message}`);
      throw error;
    }
  }
}

/**
 * Декоратор для добавления повторных попыток
 */
class RetryDecorator extends Notification {
  constructor(notification, maxRetries = 3, delay = 1000) {
    super(notification.message, notification.recipient);
    this.notification = notification;
    this.maxRetries = maxRetries;
    this.delay = delay;
    this.attempts = 0;
  }

  async send() {
    while (this.attempts < this.maxRetries) {
      try {
        this.attempts++;
        console.log(
          `[RetryDecorator] Попытка ${this.attempts}/${this.maxRetries}`
        );

        const result = this.notification.send();
        console.log(`[RetryDecorator] Успешно с попытки ${this.attempts}`);
        return result;
      } catch (error) {
        console.log(
          `[RetryDecorator] Попытка ${this.attempts} не удалась: ${error.message}`
        );

        if (this.attempts >= this.maxRetries) {
          throw new Error(
            `Все попытки исчерпаны. Последняя ошибка: ${error.message}`
          );
        }

        // Ждем перед следующей попыткой
        await this.sleep(this.delay);
      }
    }
  }

  /**
   * Задержка выполнения
   * @param {number} ms - Время задержки в миллисекундах
   * @returns {Promise}
   */
  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  getAttempts() {
    return this.attempts;
  }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА УВЕДОМЛЕНИЙ ===");

// Создаем базовое уведомление
const basicNotification = new Notification("Привет, мир!", "user@example.com");

// Декорируем различными возможностями
const highPriorityNotification = new PriorityDecorator(
  basicNotification,
  "urgent"
);
const encryptedNotification = new EncryptionDecorator(
  highPriorityNotification,
  "secret-key"
);

// Создаем логгер
const notificationLogger = {
  logs: [],
  log(message) {
    const logEntry = { timestamp: new Date().toISOString(), message };
    this.logs.push(logEntry);
    console.log(`[LOG] ${message}`);
  },
  getLogs() {
    return [...this.logs];
  },
};

// Добавляем логирование
const loggedNotification = new NotificationLoggingDecorator(
  encryptedNotification,
  notificationLogger
);

// Добавляем повторные попытки
const retryNotification = new RetryDecorator(loggedNotification, 2, 500);

console.log("Отправляем уведомление с множественными декораторами:");
try {
  const result = retryNotification.send();
  console.log("Результат:", result);
} catch (error) {
  console.log("Ошибка:", error.message);
}

console.log("\nЛоги уведомлений:");
notificationLogger.getLogs().forEach((log) => {
  console.log(`${log.timestamp}: ${log.message}`);
});

// ===== ПРИМЕР С ДИНАМИЧЕСКИМ ДЕКОРИРОВАНИЕМ =====

/**
 * Фабрика декораторов
 */
class DecoratorFactory {
  constructor() {
    this.decorators = new Map();
    this.registerDefaultDecorators();
  }

  /**
   * Регистрирует стандартные декораторы
   */
  registerDefaultDecorators() {
    this.decorators.set("logging", LoggingDecorator);
    this.decorators.set("caching", CachingDecorator);
    this.decorators.set("performance", PerformanceDecorator);
    this.decorators.set("priority", PriorityDecorator);
    this.decorators.set("encryption", EncryptionDecorator);
    this.decorators.set("retry", RetryDecorator);
  }

  /**
   * Регистрирует новый декоратор
   * @param {string} name - Название декоратора
   * @param {Function} decoratorClass - Класс декоратора
   */
  registerDecorator(name, decoratorClass) {
    this.decorators.set(name, decoratorClass);
    console.log(`Декоратор "${name}" зарегистрирован`);
  }

  /**
   * Создает декорированный компонент
   * @param {Component} component - Базовый компонент
   * @param {Array} decoratorNames - Массив названий декораторов
   * @returns {Component} Декорированный компонент
   */
  createDecoratedComponent(component, decoratorNames) {
    let decoratedComponent = component;

    for (const name of decoratorNames) {
      const DecoratorClass = this.decorators.get(name);

      if (!DecoratorClass) {
        console.warn(`Декоратор "${name}" не найден, пропускаем`);
        continue;
      }

      // Создаем экземпляр декоратора с нужными параметрами
      if (name === "priority") {
        decoratedComponent = new DecoratorClass(decoratedComponent, "high");
      } else if (name === "encryption") {
        decoratedComponent = new DecoratorClass(
          decoratedComponent,
          "dynamic-key"
        );
      } else {
        decoratedComponent = new DecoratorClass(decoratedComponent);
      }

      console.log(`Применен декоратор: ${name}`);
    }

    return decoratedComponent;
  }

  /**
   * Возвращает список доступных декораторов
   * @returns {Array}
   */
  getAvailableDecorators() {
    return Array.from(this.decorators.keys());
  }
}

console.log("\n=== ПРИМЕР С ДИНАМИЧЕСКИМ ДЕКОРИРОВАНИЕМ ===");

// Создаем фабрику декораторов
const decoratorFactory = new DecoratorFactory();

console.log("Доступные декораторы:", decoratorFactory.getAvailableDecorators());

// Создаем базовый компонент
const dynamicComponent = new ConcreteComponent("Динамический компонент", 50);

// Динамически применяем декораторы
const decoratedComponent = decoratorFactory.createDecoratedComponent(
  dynamicComponent,
  ["logging", "caching", "performance"]
);

console.log("\nРезультат динамического декорирования:");
decoratedComponent.operation();
decoratedComponent.getCost();

// Показываем метрики производительности
if (decoratedComponent.getMetrics) {
  console.log("Метрики:", decoratedComponent.getMetrics());
}

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Гибкость в добавлении функциональности
 * - Избегает создания подклассов
 * - Позволяет комбинировать функциональность
 * - Поддерживает принцип единственной ответственности
 * - Легко добавлять и удалять декораторы
 * - Поддерживает открытость/закрытость
 *
 * НЕДОСТАТКИ:
 * - Может привести к созданию множества маленьких объектов
 * - Сложно отлаживать код с множественными декораторами
 * - Может усложнить архитектуру
 * - Возможны проблемы с типизацией
 *
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Factory Method
 * - Может быть частью Composite pattern
 * - Связан с Strategy pattern
 * - Используется в Adapter pattern
 */
