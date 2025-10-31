/**
 * FACADE PATTERN (Паттерн Фасад)
 * 
 * Назначение: Предоставляет упрощенный интерфейс к сложной подсистеме,
 * скрывая её сложность и предоставляя клиенту простой способ взаимодействия.
 * Фасад инкапсулирует сложную логику и предоставляет единую точку входа.
 * 
 * Когда использовать:
 * - Когда нужно упростить сложную подсистему
 * - Когда нужно разделить подсистему на слои
 * - Когда нужно обеспечить единую точку входа для подсистемы
 * - Когда нужно уменьшить связанность между клиентом и подсистемой
 * - Когда нужно упростить тестирование
 * 
 * Примеры использования:
 * - Упрощение работы с внешними API
 * - Управление сложными процессами
 * - Упрощение работы с базой данных
 * - Управление жизненным циклом объектов
 * - Упрощение конфигурации систем
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Сложная подсистема A
 */
class SubsystemA {
    operationA1() {
        console.log('[SubsystemA] Выполняем операцию A1');
        return 'Результат A1';
    }
    
    operationA2() {
        console.log('[SubsystemA] Выполняем операцию A2');
        return 'Результат A2';
    }
    
    complexOperationA() {
        console.log('[SubsystemA] Выполняем сложную операцию A');
        return 'Сложный результат A';
    }
}

/**
 * Сложная подсистема B
 */
class SubsystemB {
    operationB1() {
        console.log('[SubsystemB] Выполняем операцию B1');
        return 'Результат B1';
    }
    
    operationB2() {
        console.log('[SubsystemB] Выполняем операцию B2');
        return 'Результат B2';
    }
    
    complexOperationB() {
        console.log('[SubsystemB] Выполняем сложную операцию B');
        return 'Сложный результат B';
    }
}

/**
 * Сложная подсистема C
 */
class SubsystemC {
    operationC1() {
        console.log('[SubsystemC] Выполняем операцию C1');
        return 'Результат C1';
    }
    
    operationC2() {
        console.log('[SubsystemC] Выполняем операцию C2');
        return 'Результат C2';
    }
    
    complexOperationC() {
        console.log('[SubsystemC] Выполняем сложную операцию C');
        return 'Сложный результат C';
    }
}

/**
 * Фасад
 * Предоставляет упрощенный интерфейс к сложным подсистемам
 */
class Facade {
    constructor() {
        this.subsystemA = new SubsystemA();
        this.subsystemB = new SubsystemB();
        this.subsystemC = new SubsystemC();
    }
    
    /**
     * Упрощенная операция, которая использует несколько подсистем
     * @returns {string} Результат выполнения
     */
    simpleOperation() {
        console.log('[Facade] Начинаем простую операцию');
        
        const resultA = this.subsystemA.operationA1();
        const resultB = this.subsystemB.operationB1();
        const resultC = this.subsystemC.operationC1();
        
        console.log('[Facade] Простая операция завершена');
        return `Простая операция: ${resultA}, ${resultB}, ${resultC}`;
    }
    
    /**
     * Сложная операция с дополнительной логикой
     * @returns {string} Результат выполнения
     */
    complexOperation() {
        console.log('[Facade] Начинаем сложную операцию');
        
        // Выполняем операции в определенном порядке
        const resultA = this.subsystemA.complexOperationA();
        const resultB = this.subsystemB.complexOperationB();
        const resultC = this.subsystemC.complexOperationC();
        
        // Добавляем дополнительную логику
        const combinedResult = this.combineResults(resultA, resultB, resultC);
        
        console.log('[Facade] Сложная операция завершена');
        return combinedResult;
    }
    
    /**
     * Операция с условной логикой
     * @param {string} type - Тип операции
     * @returns {string} Результат выполнения
     */
    conditionalOperation(type) {
        console.log(`[Facade] Начинаем условную операцию типа: ${type}`);
        
        let result;
        
        switch (type) {
            case 'A':
                result = this.subsystemA.operationA1() + ' + ' + this.subsystemA.operationA2();
                break;
            case 'B':
                result = this.subsystemB.operationB1() + ' + ' + this.subsystemB.operationB2();
                break;
            case 'C':
                result = this.subsystemC.operationC1() + ' + ' + this.subsystemC.operationC2();
                break;
            default:
                result = this.simpleOperation();
        }
        
        console.log('[Facade] Условная операция завершена');
        return `Условная операция ${type}: ${result}`;
    }
    
    /**
     * Приватный метод для объединения результатов
     * @param {string} resultA - Результат A
     * @param {string} resultB - Результат B
     * @param {string} resultC - Результат C
     * @returns {string} Объединенный результат
     */
    combineResults(resultA, resultB, resultC) {
        return `Объединенный результат: ${resultA} | ${resultB} | ${resultC}`;
    }
    
    /**
     * Получает доступ к подсистемам (для продвинутых случаев)
     * @returns {Object} Объект с подсистемами
     */
    getSubsystems() {
        return {
            subsystemA: this.subsystemA,
            subsystemB: this.subsystemB,
            subsystemC: this.subsystemC
        };
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР FACADE ===");

// Клиентский код работает только с фасадом
const facade = new Facade();

// Простая операция
console.log(facade.simpleOperation());

console.log('\n' + '='.repeat(50) + '\n');

// Сложная операция
console.log(facade.complexOperation());

console.log('\n' + '='.repeat(50) + '\n');

// Условная операция
console.log(facade.conditionalOperation('A'));
console.log(facade.conditionalOperation('B'));
console.log(facade.conditionalOperation('C'));

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА УПРАВЛЕНИЯ ДОМОМ =====

/**
 * Подсистема управления освещением
 */
class LightingSystem {
    constructor() {
        this.lights = new Map();
        this.schedule = new Map();
    }
    
    addLight(id, location) {
        this.lights.set(id, { location, isOn: false, brightness: 0 });
        console.log(`[LightingSystem] Добавлен светильник ${id} в ${location}`);
    }
    
    turnOn(id) {
        const light = this.lights.get(id);
        if (light) {
            light.isOn = true;
            light.brightness = 100;
            console.log(`[LightingSystem] Светильник ${id} включен`);
        }
    }
    
    turnOff(id) {
        const light = this.lights.get(id);
        if (light) {
            light.isOn = false;
            light.brightness = 0;
            console.log(`[LightingSystem] Светильник ${id} выключен`);
        }
    }
    
    setBrightness(id, brightness) {
        const light = this.lights.get(id);
        if (light && light.isOn) {
            light.brightness = Math.max(0, Math.min(100, brightness));
            console.log(`[LightingSystem] Яркость светильника ${id} установлена на ${light.brightness}%`);
        }
    }
    
    scheduleLight(id, time, action) {
        this.schedule.set(`${id}_${time}`, { id, time, action });
        console.log(`[LightingSystem] Запланировано действие ${action} для светильника ${id} в ${time}`);
    }
    
    getStatus() {
        const status = {};
        for (const [id, light] of this.lights) {
            status[id] = { ...light };
        }
        return status;
    }
}

/**
 * Подсистема управления климатом
 */
class ClimateSystem {
    constructor() {
        this.temperature = 22;
        this.humidity = 50;
        this.mode = 'auto';
        this.schedule = new Map();
    }
    
    setTemperature(temp) {
        this.temperature = Math.max(16, Math.min(30, temp));
        console.log(`[ClimateSystem] Температура установлена на ${this.temperature}°C`);
    }
    
    setHumidity(hum) {
        this.humidity = Math.max(30, Math.min(80, hum));
        console.log(`[ClimateSystem] Влажность установлена на ${this.humidity}%`);
    }
    
    setMode(mode) {
        const validModes = ['auto', 'cool', 'heat', 'fan'];
        if (validModes.includes(mode)) {
            this.mode = mode;
            console.log(`[ClimateSystem] Режим установлен на ${this.mode}`);
        }
    }
    
    scheduleClimate(time, temperature, humidity) {
        this.schedule.set(time, { temperature, humidity });
        console.log(`[ClimateSystem] Запланирован климат: ${temperature}°C, ${humidity}% в ${time}`);
    }
    
    getStatus() {
        return {
            temperature: this.temperature,
            humidity: this.humidity,
            mode: this.mode
        };
    }
}

/**
 * Подсистема управления безопасностью
 */
class SecuritySystem {
    constructor() {
        this.sensors = new Map();
        this.cameras = new Map();
        this.alarms = new Map();
        this.isArmed = false;
    }
    
    addSensor(id, location, type) {
        this.sensors.set(id, { location, type, isActive: true, lastTriggered: null });
        console.log(`[SecuritySystem] Добавлен датчик ${id} типа ${type} в ${location}`);
    }
    
    addCamera(id, location) {
        this.cameras.set(id, { location, isRecording: false, isStreaming: false });
        console.log(`[SecuritySystem] Добавлена камера ${id} в ${location}`);
    }
    
    armSystem() {
        this.isArmed = true;
        console.log('[SecuritySystem] Система безопасности активирована');
    }
    
    disarmSystem() {
        this.isArmed = false;
        console.log('[SecuritySystem] Система безопасности деактивирована');
    }
    
    triggerAlarm(location, type) {
        const alarmId = `ALARM_${Date.now()}`;
        this.alarms.set(alarmId, { location, type, timestamp: new Date(), isActive: true });
        console.log(`[SecuritySystem] Тревога в ${location}: ${type}`);
        return alarmId;
    }
    
    getStatus() {
        return {
            isArmed: this.isArmed,
            activeSensors: Array.from(this.sensors.values()).filter(s => s.isActive).length,
            activeCameras: Array.from(this.cameras.values()).filter(c => c.isRecording).length,
            activeAlarms: Array.from(this.alarms.values()).filter(a => a.isActive).length
        };
    }
}

/**
 * Подсистема управления развлечениями
 */
class EntertainmentSystem {
    constructor() {
        this.speakers = new Map();
        this.tv = { isOn: false, channel: 1, volume: 20 };
        this.music = { isPlaying: false, currentTrack: null, volume: 30 };
    }
    
    addSpeaker(id, location) {
        this.speakers.set(id, { location, isOn: false, volume: 0 });
        console.log(`[EntertainmentSystem] Добавлен динамик ${id} в ${location}`);
    }
    
    turnOnTV() {
        this.tv.isOn = true;
        console.log('[EntertainmentSystem] Телевизор включен');
    }
    
    turnOffTV() {
        this.tv.isOn = false;
        console.log('[EntertainmentSystem] Телевизор выключен');
    }
    
    changeChannel(channel) {
        if (this.tv.isOn) {
            this.tv.channel = channel;
            console.log(`[EntertainmentSystem] Канал изменен на ${channel}`);
        }
    }
    
    playMusic(track) {
        this.music.isPlaying = true;
        this.music.currentTrack = track;
        console.log(`[EntertainmentSystem] Воспроизводится музыка: ${track}`);
    }
    
    stopMusic() {
        this.music.isPlaying = false;
        this.music.currentTrack = null;
        console.log('[EntertainmentSystem] Музыка остановлена');
    }
    
    getStatus() {
        return {
            tv: { ...this.tv },
            music: { ...this.music },
            speakers: Array.from(this.speakers.values()).filter(s => s.isOn).length
        };
    }
}

/**
 * Фасад для системы управления домом
 */
class SmartHomeFacade {
    constructor() {
        this.lighting = new LightingSystem();
        this.climate = new ClimateSystem();
        this.security = new SecuritySystem();
        this.entertainment = new EntertainmentSystem();
        
        this.initializeSystems();
    }
    
    /**
     * Инициализирует все системы
     */
    initializeSystems() {
        // Добавляем базовые светильники
        this.lighting.addLight('LIVING_ROOM', 'Гостиная');
        this.lighting.addLight('KITCHEN', 'Кухня');
        this.lighting.addLight('BEDROOM', 'Спальня');
        
        // Добавляем датчики безопасности
        this.security.addSensor('DOOR_SENSOR', 'Входная дверь', 'motion');
        this.security.addSensor('WINDOW_SENSOR', 'Окно', 'break');
        this.security.addCamera('FRONT_DOOR', 'Входная дверь');
        
        // Добавляем динамики
        this.entertainment.addSpeaker('LIVING_SPEAKER', 'Гостиная');
        this.entertainment.addSpeaker('BEDROOM_SPEAKER', 'Спальня');
        
        console.log('[SmartHomeFacade] Все системы инициализированы');
    }
    
    /**
     * Режим "Домой"
     */
    homeMode() {
        console.log('[SmartHomeFacade] Активируем режим "Домой"');
        
        // Освещение
        this.lighting.turnOn('LIVING_ROOM');
        this.lighting.setBrightness('LIVING_ROOM', 80);
        this.lighting.turnOn('KITCHEN');
        this.lighting.setBrightness('KITCHEN', 60);
        
        // Климат
        this.climate.setTemperature(23);
        this.climate.setMode('auto');
        
        // Безопасность
        this.security.disarmSystem();
        
        // Развлечения
        this.entertainment.turnOnTV();
        this.entertainment.changeChannel(5);
        
        console.log('[SmartHomeFacade] Режим "Домой" активирован');
    }
    
    /**
     * Режим "Сон"
     */
    sleepMode() {
        console.log('[SmartHomeFacade] Активируем режим "Сон"');
        
        // Освещение
        this.lighting.turnOff('LIVING_ROOM');
        this.lighting.turnOff('KITCHEN');
        this.lighting.turnOn('BEDROOM');
        this.lighting.setBrightness('BEDROOM', 20);
        
        // Климат
        this.climate.setTemperature(20);
        this.climate.setMode('auto');
        
        // Безопасность
        this.security.armSystem();
        
        // Развлечения
        this.entertainment.turnOffTV();
        this.entertainment.stopMusic();
        
        console.log('[SmartHomeFacade] Режим "Сон" активирован');
    }
    
    /**
     * Режим "Выход"
     */
    awayMode() {
        console.log('[SmartHomeFacade] Активируем режим "Выход"');
        
        // Освещение
        this.lighting.turnOff('LIVING_ROOM');
        this.lighting.turnOff('KITCHEN');
        this.lighting.turnOff('BEDROOM');
        
        // Климат
        this.climate.setTemperature(18);
        this.climate.setMode('auto');
        
        // Безопасность
        this.security.armSystem();
        
        // Развлечения
        this.entertainment.turnOffTV();
        this.entertainment.stopMusic();
        
        console.log('[SmartHomeFacade] Режим "Выход" активирован');
    }
    
    /**
     * Режим "Вечеринка"
     */
    partyMode() {
        console.log('[SmartHomeFacade] Активируем режим "Вечеринка"');
        
        // Освещение
        this.lighting.turnOn('LIVING_ROOM');
        this.lighting.setBrightness('LIVING_ROOM', 100);
        this.lighting.turnOn('KITCHEN');
        this.lighting.setBrightness('KITCHEN', 80);
        
        // Климат
        this.climate.setTemperature(21);
        this.climate.setMode('cool');
        
        // Безопасность
        this.security.disarmSystem();
        
        // Развлечения
        this.entertainment.turnOnTV();
        this.entertainment.playMusic('Party Mix');
        this.entertainment.speakers.get('LIVING_SPEAKER').isOn = true;
        this.entertainment.speakers.get('LIVING_SPEAKER').volume = 70;
        
        console.log('[SmartHomeFacade] Режим "Вечеринка" активирован');
    }
    
    /**
     * Получает общий статус всех систем
     * @returns {Object} Статус всех систем
     */
    getOverallStatus() {
        return {
            lighting: this.lighting.getStatus(),
            climate: this.climate.getStatus(),
            security: this.security.getStatus(),
            entertainment: this.entertainment.getStatus(),
            timestamp: new Date().toISOString()
        };
    }
    
    /**
     * Устанавливает расписание для систем
     * @param {string} time - Время
     * @param {string} mode - Режим
     */
    setSchedule(time, mode) {
        console.log(`[SmartHomeFacade] Устанавливаем расписание: ${mode} в ${time}`);
        
        switch (mode) {
            case 'home':
                this.lighting.scheduleLight('LIVING_ROOM', time, 'on');
                this.climate.scheduleClimate(time, 23, 50);
                break;
            case 'sleep':
                this.lighting.scheduleLight('BEDROOM', time, 'on');
                this.climate.scheduleClimate(time, 20, 45);
                break;
            case 'away':
                this.climate.scheduleClimate(time, 18, 40);
                break;
        }
    }
    
    /**
     * Обрабатывает экстренную ситуацию
     * @param {string} type - Тип экстренной ситуации
     * @param {string} location - Местоположение
     */
    emergencyResponse(type, location) {
        console.log(`[SmartHomeFacade] Экстренная ситуация: ${type} в ${location}`);
        
        // Включаем все освещение
        for (const [id, light] of this.lighting.lights) {
            this.lighting.turnOn(id);
            this.lighting.setBrightness(id, 100);
        }
        
        // Активируем безопасность
        this.security.armSystem();
        
        // Тревога
        const alarmId = this.security.triggerAlarm(location, type);
        
        console.log(`[SmartHomeFacade] Экстренная ситуация обработана, тревога: ${alarmId}`);
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - СИСТЕМА УПРАВЛЕНИЯ ДОМОМ ===");

// Создаем фасад умного дома
const smartHome = new SmartHomeFacade();

// Активируем различные режимы
smartHome.homeMode();
console.log('\nСтатус в режиме "Домой":', smartHome.getOverallStatus());

console.log('\n' + '='.repeat(50) + '\n');

smartHome.sleepMode();
console.log('\nСтатус в режиме "Сон":', smartHome.getOverallStatus());

console.log('\n' + '='.repeat(50) + '\n');

smartHome.awayMode();
console.log('\nСтатус в режиме "Выход":', smartHome.getOverallStatus());

console.log('\n' + '='.repeat(50) + '\n');

smartHome.partyMode();
console.log('\nСтатус в режиме "Вечеринка":', smartHome.getOverallStatus());

// Устанавливаем расписание
smartHome.setSchedule('08:00', 'home');
smartHome.setSchedule('22:00', 'sleep');

// Обрабатываем экстренную ситуацию
smartHome.emergencyResponse('Дым', 'Кухня');

// ===== ПРИМЕР С ФАСАДОМ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ =====

/**
 * Подсистема подключения к базе данных
 */
class DatabaseConnection {
    constructor() {
        this.isConnected = false;
        this.connectionPool = [];
        this.maxConnections = 5;
    }
    
    connect() {
        if (!this.isConnected) {
            this.isConnected = true;
            console.log('[DatabaseConnection] Подключение к базе данных установлено');
        }
        return this.isConnected;
    }
    
    disconnect() {
        if (this.isConnected) {
            this.isConnected = false;
            console.log('[DatabaseConnection] Подключение к базе данных закрыто');
        }
    }
    
    getConnection() {
        if (this.connectionPool.length < this.maxConnections) {
            const connection = { id: Date.now(), inUse: false };
            this.connectionPool.push(connection);
            console.log(`[DatabaseConnection] Получено соединение ${connection.id}`);
            return connection;
        }
        throw new Error('Достигнут лимит соединений');
    }
    
    releaseConnection(connectionId) {
        const connection = this.connectionPool.find(c => c.id === connectionId);
        if (connection) {
            connection.inUse = false;
            console.log(`[DatabaseConnection] Соединение ${connectionId} освобождено`);
        }
    }
}

/**
 * Подсистема кэширования
 */
class CacheSystem {
    constructor() {
        this.cache = new Map();
        this.maxSize = 1000;
    }
    
    set(key, value, ttl = 3600000) { // TTL по умолчанию 1 час
        if (this.cache.size >= this.maxSize) {
            this.evictOldest();
        }
        
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
        console.log(`[CacheSystem] Кэшировано: ${key}`);
    }
    
    get(key) {
        const item = this.cache.get(key);
        if (item && (Date.now() - item.timestamp) < item.ttl) {
            console.log(`[CacheSystem] Получено из кэша: ${key}`);
            return item.value;
        }
        
        if (item) {
            this.cache.delete(key);
            console.log(`[CacheSystem] Кэш истек для: ${key}`);
        }
        
        return null;
    }
    
    evictOldest() {
        let oldestKey = null;
        let oldestTime = Date.now();
        
        for (const [key, item] of this.cache) {
            if (item.timestamp < oldestTime) {
                oldestTime = item.timestamp;
                oldestKey = key;
            }
        }
        
        if (oldestKey) {
            this.cache.delete(oldestKey);
            console.log(`[CacheSystem] Удален старый кэш: ${oldestKey}`);
        }
    }
    
    clear() {
        this.cache.clear();
        console.log('[CacheSystem] Кэш очищен');
    }
}

/**
 * Подсистема логирования
 */
class LoggingSystem {
    constructor() {
        this.logs = [];
        this.maxLogs = 10000;
    }
    
    log(level, message, context = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context
        };
        
        this.logs.push(logEntry);
        
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
        
        console.log(`[${level.toUpperCase()}] ${message}`, context);
    }
    
    info(message, context) {
        this.log('info', message, context);
    }
    
    warn(message, context) {
        this.log('warn', message, context);
    }
    
    error(message, context) {
        this.log('error', message, context);
    }
    
    getLogs(level = null, limit = 100) {
        let filteredLogs = this.logs;
        
        if (level) {
            filteredLogs = this.logs.filter(log => log.level === level);
        }
        
        return filteredLogs.slice(-limit);
    }
}

/**
 * Фасад для работы с базой данных
 */
class DatabaseFacade {
    constructor() {
        this.connection = new DatabaseConnection();
        this.cache = new CacheSystem();
        this.logger = new LoggingSystem();
    }
    
    /**
     * Выполняет запрос с кэшированием и логированием
     * @param {string} query - SQL запрос
     * @param {Object} params - Параметры запроса
     * @param {boolean} useCache - Использовать ли кэш
     * @returns {Promise<Object>} Результат запроса
     */
    async executeQuery(query, params = {}, useCache = true) {
        const cacheKey = this.generateCacheKey(query, params);
        
        try {
            // Проверяем кэш
            if (useCache) {
                const cachedResult = this.cache.get(cacheKey);
                if (cachedResult) {
                    this.logger.info('Запрос выполнен из кэша', { query, params });
                    return cachedResult;
                }
            }
            
            // Подключаемся к базе данных
            this.connection.connect();
            const dbConnection = this.connection.getConnection();
            
            // Выполняем запрос (имитация)
            const result = await this.simulateQuery(query, params);
            
            // Кэшируем результат
            if (useCache) {
                this.cache.set(cacheKey, result);
            }
            
            // Освобождаем соединение
            this.connection.releaseConnection(dbConnection.id);
            
            this.logger.info('Запрос выполнен успешно', { query, params, result });
            return result;
            
        } catch (error) {
            this.logger.error('Ошибка выполнения запроса', { query, params, error: error.message });
            throw error;
        }
    }
    
    /**
     * Имитирует выполнение SQL запроса
     * @param {string} query - SQL запрос
     * @param {Object} params - Параметры запроса
     * @returns {Promise<Object>} Результат
     */
    async simulateQuery(query, params) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const result = {
                    rows: [
                        { id: 1, name: 'Тестовые данные', query: query, params: params }
                    ],
                    rowCount: 1,
                    timestamp: new Date().toISOString()
                };
                resolve(result);
            }, Math.random() * 100);
        });
    }
    
    /**
     * Генерирует ключ кэша для запроса
     * @param {string} query - SQL запрос
     * @param {Object} params - Параметры запроса
     * @returns {string} Ключ кэша
     */
    generateCacheKey(query, params) {
        return `query_${query}_${JSON.stringify(params)}`;
    }
    
    /**
     * Получает статистику использования
     * @returns {Object} Статистика
     */
    getStats() {
        return {
            database: {
                isConnected: this.connection.isConnected,
                activeConnections: this.connection.connectionPool.filter(c => c.inUse).length,
                totalConnections: this.connection.connectionPool.length
            },
            cache: {
                size: this.cache.cache.size,
                maxSize: this.cache.maxSize
            },
            logging: {
                totalLogs: this.logger.logs.length,
                maxLogs: this.logger.maxLogs
            }
        };
    }
    
    /**
     * Очищает все системы
     */
    cleanup() {
        this.connection.disconnect();
        this.cache.clear();
        this.logger.info('Система очищена');
    }
}

console.log("\n=== ПРИМЕР С ФАСАДОМ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ ===");

// Создаем фасад базы данных
const dbFacade = new DatabaseFacade();

// Выполняем запросы
async function testDatabaseFacade() {
    try {
        // Первый запрос (с кэшированием)
        const result1 = await dbFacade.executeQuery('SELECT * FROM users WHERE id = ?', { id: 1 });
        console.log('Результат 1:', result1);
        
        // Второй запрос (должен быть из кэша)
        const result2 = await dbFacade.executeQuery('SELECT * FROM users WHERE id = ?', { id: 1 });
        console.log('Результат 2:', result2);
        
        // Третий запрос (без кэширования)
        const result3 = await dbFacade.executeQuery('SELECT * FROM products', {}, false);
        console.log('Результат 3:', result3);
        
        // Получаем статистику
        console.log('Статистика:', dbFacade.getStats());
        
        // Получаем логи
        console.log('Последние логи:', dbFacade.logger.getLogs('info', 3));
        
    } catch (error) {
        console.error('Ошибка:', error.message);
    }
}

// Запускаем тест
testDatabaseFacade();

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Упрощает сложные подсистемы для клиентов
 * - Уменьшает связанность между клиентом и подсистемой
 * - Централизует управление подсистемой
 * - Упрощает тестирование
 * - Поддерживает принцип единственной ответственности
 * - Позволяет легко изменять подсистему
 * 
 * НЕДОСТАТКИ:
 * - Может стать "божественным объектом"
 * - Может скрыть важные детали подсистемы
 * - Может усложнить отладку
 * - Может нарушить принцип инверсии зависимостей
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Adapter pattern
 * - Может быть частью Mediator pattern
 * - Связан с Command pattern
 * - Используется в Template Method
 */
