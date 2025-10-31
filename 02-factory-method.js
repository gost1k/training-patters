/**
 * FACTORY METHOD PATTERN (Паттерн Фабричный метод)
 * 
 * Назначение: Определяет интерфейс для создания объектов,
 * но позволяет подклассам решать, какой класс инстанцировать.
 * Фабричный метод позволяет классу делегировать инстанцирование подклассам.
 * 
 * Когда использовать:
 * - Когда заранее неизвестно, объекты каких типов нужно создавать
 * - Когда система должна быть расширяемой новыми типами объектов
 * - Когда нужно вынести логику создания объектов из основного кода
 * - Когда нужно обеспечить возможность переопределения логики создания
 * 
 * Примеры использования:
 * - Создание UI компонентов
 * - Создание различных типов документов
 * - Создание различных типов транспорта
 * - Создание различных типов уведомлений
 */

// ===== АБСТРАКТНЫЕ КЛАССЫ =====

/**
 * Абстрактный класс Creator (Создатель)
 * Определяет интерфейс для создания объектов
 */
class Creator {
    /**
     * Фабричный метод - должен быть переопределен в подклассах
     * @returns {Product} Продукт
     */
    factoryMethod() {
        throw new Error("Метод factoryMethod должен быть переопределен");
    }
    
    /**
     * Основная бизнес-логика, которая использует фабричный метод
     * @returns {string} Результат работы
     */
    someOperation() {
        // Вызываем фабричный метод для создания продукта
        const product = this.factoryMethod();
        
        // Используем созданный продукт
        return `Creator: Работаю с ${product.operation()}`;
    }
}

/**
 * Абстрактный класс Product (Продукт)
 * Определяет интерфейс для объектов, создаваемых фабричным методом
 */
class Product {
    operation() {
        throw new Error("Метод operation должен быть переопределен");
    }
}

// ===== КОНКРЕТНЫЕ ПРОДУКТЫ =====

/**
 * Конкретный продукт A
 */
class ConcreteProductA extends Product {
    operation() {
        return "Результат работы ConcreteProductA";
    }
}

/**
 * Конкретный продукт B
 */
class ConcreteProductB extends Product {
    operation() {
        return "Результат работы ConcreteProductB";
    }
}

// ===== КОНКРЕТНЫЕ СОЗДАТЕЛИ =====

/**
 * Конкретный создатель A
 * Создает ConcreteProductA
 */
class ConcreteCreatorA extends Creator {
    factoryMethod() {
        return new ConcreteProductA();
    }
}

/**
 * Конкретный создатель B
 * Создает ConcreteProductB
 */
class ConcreteCreatorB extends Creator {
    factoryMethod() {
        return new ConcreteProductB();
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР FACTORY METHOD ===");

// Создаем создателей
const creatorA = new ConcreteCreatorA();
const creatorB = new ConcreteCreatorB();

// Используем их
console.log(creatorA.someOperation());
console.log(creatorB.someOperation());

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - СОЗДАНИЕ УВЕДОМЛЕНИЙ =====

/**
 * Абстрактный класс уведомления
 */
class Notification {
    constructor(recipient, message) {
        this.recipient = recipient;
        this.message = message;
    }
    
    send() {
        throw new Error("Метод send должен быть переопределен");
    }
    
    getInfo() {
        return `Уведомление для ${this.recipient}: ${this.message}`;
    }
}

/**
 * Email уведомление
 */
class EmailNotification extends Notification {
    constructor(recipient, message, subject = "Уведомление") {
        super(recipient, message);
        this.subject = subject;
    }
    
    send() {
        return `Email отправлен на ${this.recipient} с темой "${this.subject}": ${this.message}`;
    }
    
    getInfo() {
        return `${super.getInfo()} (Email, тема: ${this.subject})`;
    }
}

/**
 * SMS уведомление
 */
class SMSNotification extends Notification {
    constructor(recipient, message) {
        super(recipient, message);
    }
    
    send() {
        return `SMS отправлено на номер ${this.recipient}: ${this.message}`;
    }
    
    getInfo() {
        return `${super.getInfo()} (SMS)`;
    }
}

/**
 * Push уведомление
 */
class PushNotification extends Notification {
    constructor(recipient, message, title = "Уведомление") {
        super(recipient, message);
        this.title = title;
    }
    
    send() {
        return `Push уведомление "${this.title}" отправлено пользователю ${this.recipient}: ${this.message}`;
    }
    
    getInfo() {
        return `${super.getInfo()} (Push, заголовок: ${this.title})`;
    }
}

/**
 * Абстрактный создатель уведомлений
 */
class NotificationCreator {
    createNotification(recipient, message, options = {}) {
        throw new Error("Метод createNotification должен быть переопределен");
    }
    
    sendNotification(recipient, message, options = {}) {
        const notification = this.createNotification(recipient, message, options);
        console.log(notification.getInfo());
        return notification.send();
    }
}

/**
 * Создатель Email уведомлений
 */
class EmailNotificationCreator extends NotificationCreator {
    createNotification(recipient, message, options = {}) {
        return new EmailNotification(recipient, message, options.subject);
    }
}

/**
 * Создатель SMS уведомлений
 */
class SMSNotificationCreator extends NotificationCreator {
    createNotification(recipient, message, options = {}) {
        return new SMSNotification(recipient, message);
    }
}

/**
 * Создатель Push уведомлений
 */
class PushNotificationCreator extends NotificationCreator {
    createNotification(recipient, message, options = {}) {
        return new PushNotification(recipient, message, options.title);
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - УВЕДОМЛЕНИЯ ===");

// Создаем различные типы создателей уведомлений
const emailCreator = new EmailNotificationCreator();
const smsCreator = new SMSNotificationCreator();
const pushCreator = new PushNotificationCreator();

// Отправляем различные типы уведомлений
console.log(emailCreator.sendNotification("user@example.com", "Добро пожаловать!", { subject: "Приветствие" }));
console.log(smsCreator.sendNotification("+7-999-123-45-67", "Ваш код подтверждения: 1234"));
console.log(pushCreator.sendNotification("user123", "Новое сообщение", { title: "Сообщение" }));

// ===== ПРИМЕР С ПАРАМЕТРИЗОВАННЫМ СОЗДАНИЕМ =====

/**
 * Универсальный создатель уведомлений
 * Может создавать разные типы уведомлений на основе параметра
 */
class UniversalNotificationCreator extends NotificationCreator {
    createNotification(recipient, message, options = {}) {
        const type = options.type || 'email';
        
        switch (type) {
            case 'email':
                return new EmailNotification(recipient, message, options.subject);
            case 'sms':
                return new SMSNotification(recipient, message);
            case 'push':
                return new PushNotification(recipient, message, options.title);
            default:
                throw new Error(`Неизвестный тип уведомления: ${type}`);
        }
    }
}

console.log("\n=== УНИВЕРСАЛЬНЫЙ СОЗДАТЕЛЬ ===");

const universalCreator = new UniversalNotificationCreator();

// Создаем разные типы уведомлений через один создатель
console.log(universalCreator.sendNotification("user@example.com", "Email уведомление", { 
    type: 'email', 
    subject: 'Важное сообщение' 
}));

console.log(universalCreator.sendNotification("+7-999-123-45-67", "SMS уведомление", { 
    type: 'sms' 
}));

console.log(universalCreator.sendNotification("user123", "Push уведомление", { 
    type: 'push', 
    title: 'Новости' 
}));

// ===== ПРИМЕР С КЭШИРОВАНИЕМ =====

/**
 * Создатель с кэшированием созданных объектов
 */
class CachedNotificationCreator extends NotificationCreator {
    constructor() {
        super();
        this.cache = new Map();
    }
    
    createNotification(recipient, message, options = {}) {
        const key = `${recipient}-${message}-${JSON.stringify(options)}`;
        
        if (this.cache.has(key)) {
            console.log("Используем кэшированное уведомление");
            return this.cache.get(key);
        }
        
        const notification = super.createNotification(recipient, message, options);
        this.cache.set(key, notification);
        console.log("Создаем новое уведомление и кэшируем");
        
        return notification;
    }
    
    clearCache() {
        this.cache.clear();
        console.log("Кэш очищен");
    }
}

console.log("\n=== СОЗДАТЕЛЬ С КЭШИРОВАНИЕМ ===");

const cachedCreator = new CachedNotificationCreator();

// Первое создание - создается новый объект
console.log(cachedCreator.sendNotification("user@example.com", "Тестовое сообщение", { 
    type: 'email', 
    subject: 'Тест' 
}));

// Второе создание с теми же параметрами - используется кэш
console.log(cachedCreator.sendNotification("user@example.com", "Тестовое сообщение", { 
    type: 'email', 
    subject: 'Тест' 
}));

// Очищаем кэш
cachedCreator.clearCache();

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Избегает тесной связанности между Creator и конкретными Product
 * - Принцип единственной ответственности: логика создания вынесена в отдельные классы
 * - Принцип открытости/закрытости: можно добавлять новые типы продуктов без изменения существующего кода
 * - Возможность переопределения логики создания в подклассах
 * - Упрощает тестирование
 * 
 * НЕДОСТАТКИ:
 * - Может привести к созданию большого количества подклассов
 * - Усложняет структуру кода
 * - Не подходит для простых случаев, где достаточно простого конструктора
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется вместе с Template Method
 * - Может быть частью Abstract Factory
 * - Связан с Strategy pattern
 */
