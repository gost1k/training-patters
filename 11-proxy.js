/**
 * PROXY PATTERN (Паттерн Заместитель)
 * 
 * Назначение: Предоставляет суррогат или заместитель для другого объекта,
 * контролируя доступ к нему. Proxy может перехватывать вызовы методов,
 * добавлять дополнительную логику или контролировать создание объекта.
 * 
 * Когда использовать:
 * - Когда нужно контролировать доступ к объекту
 * - Когда нужно добавить дополнительную логику при обращении к объекту
 * - Когда нужно отложить создание дорогостоящего объекта
 * - Когда нужно кэшировать результаты операций
 * - Когда нужно логировать обращения к объекту
 * - Когда нужно обеспечить безопасность доступа
 * 
 * Примеры использования:
 * - Виртуальный прокси (ленивая загрузка)
 * - Прокси-кэш
 * - Прокси-защита
 * - Прокси-логирование
 * - Прокси-синхронизация
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Интерфейс для объекта
 */
class Subject {
    /**
     * Операция, которую может выполнить объект
     * @param {string} data - Данные для обработки
     * @returns {string} Результат операции
     */
    operation(data) {
        throw new Error("Метод operation должен быть переопределен");
    }
    
    /**
     * Другая операция
     * @returns {string} Результат операции
     */
    anotherOperation() {
        throw new Error("Метод anotherOperation должен быть переопределен");
    }
}

/**
 * Реальный объект
 * Выполняет основную работу
 */
class RealSubject extends Subject {
    constructor() {
        super();
        this.initialized = false;
        this.initialize();
    }
    
    /**
     * Инициализация объекта (имитация дорогостоящей операции)
     */
    initialize() {
        console.log('[RealSubject] Инициализация объекта...');
        // Имитируем долгую инициализацию
        setTimeout(() => {
            this.initialized = true;
            console.log('[RealSubject] Объект инициализирован');
        }, 1000);
    }
    
    operation(data) {
        if (!this.initialized) {
            throw new Error('Объект еще не инициализирован');
        }
        
        console.log(`[RealSubject] Выполняем операцию с данными: ${data}`);
        return `Результат операции: ${data.toUpperCase()}`;
    }
    
    anotherOperation() {
        if (!this.initialized) {
            throw new Error('Объект еще не инициализирован');
        }
        
        console.log('[RealSubject] Выполняем другую операцию');
        return 'Результат другой операции';
    }
}

/**
 * Прокси
 * Контролирует доступ к реальному объекту
 */
class Proxy extends Subject {
    constructor() {
        super();
        this.realSubject = null;
        this.cache = new Map();
        this.accessCount = 0;
    }
    
    /**
     * Получает или создает реальный объект
     * @returns {RealSubject}
     */
    getRealSubject() {
        if (!this.realSubject) {
            console.log('[Proxy] Создаем реальный объект');
            this.realSubject = new RealSubject();
        }
        return this.realSubject;
    }
    
    operation(data) {
        console.log(`[Proxy] Перехватываем вызов operation с данными: ${data}`);
        
        // Проверяем кэш
        const cacheKey = `operation_${data}`;
        if (this.cache.has(cacheKey)) {
            console.log('[Proxy] Возвращаем результат из кэша');
            return this.cache.get(cacheKey);
        }
        
        // Увеличиваем счетчик обращений
        this.accessCount++;
        
        try {
            // Делегируем выполнение реальному объекту
            const result = this.getRealSubject().operation(data);
            
            // Кэшируем результат
            this.cache.set(cacheKey, result);
            console.log('[Proxy] Результат закэширован');
            
            return result;
        } catch (error) {
            console.log(`[Proxy] Ошибка: ${error.message}`);
            throw error;
        }
    }
    
    anotherOperation() {
        console.log('[Proxy] Перехватываем вызов anotherOperation');
        
        // Увеличиваем счетчик обращений
        this.accessCount++;
        
        try {
            // Делегируем выполнение реальному объекту
            return this.getRealSubject().anotherOperation();
        } catch (error) {
            console.log(`[Proxy] Ошибка: ${error.message}`);
            throw error;
        }
    }
    
    /**
     * Возвращает статистику использования прокси
     * @returns {Object}
     */
    getStats() {
        return {
            accessCount: this.accessCount,
            cacheSize: this.cache.size,
            isRealSubjectCreated: this.realSubject !== null,
            cacheKeys: Array.from(this.cache.keys())
        };
    }
    
    /**
     * Очищает кэш
     */
    clearCache() {
        this.cache.clear();
        console.log('[Proxy] Кэш очищен');
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР PROXY ===");

// Создаем прокси
const proxy = new Proxy();

// Пытаемся выполнить операции через прокси
console.log('\n--- Первый вызов operation ---');
try {
    const result1 = proxy.operation('test data');
    console.log('Результат:', result1);
} catch (error) {
    console.log('Ошибка:', error.message);
}

// Ждем немного для инициализации
setTimeout(() => {
    console.log('\n--- Повторный вызов operation ---');
    try {
        const result2 = proxy.operation('test data');
        console.log('Результат:', result2);
    } catch (error) {
        console.log('Ошибка:', error.message);
    }
    
    console.log('\n--- Вызов anotherOperation ---');
    try {
        const result3 = proxy.anotherOperation();
        console.log('Результат:', result3);
    } catch (error) {
        console.log('Ошибка:', error.message);
    }
    
    // Показываем статистику
    console.log('\n--- Статистика прокси ---');
    console.log(proxy.getStats());
    
}, 1500);

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ПРОКСИ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ =====

/**
 * Интерфейс для работы с базой данных
 */
class DatabaseInterface {
    /**
     * Выполняет запрос
     * @param {string} query - SQL запрос
     * @returns {Promise<Object>} Результат запроса
     */
    async executeQuery(query) {
        throw new Error("Метод executeQuery должен быть переопределен");
    }
    
    /**
     * Выполняет транзакцию
     * @param {Array} queries - Массив SQL запросов
     * @returns {Promise<Object>} Результат транзакции
     */
    async executeTransaction(queries) {
        throw new Error("Метод executeTransaction должен быть переопределен");
    }
    
    /**
     * Закрывает соединение
     */
    close() {
        throw new Error("Метод close должен быть переопределен");
    }
}

/**
 * Реальная база данных
 * Имитирует работу с базой данных
 */
class RealDatabase extends DatabaseInterface {
    constructor() {
        super();
        this.isConnected = false;
        this.connectionPool = [];
        this.maxConnections = 5;
        this.queryCount = 0;
    }
    
    /**
     * Подключается к базе данных
     */
    async connect() {
        if (this.isConnected) {
            return;
        }
        
        console.log('[RealDatabase] Подключение к базе данных...');
        
        // Имитируем долгое подключение
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.isConnected = true;
        console.log('[RealDatabase] Подключение установлено');
    }
    
    async executeQuery(query) {
        if (!this.isConnected) {
            await this.connect();
        }
        
        this.queryCount++;
        console.log(`[RealDatabase] Выполняем запрос #${this.queryCount}: ${query}`);
        
        // Имитируем выполнение запроса
        await new Promise(resolve => setTimeout(resolve, Math.random() * 200));
        
        const result = {
            rows: [
                { id: this.queryCount, query: query, timestamp: new Date().toISOString() }
            ],
            rowCount: 1,
            queryNumber: this.queryCount
        };
        
        console.log(`[RealDatabase] Запрос #${this.queryCount} выполнен`);
        return result;
    }
    
    async executeTransaction(queries) {
        if (!this.isConnected) {
            await this.connect();
        }
        
        console.log(`[RealDatabase] Начинаем транзакцию с ${queries.length} запросами`);
        
        const results = [];
        for (let i = 0; i < queries.length; i++) {
            const result = await this.executeQuery(queries[i]);
            results.push(result);
        }
        
        console.log('[RealDatabase] Транзакция завершена');
        return {
            success: true,
            results: results,
            timestamp: new Date().toISOString()
        };
    }
    
    close() {
        if (this.isConnected) {
            this.isConnected = false;
            console.log('[RealDatabase] Соединение с базой данных закрыто');
        }
    }
    
    /**
     * Возвращает статистику использования
     * @returns {Object}
     */
    getStats() {
        return {
            isConnected: this.isConnected,
            queryCount: this.queryCount,
            connectionPoolSize: this.connectionPool.length
        };
    }
}

/**
 * Прокси для базы данных
 * Добавляет кэширование, логирование и контроль доступа
 */
class DatabaseProxy extends DatabaseInterface {
    constructor() {
        super();
        this.realDatabase = null;
        this.cache = new Map();
        this.cacheTTL = 300000; // 5 минут
        this.accessLog = [];
        this.maxCacheSize = 100;
        this.rateLimit = 10; // максимальное количество запросов в минуту
        this.requestCount = 0;
        this.lastResetTime = Date.now();
    }
    
    /**
     * Получает или создает реальную базу данных
     * @returns {RealDatabase}
     */
    getRealDatabase() {
        if (!this.realDatabase) {
            console.log('[DatabaseProxy] Создаем реальную базу данных');
            this.realDatabase = new RealDatabase();
        }
        return this.realDatabase;
    }
    
    /**
     * Проверяет лимит запросов
     * @returns {boolean}
     */
    checkRateLimit() {
        const now = Date.now();
        
        // Сбрасываем счетчик каждую минуту
        if (now - this.lastResetTime > 60000) {
            this.requestCount = 0;
            this.lastResetTime = now;
        }
        
        if (this.requestCount >= this.rateLimit) {
            throw new Error('Превышен лимит запросов. Попробуйте позже.');
        }
        
        this.requestCount++;
        return true;
    }
    
    /**
     * Логирует доступ
     * @param {string} operation - Операция
     * @param {any} details - Детали
     */
    logAccess(operation, details) {
        this.accessLog.push({
            timestamp: new Date().toISOString(),
            operation: operation,
            details: details
        });
        
        // Ограничиваем размер лога
        if (this.accessLog.length > 1000) {
            this.accessLog.shift();
        }
    }
    
    /**
     * Генерирует ключ кэша для запроса
     * @param {string} query - SQL запрос
     * @returns {string}
     */
    generateCacheKey(query) {
        return `query_${query.replace(/\s+/g, '_')}`;
    }
    
    /**
     * Проверяет кэш
     * @param {string} cacheKey - Ключ кэша
     * @returns {Object|null} Результат из кэша или null
     */
    checkCache(cacheKey) {
        const cached = this.cache.get(cacheKey);
        
        if (cached && (Date.now() - cached.timestamp) < this.cacheTTL) {
            console.log(`[DatabaseProxy] Результат найден в кэше: ${cacheKey}`);
            return cached.data;
        }
        
        if (cached) {
            this.cache.delete(cacheKey);
            console.log(`[DatabaseProxy] Кэш истек для: ${cacheKey}`);
        }
        
        return null;
    }
    
    /**
     * Сохраняет результат в кэш
     * @param {string} cacheKey - Ключ кэша
     * @param {Object} data - Данные для кэширования
     */
    saveToCache(cacheKey, data) {
        // Очищаем кэш, если он переполнен
        if (this.cache.size >= this.maxCacheSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            console.log(`[DatabaseProxy] Удален старый кэш: ${oldestKey}`);
        }
        
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now()
        });
        
        console.log(`[DatabaseProxy] Результат сохранен в кэш: ${cacheKey}`);
    }
    
    async executeQuery(query) {
        console.log(`[DatabaseProxy] Перехватываем запрос: ${query}`);
        
        try {
            // Проверяем лимит запросов
            this.checkRateLimit();
            
            // Логируем доступ
            this.logAccess('executeQuery', { query: query });
            
            // Проверяем кэш
            const cacheKey = this.generateCacheKey(query);
            const cachedResult = this.checkCache(cacheKey);
            
            if (cachedResult) {
                return cachedResult;
            }
            
            // Выполняем запрос через реальную базу данных
            const result = await this.getRealDatabase().executeQuery(query);
            
            // Сохраняем в кэш (только для SELECT запросов)
            if (query.trim().toLowerCase().startsWith('select')) {
                this.saveToCache(cacheKey, result);
            }
            
            return result;
            
        } catch (error) {
            console.error(`[DatabaseProxy] Ошибка выполнения запроса: ${error.message}`);
            this.logAccess('error', { query: query, error: error.message });
            throw error;
        }
    }
    
    async executeTransaction(queries) {
        console.log(`[DatabaseProxy] Перехватываем транзакцию с ${queries.length} запросами`);
        
        try {
            // Проверяем лимит запросов
            this.checkRateLimit();
            
            // Логируем доступ
            this.logAccess('executeTransaction', { queryCount: queries.length });
            
            // Транзакции не кэшируем
            const result = await this.getRealDatabase().executeTransaction(queries);
            
            return result;
            
        } catch (error) {
            console.error(`[DatabaseProxy] Ошибка выполнения транзакции: ${error.message}`);
            this.logAccess('error', { queryCount: queries.length, error: error.message });
            throw error;
        }
    }
    
    close() {
        console.log('[DatabaseProxy] Перехватываем закрытие соединения');
        
        if (this.realDatabase) {
            this.realDatabase.close();
        }
        
        // Очищаем кэш при закрытии
        this.clearCache();
        
        console.log('[DatabaseProxy] Соединение закрыто');
    }
    
    /**
     * Очищает кэш
     */
    clearCache() {
        this.cache.clear();
        console.log('[DatabaseProxy] Кэш очищен');
    }
    
    /**
     * Возвращает статистику прокси
     * @returns {Object}
     */
    getStats() {
        return {
            cacheSize: this.cache.size,
            maxCacheSize: this.maxCacheSize,
            cacheTTL: this.cacheTTL,
            accessLogSize: this.accessLog.length,
            requestCount: this.requestCount,
            rateLimit: this.rateLimit,
            isRealDatabaseCreated: this.realDatabase !== null,
            realDatabaseStats: this.realDatabase ? this.realDatabase.getStats() : null
        };
    }
    
    /**
     * Возвращает последние записи доступа
     * @param {number} limit - Количество записей
     * @returns {Array}
     */
    getRecentAccessLog(limit = 10) {
        return this.accessLog.slice(-limit);
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ПРОКСИ ДЛЯ БАЗЫ ДАННЫХ ===");

// Создаем прокси базы данных
const dbProxy = new DatabaseProxy();

// Тестируем различные операции
async function testDatabaseProxy() {
    try {
        console.log('\n--- Тест 1: Выполнение запроса ---');
        const result1 = await dbProxy.executeQuery('SELECT * FROM users WHERE id = 1');
        console.log('Результат 1:', result1);
        
        console.log('\n--- Тест 2: Повторный запрос (должен быть из кэша) ---');
        const result2 = await dbProxy.executeQuery('SELECT * FROM users WHERE id = 1');
        console.log('Результат 2:', result2);
        
        console.log('\n--- Тест 3: Новый запрос ---');
        const result3 = await dbProxy.executeQuery('SELECT * FROM products WHERE category = "electronics"');
        console.log('Результат 3:', result3);
        
        console.log('\n--- Тест 4: Транзакция ---');
        const transactionResult = await dbProxy.executeTransaction([
            'INSERT INTO orders (user_id, total) VALUES (1, 100)',
            'UPDATE users SET order_count = order_count + 1 WHERE id = 1'
        ]);
        console.log('Результат транзакции:', transactionResult);
        
        // Показываем статистику
        console.log('\n--- Статистика прокси ---');
        console.log(dbProxy.getStats());
        
        // Показываем последние записи доступа
        console.log('\n--- Последние записи доступа ---');
        console.log(dbProxy.getRecentAccessLog(5));
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Запускаем тест
testDatabaseProxy();

// ===== ПРИМЕР С ПРОКСИ-ЗАЩИТОЙ =====

/**
 * Интерфейс для защищенного ресурса
 */
class ProtectedResource {
    /**
     * Получает данные
     * @param {string} userId - ID пользователя
     * @returns {Object} Данные
     */
    getData(userId) {
        throw new Error("Метод getData должен быть переопределен");
    }
    
    /**
     * Обновляет данные
     * @param {string} userId - ID пользователя
     * @param {Object} data - Новые данные
     * @returns {boolean} Результат обновления
     */
    updateData(userId, data) {
        throw new Error("Метод updateData должен быть переопределен");
    }
    
    /**
     * Удаляет данные
     * @param {string} userId - ID пользователя
     * @returns {boolean} Результат удаления
     */
    deleteData(userId) {
        throw new Error("Метод deleteData должен быть переопределен");
    }
}

/**
 * Реальный защищенный ресурс
 */
class RealProtectedResource extends ProtectedResource {
    constructor() {
        super();
        this.data = new Map();
        this.initializeData();
    }
    
    /**
     * Инициализирует тестовые данные
     */
    initializeData() {
        this.data.set('user1', { name: 'Иван', email: 'ivan@example.com', role: 'user' });
        this.data.set('user2', { name: 'Мария', email: 'maria@example.com', role: 'admin' });
        this.data.set('user3', { name: 'Петр', email: 'petr@example.com', role: 'user' });
    }
    
    getData(userId) {
        console.log(`[RealProtectedResource] Получаем данные для пользователя: ${userId}`);
        
        if (!this.data.has(userId)) {
            throw new Error('Пользователь не найден');
        }
        
        return { ...this.data.get(userId) };
    }
    
    updateData(userId, data) {
        console.log(`[RealProtectedResource] Обновляем данные для пользователя: ${userId}`);
        
        if (!this.data.has(userId)) {
            throw new Error('Пользователь не найден');
        }
        
        const currentData = this.data.get(userId);
        this.data.set(userId, { ...currentData, ...data });
        
        return true;
    }
    
    deleteData(userId) {
        console.log(`[RealProtectedResource] Удаляем данные для пользователя: ${userId}`);
        
        if (!this.data.has(userId)) {
            throw new Error('Пользователь не найден');
        }
        
        return this.data.delete(userId);
    }
}

/**
 * Прокси-защита
 * Контролирует доступ к защищенному ресурсу
 */
class ProtectionProxy extends ProtectedResource {
    constructor() {
        super();
        this.realResource = new RealProtectedResource();
        this.accessControl = new Map();
        this.auditLog = [];
        this.initializeAccessControl();
    }
    
    /**
     * Инициализирует контроль доступа
     */
    initializeAccessControl() {
        // user1 может читать и обновлять свои данные
        this.accessControl.set('user1', {
            canRead: true,
            canUpdate: true,
            canDelete: false,
            canReadOthers: false,
            canUpdateOthers: false,
            canDeleteOthers: false
        });
        
        // user2 (admin) может все
        this.accessControl.set('user2', {
            canRead: true,
            canUpdate: true,
            canDelete: true,
            canReadOthers: true,
            canUpdateOthers: true,
            canDeleteOthers: true
        });
        
        // user3 может только читать свои данные
        this.accessControl.set('user3', {
            canRead: true,
            canUpdate: false,
            canDelete: false,
            canReadOthers: false,
            canUpdateOthers: false,
            canDeleteOthers: false
        });
    }
    
    /**
     * Проверяет права доступа
     * @param {string} userId - ID пользователя
     * @param {string} operation - Операция
     * @param {string} targetUserId - ID целевого пользователя
     * @returns {boolean}
     */
    checkAccess(userId, operation, targetUserId = null) {
        const userPermissions = this.accessControl.get(userId);
        
        if (!userPermissions) {
            return false;
        }
        
        const isOwnData = userId === targetUserId;
        
        switch (operation) {
            case 'read':
                return isOwnData ? userPermissions.canRead : userPermissions.canReadOthers;
            case 'update':
                return isOwnData ? userPermissions.canUpdate : userPermissions.canUpdateOthers;
            case 'delete':
                return isOwnData ? userPermissions.canDelete : userPermissions.canDeleteOthers;
            default:
                return false;
        }
    }
    
    /**
     * Логирует попытку доступа
     * @param {string} userId - ID пользователя
     * @param {string} operation - Операция
     * @param {string} targetUserId - ID целевого пользователя
     * @param {boolean} granted - Доступ разрешен
     */
    logAccess(userId, operation, targetUserId, granted) {
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            userId: userId,
            operation: operation,
            targetUserId: targetUserId,
            granted: granted,
            ip: '192.168.1.1' // Имитация IP адреса
        });
        
        // Ограничиваем размер лога
        if (this.auditLog.length > 1000) {
            this.auditLog.shift();
        }
    }
    
    getData(userId) {
        console.log(`[ProtectionProxy] Попытка чтения данных для пользователя: ${userId}`);
        
        // Проверяем права доступа
        if (!this.checkAccess(userId, 'read', userId)) {
            const message = `Доступ запрещен для пользователя ${userId}`;
            console.log(`[ProtectionProxy] ${message}`);
            this.logAccess(userId, 'read', userId, false);
            throw new Error(message);
        }
        
        // Логируем успешный доступ
        this.logAccess(userId, 'read', userId, true);
        
        // Делегируем выполнение реальному ресурсу
        return this.realResource.getData(userId);
    }
    
    updateData(userId, data) {
        console.log(`[ProtectionProxy] Попытка обновления данных для пользователя: ${userId}`);
        
        // Проверяем права доступа
        if (!this.checkAccess(userId, 'update', userId)) {
            const message = `Доступ запрещен для пользователя ${userId}`;
            console.log(`[ProtectionProxy] ${message}`);
            this.logAccess(userId, 'update', userId, false);
            throw new Error(message);
        }
        
        // Логируем успешный доступ
        this.logAccess(userId, 'update', userId, true);
        
        // Делегируем выполнение реальному ресурсу
        return this.realResource.updateData(userId, data);
    }
    
    deleteData(userId) {
        console.log(`[ProtectionProxy] Попытка удаления данных для пользователя: ${userId}`);
        
        // Проверяем права доступа
        if (!this.checkAccess(userId, 'delete', userId)) {
            const message = `Доступ запрещен для пользователя ${userId}`;
            console.log(`[ProtectionProxy] ${message}`);
            this.logAccess(userId, 'delete', userId, false);
            this.logAccess(userId, 'delete', userId, false);
            throw new Error(message);
        }
        
        // Логируем успешный доступ
        this.logAccess(userId, 'delete', userId, true);
        
        // Делегируем выполнение реальному ресурсу
        return this.realResource.deleteData(userId);
    }
    
    /**
     * Возвращает статистику прокси
     * @returns {Object}
     */
    getStats() {
        const totalAttempts = this.auditLog.length;
        const grantedAccess = this.auditLog.filter(entry => entry.granted).length;
        const deniedAccess = totalAttempts - grantedAccess;
        
        return {
            totalAttempts: totalAttempts,
            grantedAccess: grantedAccess,
            deniedAccess: deniedAccess,
            accessControlSize: this.accessControl.size,
            auditLogSize: this.auditLog.length
        };
    }
    
    /**
     * Возвращает последние записи аудита
     * @param {number} limit - Количество записей
     * @returns {Array}
     */
    getRecentAuditLog(limit = 10) {
        return this.auditLog.slice(-limit);
    }
}

console.log("\n=== ПРИМЕР С ПРОКСИ-ЗАЩИТОЙ ===");

// Создаем прокси-защиту
const protectionProxy = new ProtectionProxy();

// Тестируем различные сценарии доступа
async function testProtectionProxy() {
    try {
        console.log('\n--- Тест 1: user1 читает свои данные ---');
        const user1Data = protectionProxy.getData('user1');
        console.log('Данные user1:', user1Data);
        
        console.log('\n--- Тест 2: user1 обновляет свои данные ---');
        const updateResult = protectionProxy.updateData('user1', { age: 25 });
        console.log('Результат обновления:', updateResult);
        
        console.log('\n--- Тест 3: user3 пытается обновить свои данные (должно быть запрещено) ---');
        try {
            protectionProxy.updateData('user3', { age: 30 });
        } catch (error) {
            console.log('Ожидаемая ошибка:', error.message);
        }
        
        console.log('\n--- Тест 4: user2 (admin) читает данные user1 ---');
        const adminReadResult = protectionProxy.getData('user1');
        console.log('Результат чтения admin:', adminReadResult);
        
        console.log('\n--- Тест 5: user1 пытается удалить свои данные (должно быть запрещено) ---');
        try {
            protectionProxy.deleteData('user1');
        } catch (error) {
            console.log('Ожидаемая ошибка:', error.message);
        }
        
        // Показываем статистику
        console.log('\n--- Статистика прокси-защиты ---');
        console.log(protectionProxy.getStats());
        
        // Показываем последние записи аудита
        console.log('\n--- Последние записи аудита ---');
        console.log(protectionProxy.getRecentAuditLog(5));
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Запускаем тест
testProtectionProxy();

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Контролирует доступ к объекту
 * - Добавляет дополнительную логику без изменения объекта
 * - Поддерживает ленивую инициализацию
 * - Обеспечивает кэширование
 * - Упрощает реализацию безопасности
 * - Поддерживает принцип единственной ответственности
 * 
 * НЕДОСТАТКИ:
 * - Может усложнить архитектуру
 * - Дополнительный слой абстракции
 * - Возможны проблемы с производительностью
 * - Может скрыть проблемы с объектом
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Decorator pattern
 * - Может быть частью Adapter pattern
 * - Связан с Facade pattern
 * - Используется в Chain of Responsibility
 */
