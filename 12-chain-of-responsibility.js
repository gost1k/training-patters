/**
 * CHAIN OF RESPONSIBILITY PATTERN (Паттерн Цепочка обязанностей)
 * 
 * Назначение: Позволяет передавать запросы по цепочке обработчиков до тех пор,
 * пока один из них не обработает запрос. Каждый обработчик решает,
 * обрабатывать ли запрос или передать его следующему в цепочке.
 * 
 * Когда использовать:
 * - Когда нужно обработать запрос несколькими способами
 * - Когда заранее неизвестно, какой обработчик должен обработать запрос
 * - Когда нужно динамически изменять цепочку обработчиков
 * - Когда нужно избежать жесткой привязки отправителя к получателю
 * - Когда нужно обеспечить гибкость в назначении обязанностей
 * 
 * Примеры использования:
 * - Обработка исключений
 * - Фильтрация и валидация данных
 * - Логирование и мониторинг
 * - Обработка событий в UI
 * - Сетевые протоколы
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Абстрактный обработчик
 * Определяет интерфейс для обработчиков в цепочке
 */
class Handler {
    constructor() {
        this.nextHandler = null;
    }
    
    /**
     * Устанавливает следующий обработчик в цепочке
     * @param {Handler} handler - Следующий обработчик
     * @returns {Handler} Следующий обработчик для цепочки
     */
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    
    /**
     * Обрабатывает запрос или передает его следующему
     * @param {Object} request - Запрос для обработки
     * @returns {Object|null} Результат обработки
     */
    handle(request) {
        if (this.nextHandler) {
            return this.nextHandler.handle(request);
        }
        
        // Если нет следующего обработчика, запрос не обработан
        console.log('[Handler] Запрос не обработан');
        return null;
    }
    
    /**
     * Проверяет, может ли обработчик обработать запрос
     * @param {Object} request - Запрос для проверки
     * @returns {boolean}
     */
    canHandle(request) {
        throw new Error("Метод canHandle должен быть переопределен");
    }
    
    /**
     * Выполняет обработку запроса
     * @param {Object} request - Запрос для обработки
     * @returns {Object} Результат обработки
     */
    process(request) {
        throw new Error("Метод process должен быть переопределен");
    }
}

/**
 * Конкретный обработчик A
 */
class ConcreteHandlerA extends Handler {
    canHandle(request) {
        return request.type === 'A' || request.priority <= 5;
    }
    
    process(request) {
        console.log(`[ConcreteHandlerA] Обрабатываем запрос типа ${request.type} с приоритетом ${request.priority}`);
        return {
            handledBy: 'ConcreteHandlerA',
            result: `Обработано A: ${request.data}`,
            timestamp: new Date().toISOString()
        };
    }
    
    handle(request) {
        if (this.canHandle(request)) {
            return this.process(request);
        }
        
        console.log(`[ConcreteHandlerA] Не могу обработать, передаю дальше`);
        return super.handle(request);
    }
}

/**
 * Конкретный обработчик B
 */
class ConcreteHandlerB extends Handler {
    canHandle(request) {
        return request.type === 'B' || (request.priority > 5 && request.priority <= 10);
    }
    
    process(request) {
        console.log(`[ConcreteHandlerB] Обрабатываем запрос типа ${request.type} с приоритетом ${request.priority}`);
        return {
            handledBy: 'ConcreteHandlerB',
            result: `Обработано B: ${request.data}`,
            timestamp: new Date().toISOString()
        };
    }
    
    handle(request) {
        if (this.canHandle(request)) {
            return this.process(request);
        }
        
        console.log(`[ConcreteHandlerB] Не могу обработать, передаю дальше`);
        return super.handle(request);
    }
}

/**
 * Конкретный обработчик C
 */
class ConcreteHandlerC extends Handler {
    canHandle(request) {
        return request.type === 'C' || request.priority > 10;
    }
    
    process(request) {
        console.log(`[ConcreteHandlerC] Обрабатываем запрос типа ${request.type} с приоритетом ${request.priority}`);
        return {
            handledBy: 'ConcreteHandlerC',
            result: `Обработано C: ${request.data}`,
            timestamp: new Date().toISOString()
        };
    }
    
    handle(request) {
        if (this.canHandle(request)) {
            return this.process(request);
        }
        
        console.log(`[ConcreteHandlerC] Не могу обработать, передаю дальше`);
        return super.handle(request);
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР CHAIN OF RESPONSIBILITY ===");

// Создаем обработчики
const handlerA = new ConcreteHandlerA();
const handlerB = new ConcreteHandlerB();
const handlerC = new ConcreteHandlerC();

// Строим цепочку
handlerA.setNext(handlerB).setNext(handlerC);

// Тестовые запросы
const requests = [
    { type: 'A', priority: 3, data: 'Данные для A' },
    { type: 'B', priority: 7, data: 'Данные для B' },
    { type: 'C', priority: 15, data: 'Данные для C' },
    { type: 'D', priority: 8, data: 'Данные для D' }
];

// Обрабатываем запросы
requests.forEach((request, index) => {
    console.log(`\n--- Запрос ${index + 1} ---`);
    console.log('Запрос:', request);
    
    const result = handlerA.handle(request);
    
    if (result) {
        console.log('Результат:', result);
    } else {
        console.log('Запрос не обработан');
    }
});

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА ВАЛИДАЦИИ =====

/**
 * Абстрактный валидатор
 */
class Validator {
    constructor() {
        this.nextValidator = null;
        this.validationErrors = [];
    }
    
    /**
     * Устанавливает следующий валидатор в цепочке
     * @param {Validator} validator - Следующий валидатор
     * @returns {Validator} Следующий валидатор для цепочки
     */
    setNext(validator) {
        this.nextValidator = validator;
        return validator;
    }
    
    /**
     * Выполняет валидацию
     * @param {Object} data - Данные для валидации
     * @returns {Object} Результат валидации
     */
    validate(data) {
        // Выполняем текущую валидацию
        const currentResult = this.performValidation(data);
        
        // Если есть ошибки, добавляем их
        if (currentResult.errors.length > 0) {
            this.validationErrors.push(...currentResult.errors);
        }
        
        // Если есть следующий валидатор, продолжаем цепочку
        if (this.nextValidator) {
            const nextResult = this.nextValidator.validate(data);
            this.validationErrors.push(...nextResult.errors);
        }
        
        return {
            isValid: this.validationErrors.length === 0,
            errors: [...this.validationErrors],
            validatedBy: this.constructor.name
        };
    }
    
    /**
     * Выполняет конкретную валидацию
     * @param {Object} data - Данные для валидации
     * @returns {Object} Результат валидации
     */
    performValidation(data) {
        throw new Error("Метод performValidation должен быть переопределен");
    }
    
    /**
     * Очищает ошибки валидации
     */
    clearErrors() {
        this.validationErrors = [];
    }
}

/**
 * Валидатор обязательных полей
 */
class RequiredFieldsValidator extends Validator {
    performValidation(data) {
        console.log('[RequiredFieldsValidator] Проверяем обязательные поля');
        
        const errors = [];
        const requiredFields = ['name', 'email', 'age'];
        
        for (const field of requiredFields) {
            if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
                errors.push(`Поле "${field}" обязательно для заполнения`);
            }
        }
        
        return { errors };
    }
}

/**
 * Валидатор формата email
 */
class EmailFormatValidator extends Validator {
    performValidation(data) {
        console.log('[EmailFormatValidator] Проверяем формат email');
        
        const errors = [];
        
        if (data.email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                errors.push('Неверный формат email адреса');
            }
        }
        
        return { errors };
    }
}

/**
 * Валидатор возраста
 */
class AgeValidator extends Validator {
    performValidation(data) {
        console.log('[AgeValidator] Проверяем возраст');
        
        const errors = [];
        
        if (data.age !== undefined) {
            if (typeof data.age !== 'number' || data.age < 0 || data.age > 150) {
                errors.push('Возраст должен быть числом от 0 до 150');
            } else if (data.age < 18) {
                errors.push('Возраст должен быть не менее 18 лет');
            }
        }
        
        return { errors };
    }
}

/**
 * Валидатор длины строк
 */
class StringLengthValidator extends Validator {
    performValidation(data) {
        console.log('[StringLengthValidator] Проверяем длину строк');
        
        const errors = [];
        
        if (data.name && data.name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        if (data.name && data.name.length > 50) {
            errors.push('Имя не должно превышать 50 символов');
        }
        
        if (data.email && data.email.length > 100) {
            errors.push('Email не должен превышать 100 символов');
        }
        
        return { errors };
    }
}

/**
 * Валидатор специальных символов
 */
class SpecialCharactersValidator extends Validator {
    performValidation(data) {
        console.log('[SpecialCharactersValidator] Проверяем специальные символы');
        
        const errors = [];
        
        if (data.name) {
            const specialCharRegex = /[<>{}[\]\\|`~!@#$%^&*()+=]/;
            if (specialCharRegex.test(data.name)) {
                errors.push('Имя не должно содержать специальные символы');
            }
        }
        
        return { errors };
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА ВАЛИДАЦИИ ===");

// Создаем валидаторы
const requiredValidator = new RequiredFieldsValidator();
const emailValidator = new EmailFormatValidator();
const ageValidator = new AgeValidator();
const lengthValidator = new StringLengthValidator();
const specialCharValidator = new SpecialCharactersValidator();

// Строим цепочку валидации
requiredValidator
    .setNext(emailValidator)
    .setNext(ageValidator)
    .setNext(lengthValidator)
    .setNext(specialCharValidator);

// Тестовые данные
const testData = [
    {
        name: 'Иван',
        email: 'ivan@example.com',
        age: 25
    },
    {
        name: '',
        email: 'invalid-email',
        age: 15
    },
    {
        name: 'Петр<>',
        email: 'petr@example.com',
        age: 200
    },
    {
        name: 'Мария',
        email: 'maria@example.com'
        // age отсутствует
    }
];

// Валидируем данные
testData.forEach((data, index) => {
    console.log(`\n--- Валидация данных ${index + 1} ---`);
    console.log('Данные:', data);
    
    const result = requiredValidator.validate(data);
    
    if (result.isValid) {
        console.log('✅ Валидация пройдена успешно');
    } else {
        console.log('❌ Ошибки валидации:');
        result.errors.forEach(error => console.log(`  - ${error}`));
    }
    
    // Очищаем ошибки для следующей валидации
    requiredValidator.clearErrors();
});

// ===== ПРИМЕР С ОБРАБОТКОЙ ИСКЛЮЧЕНИЙ =====

/**
 * Абстрактный обработчик исключений
 */
class ExceptionHandler {
    constructor() {
        this.nextHandler = null;
        this.handledExceptions = [];
    }
    
    /**
     * Устанавливает следующий обработчик в цепочке
     * @param {ExceptionHandler} handler - Следующий обработчик
     * @returns {ExceptionHandler} Следующий обработчик для цепочки
     */
    setNext(handler) {
        this.nextHandler = handler;
        return handler;
    }
    
    /**
     * Обрабатывает исключение
     * @param {Error} error - Исключение для обработки
     * @param {Object} context - Контекст ошибки
     * @returns {Object|null} Результат обработки
     */
    handle(error, context = {}) {
        // Проверяем, может ли текущий обработчик обработать исключение
        if (this.canHandle(error, context)) {
            const result = this.processException(error, context);
            this.handledExceptions.push({
                error: error.message,
                handler: this.constructor.name,
                timestamp: new Date().toISOString(),
                context: context
            });
            return result;
        }
        
        // Если не может, передаем следующему
        if (this.nextHandler) {
            return this.nextHandler.handle(error, context);
        }
        
        // Если нет следующего обработчика, исключение не обработано
        console.log('[ExceptionHandler] Исключение не обработано:', error.message);
        return null;
    }
    
    /**
     * Проверяет, может ли обработчик обработать исключение
     * @param {Error} error - Исключение для проверки
     * @param {Object} context - Контекст ошибки
     * @returns {boolean}
     */
    canHandle(error, context) {
        throw new Error("Метод canHandle должен быть переопределен");
    }
    
    /**
     * Обрабатывает исключение
     * @param {Error} error - Исключение для обработки
     * @param {Object} context - Контекст ошибки
     * @returns {Object} Результат обработки
     */
    processException(error, context) {
        throw new Error("Метод processException должен быть переопределен");
    }
    
    /**
     * Возвращает статистику обработки
     * @returns {Object}
     */
    getStats() {
        return {
            handlerName: this.constructor.name,
            handledCount: this.handledExceptions.length,
            handledExceptions: [...this.handledExceptions]
        };
    }
}

/**
 * Обработчик ошибок валидации
 */
class ValidationErrorHandler extends ExceptionHandler {
    canHandle(error, context) {
        return error.name === 'ValidationError' || error.message.includes('валидации');
    }
    
    processException(error, context) {
        console.log(`[ValidationErrorHandler] Обрабатываем ошибку валидации: ${error.message}`);
        
        return {
            type: 'validation_error',
            message: error.message,
            field: context.field || 'unknown',
            suggestion: 'Проверьте правильность введенных данных',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Обработчик ошибок сети
 */
class NetworkErrorHandler extends ExceptionHandler {
    canHandle(error, context) {
        return error.name === 'NetworkError' || 
               error.message.includes('сеть') || 
               error.message.includes('network') ||
               error.message.includes('timeout');
    }
    
    processException(error, context) {
        console.log(`[NetworkErrorHandler] Обрабатываем сетевую ошибку: ${error.message}`);
        
        return {
            type: 'network_error',
            message: error.message,
            retry: true,
            retryCount: context.retryCount || 0,
            maxRetries: 3,
            suggestion: 'Проверьте подключение к интернету',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Обработчик ошибок базы данных
 */
class DatabaseErrorHandler extends ExceptionHandler {
    canHandle(error, context) {
        return error.name === 'DatabaseError' || 
               error.message.includes('база данных') || 
               error.message.includes('database') ||
               error.message.includes('SQL');
    }
    
    processException(error, context) {
        console.log(`[DatabaseErrorHandler] Обрабатываем ошибку базы данных: ${error.message}`);
        
        return {
            type: 'database_error',
            message: error.message,
            query: context.query || 'unknown',
            rollback: true,
            suggestion: 'Попробуйте повторить операцию позже',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Обработчик критических ошибок
 */
class CriticalErrorHandler extends ExceptionHandler {
    canHandle(error, context) {
        return error.name === 'CriticalError' || 
               error.message.includes('критическая') || 
               error.message.includes('critical') ||
               context.priority === 'high';
    }
    
    processException(error, context) {
        console.log(`[CriticalErrorHandler] Обрабатываем критическую ошибку: ${error.message}`);
        
        // Логируем критическую ошибку
        console.error('🚨 КРИТИЧЕСКАЯ ОШИБКА:', error);
        console.error('Стек вызовов:', error.stack);
        
        return {
            type: 'critical_error',
            message: error.message,
            priority: 'high',
            requiresImmediate: true,
            notification: 'Отправлено уведомление администратору',
            suggestion: 'Обратитесь в службу поддержки',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Обработчик по умолчанию
 */
class DefaultErrorHandler extends ExceptionHandler {
    canHandle(error, context) {
        // Обрабатывает все ошибки, которые не обработали другие
        return true;
    }
    
    processException(error, context) {
        console.log(`[DefaultErrorHandler] Обрабатываем ошибку по умолчанию: ${error.message}`);
        
        return {
            type: 'unknown_error',
            message: error.message,
            logged: true,
            suggestion: 'Попробуйте обновить страницу или обратитесь в поддержку',
            timestamp: new Date().toISOString()
        };
    }
}

console.log("\n=== ПРИМЕР С ОБРАБОТКОЙ ИСКЛЮЧЕНИЙ ===");

// Создаем обработчики исключений
const validationHandler = new ValidationErrorHandler();
const networkHandler = new NetworkErrorHandler();
const databaseHandler = new DatabaseErrorHandler();
const criticalHandler = new CriticalErrorHandler();
const defaultHandler = new DefaultErrorHandler();

// Строим цепочку обработки исключений
validationHandler
    .setNext(networkHandler)
    .setNext(databaseHandler)
    .setNext(criticalHandler)
    .setNext(defaultHandler);

// Тестовые исключения
const testErrors = [
    new Error('Ошибка валидации: неверный формат email'),
    new Error('Ошибка сети: timeout'),
    new Error('Ошибка базы данных: SQL syntax error'),
    new Error('Критическая ошибка: нехватка памяти'),
    new Error('Неизвестная ошибка: что-то пошло не так')
];

// Контексты для ошибок
const contexts = [
    { field: 'email', priority: 'low' },
    { retryCount: 2, priority: 'medium' },
    { query: 'SELECT * FROM users', priority: 'low' },
    { priority: 'high' },
    { priority: 'low' }
];

// Обрабатываем исключения
testErrors.forEach((error, index) => {
    console.log(`\n--- Обработка исключения ${index + 1} ---`);
    console.log('Исключение:', error.message);
    console.log('Контекст:', contexts[index]);
    
    const result = validationHandler.handle(error, contexts[index]);
    
    if (result) {
        console.log('Результат обработки:', result);
    } else {
        console.log('Исключение не обработано');
    }
});

// Показываем статистику обработки
console.log('\n--- Статистика обработки исключений ---');
[validationHandler, networkHandler, databaseHandler, criticalHandler, defaultHandler].forEach(handler => {
    const stats = handler.getStats();
    if (stats.handledCount > 0) {
        console.log(`${stats.handlerName}: обработано ${stats.handledCount} исключений`);
    }
});

// ===== ПРИМЕР С ЛОГИРОВАНИЕМ ====

/**
 * Абстрактный логгер
 */
class Logger {
    constructor() {
        this.nextLogger = null;
        this.logLevel = 'info';
        this.logLevels = { debug: 0, info: 1, warn: 2, error: 3, fatal: 4 };
    }
    
    /**
     * Устанавливает следующий логгер в цепочке
     * @param {Logger} logger - Следующий логгер
     * @returns {Logger} Следующий логгер для цепочки
     */
    setNext(logger) {
        this.nextLogger = logger;
        return logger;
    }
    
    /**
     * Устанавливает уровень логирования
     * @param {string} level - Уровень логирования
     */
    setLogLevel(level) {
        if (this.logLevels.hasOwnProperty(level)) {
            this.logLevel = level;
        }
    }
    
    /**
     * Проверяет, должен ли логгер обрабатывать сообщение
     * @param {string} level - Уровень сообщения
     * @returns {boolean}
     */
    shouldLog(level) {
        return this.logLevels[level] >= this.logLevels[this.logLevel];
    }
    
    /**
     * Логирует сообщение
     * @param {string} level - Уровень сообщения
     * @param {string} message - Сообщение
     * @param {Object} context - Контекст
     */
    log(level, message, context = {}) {
        if (this.shouldLog(level)) {
            this.writeLog(level, message, context);
        }
        
        // Передаем следующему логгеру в цепочке
        if (this.nextLogger) {
            this.nextLogger.log(level, message, context);
        }
    }
    
    /**
     * Записывает лог
     * @param {string} level - Уровень сообщения
     * @param {string} message - Сообщение
     * @param {Object} context - Контекст
     */
    writeLog(level, message, context) {
        throw new Error("Метод writeLog должен быть переопределен");
    }
}

/**
 * Консольный логгер
 */
class ConsoleLogger extends Logger {
    writeLog(level, message, context) {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        
        switch (level) {
            case 'error':
            case 'fatal':
                console.error(logEntry, context);
                break;
            case 'warn':
                console.warn(logEntry, context);
                break;
            case 'debug':
                console.debug(logEntry, context);
                break;
            default:
                console.log(logEntry, context);
        }
    }
}

/**
 * Файловый логгер
 */
class FileLogger extends Logger {
    constructor(filename = 'app.log') {
        super();
        this.filename = filename;
        this.logs = [];
        this.maxLogs = 1000;
    }
    
    writeLog(level, message, context) {
        const timestamp = new Date().toISOString();
        const logEntry = {
            timestamp,
            level,
            message,
            context
        };
        
        this.logs.push(logEntry);
        
        // Ограничиваем количество логов в памяти
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        // Имитируем запись в файл
        console.log(`[FileLogger] Записано в ${this.filename}: ${JSON.stringify(logEntry)}`);
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
        console.log(`[FileLogger] Логи очищены`);
    }
}

/**
 * Сетевой логгер
 */
class NetworkLogger extends Logger {
    constructor(endpoint = 'https://logs.example.com/api/logs') {
        super();
        this.endpoint = endpoint;
        this.pendingLogs = [];
        this.batchSize = 10;
        this.flushInterval = 5000; // 5 секунд
        
        // Запускаем периодическую отправку логов
        setInterval(() => this.flushLogs(), this.flushInterval);
    }
    
    writeLog(level, message, context) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            source: 'application'
        };
        
        this.pendingLogs.push(logEntry);
        
        // Если накопилось достаточно логов, отправляем их
        if (this.pendingLogs.length >= this.batchSize) {
            this.flushLogs();
        }
        
        console.log(`[NetworkLogger] Добавлен лог для отправки: ${message}`);
    }
    
    /**
     * Отправляет накопленные логи
     */
    async flushLogs() {
        if (this.pendingLogs.length === 0) {
            return;
        }
        
        const logsToSend = [...this.pendingLogs];
        this.pendingLogs = [];
        
        try {
            // Имитируем отправку в сеть
            console.log(`[NetworkLogger] Отправляем ${logsToSend.length} логов на ${this.endpoint}`);
            
            // Имитируем задержку сети
            await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
            
            console.log(`[NetworkLogger] Логи успешно отправлены`);
        } catch (error) {
            console.error(`[NetworkLogger] Ошибка отправки логов: ${error.message}`);
            
            // Возвращаем логи обратно в очередь
            this.pendingLogs.unshift(...logsToSend);
        }
    }
}

console.log("\n=== ПРИМЕР С ЛОГИРОВАНИЕМ ===");

// Создаем логгеры
const consoleLogger = new ConsoleLogger();
const fileLogger = new FileLogger('application.log');
const networkLogger = new NetworkLogger();

// Строим цепочку логгеров
consoleLogger
    .setNext(fileLogger)
    .setNext(networkLogger);

// Устанавливаем уровни логирования
consoleLogger.setLogLevel('info');
fileLogger.setLogLevel('warn');
networkLogger.setLogLevel('error');

// Тестируем логирование
console.log('\n--- Тестирование логирования ---');

consoleLogger.log('debug', 'Отладочное сообщение', { module: 'test', line: 42 });
consoleLogger.log('info', 'Информационное сообщение', { user: 'admin', action: 'login' });
consoleLogger.log('warn', 'Предупреждение', { resource: 'database', usage: '85%' });
consoleLogger.log('error', 'Ошибка подключения', { service: 'database', retry: 3 });
consoleLogger.log('fatal', 'Критическая ошибка', { component: 'core', stack: 'stack trace' });

// Ждем немного для отправки сетевых логов
setTimeout(() => {
    console.log('\n--- Статистика логирования ---');
    console.log('Файловые логи:', fileLogger.getLogs().length);
    
    // Показываем последние логи
    console.log('\n--- Последние файловые логи ---');
    fileLogger.getLogs().slice(-3).forEach(log => {
        console.log(`${log.timestamp} [${log.level}] ${log.message}`);
    });
}, 6000);

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Уменьшает связанность между отправителем и получателем
 * - Позволяет динамически изменять цепочку обработчиков
 * - Упрощает добавление новых обработчиков
 * - Обеспечивает гибкость в назначении обязанностей
 * - Поддерживает принцип единственной ответственности
 * - Позволяет обрабатывать запросы несколькими способами
 * 
 * НЕДОСТАТКИ:
 * - Может привести к необработанным запросам
 * - Сложно отследить, какой обработчик обработал запрос
 * - Может создать проблемы с производительностью
 * - Сложно отлаживать цепочку обработчиков
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Command pattern
 * - Может быть частью Interpreter pattern
 * - Связан с Strategy pattern
 * - Используется в Template Method
 */
