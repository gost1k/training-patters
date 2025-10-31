/**
 * ADAPTER PATTERN (Паттерн Адаптер)
 * 
 * Назначение: Позволяет объектам с несовместимыми интерфейсами работать вместе.
 * Адаптер оборачивает существующий класс в новый интерфейс, делая его совместимым
 * с другим кодом без изменения исходного кода.
 * 
 * Когда использовать:
 * - Когда нужно использовать существующий класс, но его интерфейс не подходит
 * - Когда нужно создать повторно используемый класс для работы с классами,
 *   которые могут не иметь совместимых интерфейсов
 * - Когда нужно объединить несколько подклассов в один класс
 * - Когда нужно обеспечить совместимость между различными API
 * 
 * Примеры использования:
 * - Интеграция с внешними библиотеками
 * - Работа с различными форматами данных
 * - Адаптация устаревшего кода к новым интерфейсам
 * - Объединение различных систем
 * - Тестирование с моками
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Целевой интерфейс
 * Интерфейс, который ожидает клиентский код
 */
class Target {
    /**
     * Метод, который ожидает клиент
     * @returns {string}
     */
    request() {
        throw new Error("Метод request должен быть переопределен");
    }
}

/**
 * Адаптируемый класс
 * Существующий класс с несовместимым интерфейсом
 */
class Adaptee {
    /**
     * Специфичный метод, который нужно адаптировать
     * @returns {string}
     */
    specificRequest() {
        return "Специфичный запрос от Adaptee";
    }
    
    /**
     * Другой специфичный метод
     * @param {string} data - Данные для обработки
     * @returns {string}
     */
    processData(data) {
        return `Обработано: ${data}`;
    }
    
    /**
     * Метод с неудобным названием
     * @returns {number}
     */
    getValueFromComplexCalculation() {
        return Math.floor(Math.random() * 100);
    }
}

/**
 * Адаптер
 * Преобразует интерфейс Adaptee в интерфейс Target
 */
class Adapter extends Target {
    constructor(adaptee) {
        super();
        this.adaptee = adaptee;
    }
    
    /**
     * Адаптирует специфичный запрос к целевому интерфейсу
     * @returns {string}
     */
    request() {
        const result = this.adaptee.specificRequest();
        return `Адаптер: ${result}`;
    }
    
    /**
     * Дополнительные адаптированные методы
     * @param {string} data - Данные для обработки
     * @returns {string}
     */
    processRequest(data) {
        return this.adaptee.processData(data);
    }
    
    /**
     * Упрощает сложный метод
     * @returns {number}
     */
    getValue() {
        return this.adaptee.getValueFromComplexCalculation();
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР ADAPTER ===");

// Клиентский код ожидает интерфейс Target
function clientCode(target) {
    console.log("Клиентский код работает с Target интерфейсом");
    console.log(target.request());
}

// Создаем адаптируемый объект
const adaptee = new Adaptee();

// Создаем адаптер
const adapter = new Adapter(adaptee);

// Клиентский код может работать с адаптером
clientCode(adapter);

// Используем дополнительные адаптированные методы
console.log("Обработка данных:", adapter.processRequest("тестовые данные"));
console.log("Получение значения:", adapter.getValue());

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - АДАПТАЦИЯ ПЛАТЕЖНЫХ СИСТЕМ =====

/**
 * Целевой интерфейс для платежей
 */
class PaymentProcessor {
    /**
     * Обрабатывает платеж
     * @param {Object} paymentData - Данные платежа
     * @returns {Object} Результат обработки
     */
    processPayment(paymentData) {
        throw new Error("Метод processPayment должен быть переопределен");
    }
    
    /**
     * Возвращает статус платежа
     * @param {string} paymentId - ID платежа
     * @returns {string} Статус
     */
    getPaymentStatus(paymentId) {
        throw new Error("Метод getPaymentStatus должен быть переопределен");
    }
    
    /**
     * Возвращает поддерживаемые валюты
     * @returns {Array} Массив валют
     */
    getSupportedCurrencies() {
        throw new Error("Метод getSupportedCurrencies должен быть переопределен");
    }
}

/**
 * Устаревшая платежная система с несовместимым интерфейсом
 */
class LegacyPaymentSystem {
    constructor() {
        this.transactions = new Map();
        this.currencies = ['USD', 'EUR', 'RUB'];
    }
    
    /**
     * Устаревший метод для создания транзакции
     * @param {number} amount - Сумма
     * @param {string} currency - Валюта
     * @param {string} cardNumber - Номер карты
     * @returns {string} ID транзакции
     */
    createTransaction(amount, currency, cardNumber) {
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        this.transactions.set(transactionId, {
            id: transactionId,
            amount: amount,
            currency: currency,
            cardNumber: cardNumber,
            status: 'pending',
            createdAt: new Date()
        });
        
        console.log(`[LegacyPaymentSystem] Создана транзакция: ${transactionId}`);
        return transactionId;
    }
    
    /**
     * Устаревший метод для проверки статуса
     * @param {string} transactionId - ID транзакции
     * @returns {string} Статус
     */
    checkTransactionStatus(transactionId) {
        const transaction = this.transactions.get(transactionId);
        
        if (!transaction) {
            return 'not_found';
        }
        
        // Имитируем обработку
        if (transaction.status === 'pending') {
            transaction.status = 'completed';
            console.log(`[LegacyPaymentSystem] Транзакция ${transactionId} завершена`);
        }
        
        return transaction.status;
    }
    
    /**
     * Устаревший метод для получения списка валют
     * @returns {string} Список валют в виде строки
     */
    getCurrencyList() {
        return this.currencies.join(', ');
    }
    
    /**
     * Устаревший метод для валидации карты
     * @param {string} cardNumber - Номер карты
     * @returns {boolean} Валидность
     */
    validateCard(cardNumber) {
        return cardNumber && cardNumber.length === 16;
    }
}

/**
 * Адаптер для устаревшей платежной системы
 */
class LegacyPaymentAdapter extends PaymentProcessor {
    constructor(legacySystem) {
        super();
        this.legacySystem = legacySystem;
    }
    
    /**
     * Адаптирует данные платежа к устаревшему формату
     * @param {Object} paymentData - Данные платежа в новом формате
     * @returns {Object} Результат обработки
     */
    processPayment(paymentData) {
        const { amount, currency, cardNumber, description } = paymentData;
        
        // Валидируем карту через устаревшую систему
        if (!this.legacySystem.validateCard(cardNumber)) {
            throw new Error('Неверный номер карты');
        }
        
        // Создаем транзакцию через устаревшую систему
        const transactionId = this.legacySystem.createTransaction(amount, currency, cardNumber);
        
        // Возвращаем результат в новом формате
        return {
            success: true,
            transactionId: transactionId,
            amount: amount,
            currency: currency,
            status: 'pending',
            description: description,
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Адаптирует получение статуса платежа
     * @param {string} paymentId - ID платежа
     * @returns {string} Статус
     */
    getPaymentStatus(paymentId) {
        const legacyStatus = this.legacySystem.checkTransactionStatus(paymentId);
        
        // Преобразуем устаревшие статусы в новые
        const statusMap = {
            'pending': 'processing',
            'completed': 'success',
            'failed': 'failed',
            'not_found': 'not_found'
        };
        
        return statusMap[legacyStatus] || 'unknown';
    }
    
    /**
     * Адаптирует получение поддерживаемых валют
     * @returns {Array} Массив валют
     */
    getSupportedCurrencies() {
        const legacyCurrencies = this.legacySystem.getCurrencyList();
        return legacyCurrencies.split(', ').map(currency => currency.trim());
    }
    
    /**
     * Дополнительные методы для работы с устаревшей системой
     * @param {string} transactionId - ID транзакции
     * @returns {Object|null} Данные транзакции
     */
    getTransactionDetails(transactionId) {
        // Здесь можно добавить логику для получения деталей транзакции
        // из устаревшей системы и преобразования их в новый формат
        return {
            id: transactionId,
            status: this.getPaymentStatus(transactionId),
            timestamp: new Date().toISOString()
        };
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ПЛАТЕЖНЫЕ СИСТЕМЫ ===");

// Создаем устаревшую платежную систему
const legacySystem = new LegacyPaymentSystem();

// Создаем адаптер
const paymentAdapter = new LegacyPaymentAdapter(legacySystem);

// Клиентский код работает с новым интерфейсом
console.log('Поддерживаемые валюты:', paymentAdapter.getSupportedCurrencies());

// Обрабатываем платеж
const paymentData = {
    amount: 100.50,
    currency: 'USD',
    cardNumber: '1234567890123456',
    description: 'Покупка товара'
};

try {
    const result = paymentAdapter.processPayment(paymentData);
    console.log('Результат платежа:', result);
    
    // Проверяем статус
    const status = paymentAdapter.getPaymentStatus(result.transactionId);
    console.log('Статус платежа:', status);
    
    // Получаем детали транзакции
    const details = paymentAdapter.getTransactionDetails(result.transactionId);
    console.log('Детали транзакции:', details);
    
} catch (error) {
    console.error('Ошибка платежа:', error.message);
}

// ===== ПРИМЕР С АДАПТАЦИЕЙ ФОРМАТОВ ДАННЫХ =====

/**
 * Целевой интерфейс для работы с данными
 */
class DataProcessor {
    /**
     * Обрабатывает данные
     * @param {Object} data - Данные для обработки
     * @returns {Object} Обработанные данные
     */
    processData(data) {
        throw new Error("Метод processData должен быть переопределен");
    }
    
    /**
     * Валидирует данные
     * @param {Object} data - Данные для валидации
     * @returns {boolean} Результат валидации
     */
    validateData(data) {
        throw new Error("Метод validateData должен быть переопределен");
    }
    
    /**
     * Экспортирует данные
     * @param {Object} data - Данные для экспорта
     * @returns {string} Экспортированные данные
     */
    exportData(data) {
        throw new Error("Метод exportData должен быть переопределен");
    }
}

/**
 * Внешняя система с XML форматом
 */
class XMLDataSystem {
    constructor() {
        this.schema = {
            user: ['id', 'name', 'email', 'age'],
            product: ['id', 'name', 'price', 'category']
        };
    }
    
    /**
     * Обрабатывает XML данные
     * @param {string} xmlData - XML строка
     * @returns {string} Обработанный XML
     */
    processXML(xmlData) {
        console.log('[XMLDataSystem] Обрабатываем XML данные');
        return xmlData.replace(/<[^>]*>/g, '').trim();
    }
    
    /**
     * Валидирует XML по схеме
     * @param {string} xmlData - XML строка
     * @param {string} type - Тип данных (user/product)
     * @returns {boolean} Результат валидации
     */
    validateXML(xmlData, type) {
        if (!this.schema[type]) {
            return false;
        }
        
        const requiredFields = this.schema[type];
        const hasAllFields = requiredFields.every(field => 
            xmlData.includes(`<${field}>`)
        );
        
        console.log(`[XMLDataSystem] Валидация XML для типа ${type}: ${hasAllFields}`);
        return hasAllFields;
    }
    
    /**
     * Экспортирует данные в XML
     * @param {Object} data - Данные для экспорта
     * @param {string} type - Тип данных
     * @returns {string} XML строка
     */
    exportToXML(data, type) {
        if (!this.schema[type]) {
            throw new Error(`Неизвестный тип данных: ${type}`);
        }
        
        const fields = this.schema[type];
        const xmlFields = fields.map(field => 
            `<${field}>${data[field] || ''}</${field}>`
        ).join('');
        
        const xml = `<${type}>${xmlFields}</${type}>`;
        console.log(`[XMLDataSystem] Экспортировано в XML: ${xml}`);
        return xml;
    }
}

/**
 * Адаптер для XML системы
 */
class XMLDataAdapter extends DataProcessor {
    constructor(xmlSystem) {
        super();
        this.xmlSystem = xmlSystem;
    }
    
    /**
     * Адаптирует обработку данных
     * @param {Object} data - Данные в JSON формате
     * @returns {Object} Обработанные данные
     */
    processData(data) {
        // Преобразуем JSON в XML
        const xmlData = this.jsonToXML(data);
        
        // Обрабатываем через XML систему
        const processedXML = this.xmlSystem.processXML(xmlData);
        
        // Преобразуем обратно в JSON
        return this.xmlToJSON(processedXML);
    }
    
    /**
     * Адаптирует валидацию данных
     * @param {Object} data - Данные для валидации
     * @returns {boolean} Результат валидации
     */
    validateData(data) {
        // Определяем тип данных
        const type = this.determineDataType(data);
        
        // Преобразуем в XML для валидации
        const xmlData = this.jsonToXML(data);
        
        // Валидируем через XML систему
        return this.xmlSystem.validateXML(xmlData, type);
    }
    
    /**
     * Адаптирует экспорт данных
     * @param {Object} data - Данные для экспорта
     * @returns {string} Экспортированные данные
     */
    exportData(data) {
        const type = this.determineDataType(data);
        return this.xmlSystem.exportToXML(data, type);
    }
    
    /**
     * Преобразует JSON в XML
     * @param {Object} jsonData - JSON данные
     * @returns {string} XML строка
     */
    jsonToXML(jsonData) {
        const type = this.determineDataType(jsonData);
        return this.xmlSystem.exportToXML(jsonData, type);
    }
    
    /**
     * Преобразует XML в JSON (упрощенная версия)
     * @param {string} xmlData - XML строка
     * @returns {Object} JSON данные
     */
    xmlToJSON(xmlData) {
        // Упрощенное преобразование XML в JSON
        const result = {};
        const matches = xmlData.match(/<(\w+)>(.*?)<\/\1>/g);
        
        if (matches) {
            matches.forEach(match => {
                const fieldMatch = match.match(/<(\w+)>(.*?)<\/\1>/);
                if (fieldMatch) {
                    result[fieldMatch[1]] = fieldMatch[2];
                }
            });
        }
        
        return result;
    }
    
    /**
     * Определяет тип данных на основе структуры
     * @param {Object} data - Данные
     * @returns {string} Тип данных
     */
    determineDataType(data) {
        if (data.email && data.age !== undefined) {
            return 'user';
        } else if (data.price && data.category) {
            return 'product';
        }
        return 'unknown';
    }
}

console.log("\n=== ПРИМЕР С АДАПТАЦИЕЙ ФОРМАТОВ ДАННЫХ ===");

// Создаем XML систему
const xmlSystem = new XMLDataSystem();

// Создаем адаптер
const dataAdapter = new XMLDataAdapter(xmlSystem);

// Тестовые данные
const userData = {
    id: 1,
    name: 'Иван Иванов',
    email: 'ivan@example.com',
    age: 30
};

const productData = {
    id: 101,
    name: 'Ноутбук',
    price: 50000,
    category: 'Электроника'
};

// Обрабатываем данные через адаптер
console.log('Обработка данных пользователя:', dataAdapter.processData(userData));
console.log('Обработка данных продукта:', dataAdapter.processData(productData));

// Валидируем данные
console.log('Валидация пользователя:', dataAdapter.validateData(userData));
console.log('Валидация продукта:', dataAdapter.validateData(productData));

// Экспортируем данные
console.log('Экспорт пользователя:', dataAdapter.exportData(userData));
console.log('Экспорт продукта:', dataAdapter.exportData(productData));

// ===== ПРИМЕР С АДАПТАЦИЕЙ API =====

/**
 * Целевой интерфейс для работы с API
 */
class ModernAPI {
    /**
     * Получает данные
     * @param {string} endpoint - Конечная точка
     * @returns {Promise<Object>} Данные
     */
    async get(endpoint) {
        throw new Error("Метод get должен быть переопределен");
    }
    
    /**
     * Отправляет данные
     * @param {string} endpoint - Конечная точка
     * @param {Object} data - Данные для отправки
     * @returns {Promise<Object>} Результат
     */
    async post(endpoint, data) {
        throw new Error("Метод post должен быть переопределен");
    }
    
    /**
     * Обновляет данные
     * @param {string} endpoint - Конечная точка
     * @param {Object} data - Данные для обновления
     * @returns {Promise<Object>} Результат
     */
    async put(endpoint, data) {
        throw new Error("Метод put должен быть переопределен");
    }
    
    /**
     * Удаляет данные
     * @param {string} endpoint - Конечная точка
     * @returns {Promise<Object>} Результат
     */
    async delete(endpoint) {
        throw new Error("Метод delete должен быть переопределен");
    }
}

/**
 * Устаревший API с callback-подходом
 */
class LegacyAPI {
    constructor() {
        this.baseUrl = 'https://api.legacy.com';
        this.timeout = 5000;
    }
    
    /**
     * Устаревший метод для получения данных
     * @param {string} url - URL
     * @param {Function} callback - Callback функция
     */
    fetchData(url, callback) {
        console.log(`[LegacyAPI] Запрос к: ${url}`);
        
        // Имитируем асинхронный запрос
        setTimeout(() => {
            const data = { url, timestamp: new Date().toISOString(), data: 'sample data' };
            callback(null, data);
        }, Math.random() * 1000);
    }
    
    /**
     * Устаревший метод для отправки данных
     * @param {string} url - URL
     * @param {Object} payload - Данные
     * @param {Function} callback - Callback функция
     */
    sendData(url, payload, callback) {
        console.log(`[LegacyAPI] Отправка данных на: ${url}`, payload);
        
        setTimeout(() => {
            const result = { 
                url, 
                timestamp: new Date().toISOString(), 
                success: true, 
                id: Math.random().toString(36).substr(2, 9) 
            };
            callback(null, result);
        }, Math.random() * 1000);
    }
    
    /**
     * Устаревший метод для обновления данных
     * @param {string} url - URL
     * @param {Object} payload - Данные
     * @param {Function} callback - Callback функция
     */
    updateData(url, payload, callback) {
        console.log(`[LegacyAPI] Обновление данных на: ${url}`, payload);
        
        setTimeout(() => {
            const result = { 
                url, 
                timestamp: new Date().toISOString(), 
                success: true, 
                updated: true 
            };
            callback(null, result);
        }, Math.random() * 1000);
    }
    
    /**
     * Устаревший метод для удаления данных
     * @param {string} url - URL
     * @param {Function} callback - Callback функция
     */
    removeData(url, callback) {
        console.log(`[LegacyAPI] Удаление данных с: ${url}`);
        
        setTimeout(() => {
            const result = { 
                url, 
                timestamp: new Date().toISOString(), 
                success: true, 
                deleted: true 
            };
            callback(null, result);
        }, Math.random() * 1000);
    }
}

/**
 * Адаптер для устаревшего API
 */
class LegacyAPIAdapter extends ModernAPI {
    constructor(legacyAPI) {
        super();
        this.legacyAPI = legacyAPI;
    }
    
    /**
     * Адаптирует GET запрос
     * @param {string} endpoint - Конечная точка
     * @returns {Promise<Object>} Данные
     */
    async get(endpoint) {
        return new Promise((resolve, reject) => {
            const url = `${this.legacyAPI.baseUrl}${endpoint}`;
            
            this.legacyAPI.fetchData(url, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    }
    
    /**
     * Адаптирует POST запрос
     * @param {string} endpoint - Конечная точка
     * @param {Object} data - Данные для отправки
     * @returns {Promise<Object>} Результат
     */
    async post(endpoint, data) {
        return new Promise((resolve, reject) => {
            const url = `${this.legacyAPI.baseUrl}${endpoint}`;
            
            this.legacyAPI.sendData(url, data, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    /**
     * Адаптирует PUT запрос
     * @param {string} endpoint - Конечная точка
     * @param {Object} data - Данные для обновления
     * @returns {Promise<Object>} Результат
     */
    async put(endpoint, data) {
        return new Promise((resolve, reject) => {
            const url = `${this.legacyAPI.baseUrl}${endpoint}`;
            
            this.legacyAPI.updateData(url, data, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
    
    /**
     * Адаптирует DELETE запрос
     * @param {string} endpoint - Конечная точка
     * @returns {Promise<Object>} Результат
     */
    async delete(endpoint) {
        return new Promise((resolve, reject) => {
            const url = `${this.legacyAPI.baseUrl}${endpoint}`;
            
            this.legacyAPI.removeData(url, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

console.log("\n=== ПРИМЕР С АДАПТАЦИЕЙ API ===");

// Создаем устаревший API
const legacyAPI = new LegacyAPI();

// Создаем адаптер
const apiAdapter = new LegacyAPIAdapter(legacyAPI);

// Клиентский код работает с современным интерфейсом
async function testModernAPI() {
    try {
        // GET запрос
        const data = await apiAdapter.get('/users');
        console.log('GET результат:', data);
        
        // POST запрос
        const postResult = await apiAdapter.post('/users', { name: 'Тест', email: 'test@example.com' });
        console.log('POST результат:', postResult);
        
        // PUT запрос
        const putResult = await apiAdapter.put('/users/1', { name: 'Обновленный тест' });
        console.log('PUT результат:', putResult);
        
        // DELETE запрос
        const deleteResult = await apiAdapter.delete('/users/1');
        console.log('DELETE результат:', deleteResult);
        
    } catch (error) {
        console.error('Ошибка API:', error.message);
    }
}

// Запускаем тест
testModernAPI();

// ===== ПРИМЕР С ДВУНАПРАВЛЕННЫМ АДАПТЕРОМ =====

/**
 * Двунаправленный адаптер
 * Может работать в обе стороны
 */
class BidirectionalAdapter {
    constructor() {
        this.legacySystem = new LegacyPaymentSystem();
        this.modernSystem = new ModernPaymentSystem();
    }
    
    /**
     * Адаптирует современный интерфейс к устаревшему
     * @param {Object} modernPayment - Современный формат платежа
     * @returns {Object} Результат в устаревшем формате
     */
    adaptToLegacy(modernPayment) {
        const { amount, currency, cardNumber, description } = modernPayment;
        
        // Преобразуем в устаревший формат
        const legacyResult = this.legacySystem.createTransaction(amount, currency, cardNumber);
        
        return {
            transaction_id: legacyResult,
            amount: amount,
            currency: currency,
            card_number: cardNumber,
            description: description,
            created_at: new Date().toISOString()
        };
    }
    
    /**
     * Адаптирует устаревший интерфейс к современному
     * @param {Object} legacyPayment - Устаревший формат платежа
     * @returns {Object} Результат в современном формате
     */
    adaptToModern(legacyPayment) {
        const { transaction_id, amount, currency, card_number, description } = legacyPayment;
        
        // Преобразуем в современный формат
        const modernResult = this.modernSystem.processPayment({
            amount: amount,
            currency: currency,
            cardNumber: card_number,
            description: description
        });
        
        return {
            transactionId: modernResult.transactionId,
            amount: amount,
            currency: currency,
            cardNumber: card_number,
            description: description,
            status: 'processing',
            timestamp: new Date().toISOString()
        };
    }
}

/**
 * Современная платежная система (заглушка)
 */
class ModernPaymentSystem {
    processPayment(paymentData) {
        return {
            transactionId: `MOD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            success: true
        };
    }
}

console.log("\n=== ПРИМЕР С ДВУНАПРАВЛЕННЫМ АДАПТЕРОМ ===");

// Создаем двунаправленный адаптер
const bidirectionalAdapter = new BidirectionalAdapter();

// Адаптируем современный платеж к устаревшему формату
const modernPayment = {
    amount: 200.75,
    currency: 'EUR',
    cardNumber: '9876543210987654',
    description: 'Международный платеж'
};

const legacyResult = bidirectionalAdapter.adaptToLegacy(modernPayment);
console.log('Адаптировано к устаревшему формату:', legacyResult);

// Адаптируем устаревший платеж к современному формату
const legacyPayment = {
    transaction_id: 'TXN_12345',
    amount: 150.25,
    currency: 'USD',
    card_number: '1111222233334444',
    description: 'Устаревший платеж'
};

const modernResult = bidirectionalAdapter.adaptToModern(legacyPayment);
console.log('Адаптировано к современному формату:', modernResult);

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Позволяет работать с несовместимыми интерфейсами
 * - Не требует изменения существующего кода
 * - Поддерживает принцип единственной ответственности
 * - Упрощает интеграцию различных систем
 * - Позволяет постепенно мигрировать на новые интерфейсы
 * - Улучшает тестируемость кода
 * 
 * НЕДОСТАТКИ:
 * - Может усложнить архитектуру
 * - Дополнительный слой абстракции
 * - Возможны проблемы с производительностью
 * - Может скрыть проблемы совместимости
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Facade pattern
 * - Может быть частью Bridge pattern
 * - Связан с Decorator pattern
 * - Используется в Proxy pattern
 */
