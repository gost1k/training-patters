/**
 * OBSERVER PATTERN (Паттерн Наблюдатель)
 * 
 * Назначение: Определяет зависимость типа "один ко многим" между объектами
 * так, что при изменении состояния одного объекта все зависящие от него
 * объекты уведомляются и обновляются автоматически.
 * 
 * Когда использовать:
 * - Когда нужно уведомить множество объектов об изменении состояния
 * - Когда изменение в одном объекте требует изменения в других объектах
 * - Когда нужно реализовать слабую связанность между объектами
 * - Когда нужно реализовать систему событий
 * 
 * Примеры использования:
 * - Система событий в UI
 * - Модель-Представление (MVC)
 * - Уведомления пользователей
 * - Логирование
 * - Кэширование
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Интерфейс для наблюдателей
 * Все наблюдатели должны реализовывать метод update
 */
class Observer {
    /**
     * Метод, который вызывается при изменении состояния субъекта
     * @param {Subject} subject - Субъект, который изменился
     * @param {*} data - Дополнительные данные об изменении
     */
    update(subject, data) {
        throw new Error("Метод update должен быть переопределен");
    }
}

/**
 * Интерфейс для субъекта
 * Субъект уведомляет всех наблюдателей об изменениях
 */
class Subject {
    constructor() {
        // Массив наблюдателей
        this.observers = [];
    }
    
    /**
     * Добавляет нового наблюдателя
     * @param {Observer} observer - Наблюдатель для добавления
     */
    attach(observer) {
        // Проверяем, что наблюдатель еще не добавлен
        if (!this.observers.includes(observer)) {
            this.observers.push(observer);
            console.log(`Наблюдатель ${observer.constructor.name} добавлен`);
        }
    }
    
    /**
     * Удаляет наблюдателя
     * @param {Observer} observer - Наблюдатель для удаления
     */
    detach(observer) {
        const index = this.observers.indexOf(observer);
        if (index !== -1) {
            this.observers.splice(index, 1);
            console.log(`Наблюдатель ${observer.constructor.name} удален`);
        }
    }
    
    /**
     * Уведомляет всех наблюдателей об изменении
     * @param {*} data - Дополнительные данные об изменении
     */
    notify(data = null) {
        console.log(`Уведомляем ${this.observers.length} наблюдателей`);
        this.observers.forEach(observer => {
            try {
                observer.update(this, data);
            } catch (error) {
                console.error(`Ошибка при уведомлении наблюдателя ${observer.constructor.name}:`, error);
            }
        });
    }
    
    /**
     * Возвращает количество наблюдателей
     * @returns {number}
     */
    getObserverCount() {
        return this.observers.length;
    }
}

// ===== КОНКРЕТНЫЕ РЕАЛИЗАЦИИ =====

/**
 * Конкретный субъект - счетчик
 */
class Counter extends Subject {
    constructor() {
        super();
        this.value = 0;
    }
    
    /**
     * Увеличивает значение счетчика
     */
    increment() {
        this.value++;
        console.log(`Счетчик увеличен до ${this.value}`);
        // Уведомляем всех наблюдателей об изменении
        this.notify({ type: 'increment', value: this.value });
    }
    
    /**
     * Уменьшает значение счетчика
     */
    decrement() {
        this.value--;
        console.log(`Счетчик уменьшен до ${this.value}`);
        // Уведомляем всех наблюдателей об изменении
        this.notify({ type: 'decrement', value: this.value });
    }
    
    /**
     * Устанавливает значение счетчика
     * @param {number} value - Новое значение
     */
    setValue(value) {
        const oldValue = this.value;
        this.value = value;
        console.log(`Счетчик изменен с ${oldValue} на ${this.value}`);
        // Уведомляем всех наблюдателей об изменении
        this.notify({ type: 'set', oldValue, newValue: this.value });
    }
    
    /**
     * Возвращает текущее значение счетчика
     * @returns {number}
     */
    getValue() {
        return this.value;
    }
}

/**
 * Конкретный наблюдатель - логировщик
 */
class Logger extends Observer {
    constructor(name = 'Logger') {
        super();
        this.name = name;
        this.logs = [];
    }
    
    update(subject, data) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            subject: subject.constructor.name,
            data: data,
            subjectValue: subject.getValue ? subject.getValue() : 'N/A'
        };
        
        this.logs.push(logEntry);
        
        console.log(`[${this.name}] Получено уведомление:`, logEntry);
    }
    
    /**
     * Возвращает все логи
     * @returns {Array}
     */
    getLogs() {
        return [...this.logs];
    }
    
    /**
     * Очищает логи
     */
    clearLogs() {
        this.logs = [];
    }
}

/**
 * Конкретный наблюдатель - дисплей
 */
class Display extends Observer {
    constructor(name = 'Display') {
        super();
        this.name = name;
    }
    
    update(subject, data) {
        if (subject.getValue) {
            const value = subject.getValue();
            console.log(`[${this.name}] Отображаем значение: ${value}`);
            
            // Здесь можно добавить логику для обновления UI
            if (data && data.type === 'increment') {
                console.log(`[${this.name}] Значение увеличилось!`);
            } else if (data && data.type === 'decrement') {
                console.log(`[${this.name}] Значение уменьшилось!`);
            }
        }
    }
}

/**
 * Конкретный наблюдатель - уведомления
 */
class Notifier extends Observer {
    constructor(name = 'Notifier') {
        super();
        this.name = name;
    }
    
    update(subject, data) {
        if (data && data.type === 'set' && data.newValue === 0) {
            console.log(`[${this.name}] ВНИМАНИЕ! Счетчик сброшен в ноль!`);
        } else if (data && data.type === 'increment' && data.value === 10) {
            console.log(`[${this.name}] Поздравляем! Достигнуто значение 10!`);
        }
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР OBSERVER ===");

// Создаем субъект (счетчик)
const counter = new Counter();

// Создаем наблюдателей
const logger = new Logger('Основной логгер');
const display = new Display('Главный дисплей');
const notifier = new Notifier('Система уведомлений');

// Подписываем наблюдателей на счетчик
counter.attach(logger);
counter.attach(display);
counter.attach(notifier);

console.log(`Количество наблюдателей: ${counter.getObserverCount()}`);

// Изменяем состояние счетчика
counter.increment();
counter.increment();
counter.setValue(10);
counter.decrement();
counter.setValue(0);

// Получаем логи
console.log("\nЛоги логгера:");
console.log(logger.getLogs());

// ===== ПРИМЕР С РАЗЛИЧНЫМИ ТИПАМИ УВЕДОМЛЕНИЙ =====

/**
 * Расширенный субъект с различными типами событий
 */
class EventEmitter extends Subject {
    constructor() {
        super();
        this.events = {};
    }
    
    /**
     * Подписывает наблюдателя на конкретное событие
     * @param {string} event - Название события
     * @param {Observer} observer - Наблюдатель
     */
    on(event, observer) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        
        if (!this.events[event].includes(observer)) {
            this.events[event].push(observer);
            console.log(`Наблюдатель ${observer.constructor.name} подписан на событие "${event}"`);
        }
    }
    
    /**
     * Отписывает наблюдателя от конкретного события
     * @param {string} event - Название события
     * @param {Observer} observer - Наблюдатель
     */
    off(event, observer) {
        if (this.events[event]) {
            const index = this.events[event].indexOf(observer);
            if (index !== -1) {
                this.events[event].splice(index, 1);
                console.log(`Наблюдатель ${observer.constructor.name} отписан от события "${event}"`);
            }
        }
    }
    
    /**
     * Генерирует событие
     * @param {string} event - Название события
     * @param {*} data - Данные события
     */
    emit(event, data = null) {
        if (this.events[event]) {
            console.log(`Генерируем событие "${event}"`);
            this.events[event].forEach(observer => {
                try {
                    observer.update(this, { event, data });
                } catch (error) {
                    console.error(`Ошибка при обработке события "${event}":`, error);
                }
            });
        }
    }
    
    /**
     * Возвращает количество наблюдателей для конкретного события
     * @param {string} event - Название события
     * @returns {number}
     */
    getEventObserverCount(event) {
        return this.events[event] ? this.events[event].length : 0;
    }
}

/**
 * Специализированный наблюдатель для событий
 */
class EventLogger extends Observer {
    constructor(name = 'EventLogger') {
        super();
        this.name = name;
        this.eventLogs = new Map();
    }
    
    update(subject, data) {
        if (data && data.event) {
            const event = data.event;
            
            if (!this.eventLogs.has(event)) {
                this.eventLogs.set(event, []);
            }
            
            const logEntry = {
                timestamp: new Date().toISOString(),
                event: event,
                data: data.data
            };
            
            this.eventLogs.get(event).push(logEntry);
            console.log(`[${this.name}] Событие "${event}":`, logEntry);
        }
    }
    
    /**
     * Возвращает логи для конкретного события
     * @param {string} event - Название события
     * @returns {Array}
     */
    getEventLogs(event) {
        return this.eventLogs.has(event) ? [...this.eventLogs.get(event)] : [];
    }
    
    /**
     * Возвращает все события
     * @returns {Array}
     */
    getAllEvents() {
        return Array.from(this.eventLogs.keys());
    }
}

console.log("\n=== ПРИМЕР С СОБЫТИЯМИ ===");

// Создаем эмиттер событий
const eventEmitter = new EventEmitter();

// Создаем специализированных наблюдателей
const userLogger = new EventLogger('Пользовательский логгер');
const systemLogger = new EventLogger('Системный логгер');

// Подписываем на различные события
eventEmitter.on('user.login', userLogger);
eventEmitter.on('user.logout', userLogger);
eventEmitter.on('system.start', systemLogger);
eventEmitter.on('system.error', systemLogger);

// Генерируем события
eventEmitter.emit('user.login', { userId: 123, username: 'john_doe' });
eventEmitter.emit('system.start', { version: '1.0.0' });
eventEmitter.emit('user.logout', { userId: 123 });
eventEmitter.emit('system.error', { code: 500, message: 'Internal Server Error' });

// Проверяем логи
console.log("\nСобытия пользователя:", userLogger.getAllEvents());
console.log("Логи входа:", userLogger.getEventLogs('user.login'));

// ===== ПРИМЕР С АВТООТПИСКОЙ =====

/**
 * Наблюдатель с автоматической отпиской
 */
class AutoDetachObserver extends Observer {
    constructor(subject, event, maxUpdates = 3) {
        super();
        this.subject = subject;
        this.event = event;
        this.maxUpdates = maxUpdates;
        this.updateCount = 0;
    }
    
    update(subject, data) {
        this.updateCount++;
        console.log(`[AutoDetach] Получено обновление ${this.updateCount}/${this.maxUpdates}`);
        
        if (this.updateCount >= this.maxUpdates) {
            console.log(`[AutoDetach] Достигнут лимит обновлений, отписываемся`);
            if (this.subject.off) {
                this.subject.off(this.event, this);
            } else if (this.subject.detach) {
                this.subject.detach(this);
            }
        }
    }
}

console.log("\n=== ПРИМЕР С АВТООТПИСКОЙ ===");

const autoObserver = new AutoDetachObserver(eventEmitter, 'test.event', 2);

eventEmitter.on('test.event', autoObserver);

// Генерируем события
eventEmitter.emit('test.event', 'Тест 1');
eventEmitter.emit('test.event', 'Тест 2');
eventEmitter.emit('test.event', 'Тест 3'); // Это событие не будет обработано

console.log(`Наблюдателей для test.event: ${eventEmitter.getEventObserverCount('test.event')}`);

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Слабая связанность между субъектом и наблюдателями
 * - Легко добавлять и удалять наблюдателей
 * - Поддержка принципа открытости/закрытости
 * - Возможность реализации различных типов уведомлений
 * - Упрощает тестирование
 * 
 * НЕДОСТАТКИ:
 * - Может привести к неожиданным обновлениям
 - Сложно отследить порядок уведомлений
 * - Возможны циклические зависимости
 * - Может привести к утечкам памяти при неправильном использовании
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется в MVC архитектуре
 * - Может быть частью Mediator pattern
 * - Связан с Command pattern
 * - Основа для реактивного программирования
 */
