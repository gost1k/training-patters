/**
 * SINGLETON PATTERN (Паттерн Одиночка)
 * 
 * Назначение: Гарантирует, что у класса есть только один экземпляр,
 * и предоставляет глобальную точку доступа к нему.
 * 
 * Когда использовать:
 * - Когда в программе должен быть единственный экземпляр класса
 * - Когда нужно обеспечить глобальный доступ к этому экземпляру
 * - Когда экземпляр должен быть создан только при первом обращении
 * 
 * Примеры использования:
 * - Логирование
 * - Подключение к базе данных
 * - Настройки приложения
 * - Кэш
 */

// ===== КЛАССИЧЕСКАЯ РЕАЛИЗАЦИЯ =====

class Singleton {
    constructor() {
        // Проверяем, существует ли уже экземпляр
        if (Singleton.instance) {
            // Если экземпляр уже существует, возвращаем его
            return Singleton.instance;
        }
        
        // Если экземпляр не существует, создаем новый
        this.data = "Я единственный экземпляр!";
        this.createdAt = new Date();
        
        // Сохраняем экземпляр в статическом свойстве
        Singleton.instance = this;
        
        // Возвращаем созданный экземпляр
        return this;
    }
    
    // Метод для получения данных
    getData() {
        return this.data;
    }
    
    // Метод для получения времени создания
    getCreatedAt() {
        return this.createdAt;
    }
    
    // Метод для изменения данных
    setData(newData) {
        this.data = newData;
    }
}

// ===== РЕАЛИЗАЦИЯ С ПРИВАТНЫМ КОНСТРУКТОРОМ =====

class SingletonPrivate {
    // Приватное статическое свойство для хранения экземпляра
    static #instance = null;
    
    // Приватный конструктор
    constructor() {
        if (SingletonPrivate.#instance) {
            throw new Error("Нельзя создать новый экземпляр Singleton!");
        }
        
        this.data = "Приватный Singleton";
        this.createdAt = new Date();
    }
    
    // Публичный статический метод для получения экземпляра
    static getInstance() {
        if (!SingletonPrivate.#instance) {
            SingletonPrivate.#instance = new SingletonPrivate();
        }
        return SingletonPrivate.#instance;
    }
    
    getData() {
        return this.data;
    }
    
    setData(newData) {
        this.data = newData;
    }
}

// ===== РЕАЛИЗАЦИЯ С ЗАМЫКАНИЕМ =====

const SingletonClosure = (function() {
    // Приватная переменная для хранения экземпляра
    let instance;
    
    // Приватная функция-конструктор
    function createInstance() {
        return {
            data: "Singleton с замыканием",
            createdAt: new Date(),
            getData() {
                return this.data;
            },
            setData(newData) {
                this.data = newData;
            }
        };
    }
    
    // Возвращаем объект с методом getInstance
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// ===== ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ =====

console.log("=== КЛАССИЧЕСКИЙ SINGLETON ===");

// Создаем первый экземпляр
const instance1 = new Singleton();
console.log("Первый экземпляр:", instance1.getData());
console.log("Время создания:", instance1.getCreatedAt());

// Пытаемся создать второй экземпляр
const instance2 = new Singleton();
console.log("Второй экземпляр:", instance2.getData());
console.log("Время создания:", instance2.getCreatedAt());

// Проверяем, что это один и тот же объект
console.log("Это один объект?", instance1 === instance2); // true

// Изменяем данные через один экземпляр
instance1.setData("Данные изменены!");
console.log("Данные через instance1:", instance1.getData());
console.log("Данные через instance2:", instance2.getData());

console.log("\n=== ПРИВАТНЫЙ SINGLETON ===");

// Получаем экземпляр через getInstance
const privateInstance1 = SingletonPrivate.getInstance();
const privateInstance2 = SingletonPrivate.getInstance();

console.log("Экземпляр 1:", privateInstance1.getData());
console.log("Экземпляр 2:", privateInstance2.getData());
console.log("Это один объект?", privateInstance1 === privateInstance2);

// Попытка создать новый экземпляр вызовет ошибку
try {
    const newInstance = new SingletonPrivate();
} catch (error) {
    console.log("Ошибка:", error.message);
}

console.log("\n=== SINGLETON С ЗАМЫКАНИЕМ ===");

const closureInstance1 = SingletonClosure.getInstance();
const closureInstance2 = SingletonClosure.getInstance();

console.log("Экземпляр 1:", closureInstance1.getData());
console.log("Экземпляр 2:", closureInstance2.getData());
console.log("Это один объект?", closureInstance1 === closureInstance2);

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ЛОГГЕР =====

class Logger {
    constructor() {
        if (Logger.instance) {
            return Logger.instance;
        }
        
        this.logs = [];
        Logger.instance = this;
        return this;
    }
    
    log(message, level = 'INFO') {
        const logEntry = {
            message,
            level,
            timestamp: new Date().toISOString()
        };
        
        this.logs.push(logEntry);
        console.log(`[${level}] ${message} - ${logEntry.timestamp}`);
    }
    
    getLogs() {
        return [...this.logs]; // Возвращаем копию массива
    }
    
    clearLogs() {
        this.logs = [];
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ЛОГГЕР ===");

const logger1 = new Logger();
const logger2 = new Logger();

logger1.log("Приложение запущено");
logger2.log("Пользователь авторизовался", "WARNING");
logger1.log("Данные загружены");

console.log("Все логи:", logger1.getLogs());
console.log("Количество логов:", logger1.getLogs().length);

// Проверяем, что это один и тот же логгер
console.log("Логгеры одинаковые?", logger1 === logger2);

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Гарантирует единственный экземпляр класса
 * - Предоставляет глобальную точку доступа
 * - Отложенная инициализация (ленивая загрузка)
 * - Экономия памяти
 * 
 * НЕДОСТАТКИ:
 * - Глобальное состояние (может усложнить тестирование)
 * - Нарушает принцип единственной ответственности
 * - Может создать проблемы при многопоточности
 * - Сложно отлаживать
 * 
 * АЛЬТЕРНАТИВЫ:
 * - Dependency Injection
 * - Service Locator
 * - Фабрики
 */
