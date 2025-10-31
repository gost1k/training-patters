/**
 * STRATEGY PATTERN (Паттерн Стратегия)
 * 
 * Назначение: Определяет семейство алгоритмов, инкапсулирует каждый из них
 * и делает их взаимозаменяемыми. Стратегия позволяет изменять алгоритмы
 * независимо от клиентов, которые их используют.
 * 
 * Когда использовать:
 * - Когда есть несколько способов выполнить одну и ту же задачу
 * - Когда нужно скрыть сложные алгоритмы от клиентского кода
 * - Когда нужно легко добавлять новые алгоритмы
 * - Когда нужно избежать множественных условных операторов
 * 
 * Примеры использования:
 * - Алгоритмы сортировки
 * - Способы оплаты
 * - Алгоритмы сжатия
 * - Способы валидации
 * - Алгоритмы поиска
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Интерфейс стратегии
 * Все стратегии должны реализовывать метод execute
 */
class Strategy {
    /**
     * Выполняет алгоритм стратегии
     * @param {*} data - Входные данные
     * @returns {*} Результат выполнения
     */
    execute(data) {
        throw new Error("Метод execute должен быть переопределен");
    }
    
    /**
     * Возвращает название стратегии
     * @returns {string}
     */
    getName() {
        return this.constructor.name;
    }
}

/**
 * Контекст, который использует стратегии
 * Хранит ссылку на текущую стратегию и делегирует ей выполнение
 */
class Context {
    constructor(strategy = null) {
        this.strategy = strategy;
    }
    
    /**
     * Устанавливает стратегию
     * @param {Strategy} strategy - Новая стратегия
     */
    setStrategy(strategy) {
        this.strategy = strategy;
        console.log(`Стратегия изменена на: ${strategy.getName()}`);
    }
    
    /**
     * Выполняет текущую стратегию
     * @param {*} data - Входные данные
     * @returns {*} Результат выполнения
     */
    executeStrategy(data) {
        if (!this.strategy) {
            throw new Error("Стратегия не установлена");
        }
        
        console.log(`Выполняем стратегию: ${this.strategy.getName()}`);
        return this.strategy.execute(data);
    }
    
    /**
     * Возвращает текущую стратегию
     * @returns {Strategy}
     */
    getCurrentStrategy() {
        return this.strategy;
    }
}

// ===== КОНКРЕТНЫЕ СТРАТЕГИИ =====

/**
 * Стратегия сложения
 */
class AdditionStrategy extends Strategy {
    execute(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Для сложения нужен массив чисел");
        }
        
        const result = data.reduce((sum, num) => sum + num, 0);
        console.log(`Сложение: ${data.join(' + ')} = ${result}`);
        return result;
    }
}

/**
 * Стратегия умножения
 */
class MultiplicationStrategy extends Strategy {
    execute(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Для умножения нужен массив чисел");
        }
        
        const result = data.reduce((product, num) => product * num, 1);
        console.log(`Умножение: ${data.join(' × ')} = ${result}`);
        return result;
    }
}

/**
 * Стратегия поиска максимума
 */
class MaxStrategy extends Strategy {
    execute(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Для поиска максимума нужен массив чисел");
        }
        
        const result = Math.max(...data);
        console.log(`Максимум: max(${data.join(', ')}) = ${result}`);
        return result;
    }
}

/**
 * Стратегия поиска минимума
 */
class MinStrategy extends Strategy {
    execute(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Для поиска минимума нужен массив чисел");
        }
        
        const result = Math.min(...data);
        console.log(`Минимум: min(${data.join(', ')}) = ${result}`);
        return result;
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР STRATEGY ===");

// Создаем контекст
const context = new Context();

// Создаем стратегии
const additionStrategy = new AdditionStrategy();
const multiplicationStrategy = new MultiplicationStrategy();
const maxStrategy = new MaxStrategy();
const minStrategy = new MinStrategy();

// Тестовые данные
const numbers = [2, 4, 6, 8];

// Выполняем различные стратегии
context.setStrategy(additionStrategy);
console.log("Результат:", context.executeStrategy(numbers));

context.setStrategy(multiplicationStrategy);
console.log("Результат:", context.executeStrategy(numbers));

context.setStrategy(maxStrategy);
console.log("Результат:", context.executeStrategy(numbers));

context.setStrategy(minStrategy);
console.log("Результат:", context.executeStrategy(numbers));

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА ОПЛАТЫ =====

/**
 * Абстрактный класс стратегии оплаты
 */
class PaymentStrategy extends Strategy {
    constructor() {
        super();
        this.amount = 0;
    }
    
    /**
     * Устанавливает сумму для оплаты
     * @param {number} amount - Сумма
     */
    setAmount(amount) {
        this.amount = amount;
    }
    
    /**
     * Выполняет оплату
     * @param {Object} paymentData - Данные для оплаты
     * @returns {Object} Результат оплаты
     */
    execute(paymentData) {
        throw new Error("Метод execute должен быть переопределен");
    }
}

/**
 * Стратегия оплаты кредитной картой
 */
class CreditCardPayment extends PaymentStrategy {
    execute(paymentData) {
        const { cardNumber, expiryDate, cvv } = paymentData;
        
        // Валидация данных карты
        if (!cardNumber || !expiryDate || !cvv) {
            throw new Error("Неполные данные кредитной карты");
        }
        
        if (cardNumber.length !== 16) {
            throw new Error("Неверный номер карты");
        }
        
        console.log(`Оплата кредитной картой: ${cardNumber.slice(-4)}...`);
        console.log(`Сумма: $${this.amount}`);
        
        // Имитация обработки платежа
        const transactionId = `CC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            success: true,
            transactionId,
            method: 'Credit Card',
            amount: this.amount,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Стратегия оплаты PayPal
 */
class PayPalPayment extends PaymentStrategy {
    execute(paymentData) {
        const { email, password } = paymentData;
        
        if (!email || !password) {
            throw new Error("Неполные данные PayPal");
        }
        
        console.log(`Оплата PayPal: ${email}`);
        console.log(`Сумма: $${this.amount}`);
        
        // Имитация обработки платежа
        const transactionId = `PP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            success: true,
            transactionId,
            method: 'PayPal',
            amount: this.amount,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Стратегия оплаты криптовалютой
 */
class CryptoPayment extends PaymentStrategy {
    execute(paymentData) {
        const { walletAddress, cryptoType = 'BTC' } = paymentData;
        
        if (!walletAddress) {
            throw new Error("Не указан адрес кошелька");
        }
        
        console.log(`Оплата криптовалютой: ${cryptoType}`);
        console.log(`Кошелек: ${walletAddress.slice(0, 8)}...`);
        console.log(`Сумма: $${this.amount}`);
        
        // Имитация обработки платежа
        const transactionId = `CR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        return {
            success: true,
            transactionId,
            method: `Crypto (${cryptoType})`,
            amount: this.amount,
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Контекст для обработки платежей
 */
class PaymentProcessor extends Context {
    constructor() {
        super();
        this.paymentHistory = [];
    }
    
    /**
     * Обрабатывает платеж
     * @param {number} amount - Сумма платежа
     * @param {Object} paymentData - Данные для оплаты
     * @returns {Object} Результат платежа
     */
    processPayment(amount, paymentData) {
        if (!this.strategy) {
            throw new Error("Способ оплаты не выбран");
        }
        
        // Устанавливаем сумму в стратегию
        this.strategy.setAmount(amount);
        
        // Выполняем оплату
        const result = this.executeStrategy(paymentData);
        
        // Сохраняем в историю
        this.paymentHistory.push(result);
        
        return result;
    }
    
    /**
     * Возвращает историю платежей
     * @returns {Array}
     */
    getPaymentHistory() {
        return [...this.paymentHistory];
    }
    
    /**
     * Возвращает статистику по способам оплаты
     * @returns {Object}
     */
    getPaymentStatistics() {
        const stats = {};
        
        this.paymentHistory.forEach(payment => {
            const method = payment.method;
            if (!stats[method]) {
                stats[method] = { count: 0, total: 0 };
            }
            stats[method].count++;
            stats[method].total += payment.amount;
        });
        
        return stats;
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА ОПЛАТЫ ===");

// Создаем процессор платежей
const paymentProcessor = new PaymentProcessor();

// Создаем стратегии оплаты
const creditCardPayment = new CreditCardPayment();
const paypalPayment = new PayPalPayment();
const cryptoPayment = new CryptoPayment();

// Обрабатываем различные платежи
console.log("\n--- Платеж кредитной картой ---");
paymentProcessor.setStrategy(creditCardPayment);
const ccResult = paymentProcessor.processPayment(100, {
    cardNumber: '1234567890123456',
    expiryDate: '12/25',
    cvv: '123'
});
console.log("Результат:", ccResult);

console.log("\n--- Платеж PayPal ---");
paymentProcessor.setStrategy(paypalPayment);
const ppResult = paymentProcessor.processPayment(50, {
    email: 'user@example.com',
    password: 'password123'
});
console.log("Результат:", ppResult);

console.log("\n--- Платеж криптовалютой ---");
paymentProcessor.setStrategy(cryptoPayment);
const crResult = paymentProcessor.processPayment(200, {
    walletAddress: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
    cryptoType: 'BTC'
});
console.log("Результат:", crResult);

// Получаем статистику
console.log("\n--- Статистика платежей ---");
console.log(paymentProcessor.getPaymentStatistics());

// ===== ПРИМЕР С ВАЛИДАЦИЕЙ =====

/**
 * Абстрактный класс стратегии валидации
 */
class ValidationStrategy extends Strategy {
    /**
     * Валидирует данные
     * @param {*} data - Данные для валидации
     * @returns {Object} Результат валидации
     */
    execute(data) {
        throw new Error("Метод execute должен быть переопределен");
    }
}

/**
 * Стратегия валидации email
 */
class EmailValidationStrategy extends ValidationStrategy {
    execute(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        return {
            isValid,
            message: isValid ? 'Email корректен' : 'Неверный формат email',
            field: 'email'
        };
    }
}

/**
 * Стратегия валидации пароля
 */
class PasswordValidationStrategy extends ValidationStrategy {
    execute(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Пароль должен содержать минимум 8 символов');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Пароль должен содержать заглавную букву');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Пароль должен содержать строчную букву');
        }
        
        if (!/\d/.test(password)) {
            errors.push('Пароль должен содержать цифру');
        }
        
        if (!/[!@#$%^&*]/.test(password)) {
            errors.push('Пароль должен содержать специальный символ (!@#$%^&*)');
        }
        
        const isValid = errors.length === 0;
        
        return {
            isValid,
            message: isValid ? 'Пароль корректен' : errors.join(', '),
            field: 'password',
            errors
        };
    }
}

/**
 * Стратегия валидации номера телефона
 */
class PhoneValidationStrategy extends ValidationStrategy {
    execute(phone) {
        // Убираем все нецифровые символы
        const cleanPhone = phone.replace(/\D/g, '');
        
        let isValid = false;
        let message = '';
        
        if (cleanPhone.length === 11 && cleanPhone.startsWith('7')) {
            isValid = true;
            message = 'Номер телефона корректен';
        } else if (cleanPhone.length === 10 && cleanPhone.startsWith('9')) {
            isValid = true;
            message = 'Номер телефона корректен';
        } else {
            message = 'Неверный формат номера телефона';
        }
        
        return {
            isValid,
            message,
            field: 'phone',
            cleanPhone: isValid ? cleanPhone : null
        };
    }
}

/**
 * Валидатор форм
 */
class FormValidator extends Context {
    constructor() {
        super();
        this.validationResults = [];
    }
    
    /**
     * Валидирует поле формы
     * @param {string} fieldName - Название поля
     * @param {*} value - Значение поля
     * @returns {Object} Результат валидации
     */
    validateField(fieldName, value) {
        // Автоматически выбираем стратегию на основе названия поля
        let strategy;
        
        switch (fieldName.toLowerCase()) {
            case 'email':
                strategy = new EmailValidationStrategy();
                break;
            case 'password':
                strategy = new PasswordValidationStrategy();
                break;
            case 'phone':
                strategy = new PhoneValidationStrategy();
                break;
            default:
                throw new Error(`Неизвестное поле для валидации: ${fieldName}`);
        }
        
        this.setStrategy(strategy);
        const result = this.executeStrategy(value);
        
        this.validationResults.push(result);
        return result;
    }
    
    /**
     * Валидирует всю форму
     * @param {Object} formData - Данные формы
     * @returns {Object} Общий результат валидации
     */
    validateForm(formData) {
        this.validationResults = [];
        
        for (const [field, value] of Object.entries(formData)) {
            try {
                this.validateField(field, value);
            } catch (error) {
                console.warn(`Пропускаем валидацию поля ${field}:`, error.message);
            }
        }
        
        const isValid = this.validationResults.every(result => result.isValid);
        const errors = this.validationResults.filter(result => !result.isValid);
        
        return {
            isValid,
            results: this.validationResults,
            errors,
            message: isValid ? 'Форма валидна' : `Найдено ${errors.length} ошибок`
        };
    }
    
    /**
     * Возвращает результаты валидации
     * @returns {Array}
     */
    getValidationResults() {
        return [...this.validationResults];
    }
}

console.log("\n=== ПРИМЕР С ВАЛИДАЦИЕЙ ===");

// Создаем валидатор форм
const formValidator = new FormValidator();

// Тестовые данные формы
const formData = {
    email: 'user@example.com',
    password: 'WeakPass',
    phone: '+7 (999) 123-45-67'
};

// Валидируем форму
const validationResult = formValidator.validateForm(formData);

console.log("Результат валидации:", validationResult);

// ===== ПРИМЕР С КЭШИРОВАНИЕМ СТРАТЕГИЙ =====

/**
 * Кэш для стратегий
 */
class StrategyCache {
    constructor() {
        this.cache = new Map();
    }
    
    /**
     * Получает стратегию из кэша или создает новую
     * @param {string} strategyType - Тип стратегии
     * @param {Function} strategyClass - Класс стратегии
     * @returns {Strategy} Экземпляр стратегии
     */
    getStrategy(strategyType, strategyClass) {
        if (!this.cache.has(strategyType)) {
            const strategy = new strategyClass();
            this.cache.set(strategyType, strategy);
            console.log(`Создана новая стратегия: ${strategyType}`);
        } else {
            console.log(`Используем кэшированную стратегию: ${strategyType}`);
        }
        
        return this.cache.get(strategyType);
    }
    
    /**
     * Очищает кэш
     */
    clear() {
        this.cache.clear();
        console.log("Кэш стратегий очищен");
    }
    
    /**
     * Возвращает размер кэша
     * @returns {number}
     */
    size() {
        return this.cache.size;
    }
}

console.log("\n=== ПРИМЕР С КЭШИРОВАНИЕМ ===");

// Создаем кэш стратегий
const strategyCache = new StrategyCache();

// Получаем стратегии через кэш
const cachedCCPayment = strategyCache.getStrategy('CreditCard', CreditCardPayment);
const cachedPPPayment = strategyCache.getStrategy('PayPal', PayPalPayment);
const cachedCCPayment2 = strategyCache.getStrategy('CreditCard', CreditCardPayment); // Из кэша

console.log(`Размер кэша: ${strategyCache.size()}`);

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Легко добавлять новые алгоритмы
 * - Избегает множественных условных операторов
 * - Инкапсулирует алгоритмы
 * - Упрощает тестирование
 * - Поддерживает принцип открытости/закрытости
 * - Позволяет легко переключаться между алгоритмами
 * 
 * НЕДОСТАТКИ:
 * - Может привести к созданию множества классов
 * - Клиент должен знать о различных стратегиях
 * - Может усложнить архитектуру для простых случаев
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Factory Method
 * - Может быть частью Command pattern
 * - Связан с State pattern
 * - Используется в Template Method
 */
