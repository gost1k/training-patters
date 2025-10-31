/**
 * TEMPLATE METHOD PATTERN (Паттерн Шаблонный метод)
 * 
 * Назначение: Определяет скелет алгоритма, откладывая некоторые шаги на подклассы.
 * Template Method позволяет подклассам переопределять определенные шаги алгоритма,
 * не изменяя его структуру.
 * 
 * Когда использовать:
 * - Когда нужно определить алгоритм, но позволить подклассам переопределять шаги
 * - Когда есть несколько классов с похожими алгоритмами
 - Когда нужно избежать дублирования кода
 * - Когда нужно контролировать расширения подклассов
 * - Когда нужно обеспечить единую точку входа для алгоритма
 * 
 * Примеры использования:
 * - Обработка документов
 * - Сборка объектов
 * - Алгоритмы сортировки
 * - Обработка запросов
 * - Валидация данных
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Абстрактный класс с шаблонным методом
 * Определяет скелет алгоритма
 */
class AbstractClass {
    /**
     * Шаблонный метод - определяет скелет алгоритма
     * Этот метод не может быть переопределен в подклассах
     */
    templateMethod() {
        console.log('[AbstractClass] Начинаем выполнение шаблонного метода');
        
        // Выполняем шаги в определенном порядке
        this.step1();
        this.step2();
        this.step3();
        this.hook(); // Опциональный крючок
        
        console.log('[AbstractClass] Шаблонный метод завершен');
    }
    
    /**
     * Шаг 1 - должен быть реализован в подклассе
     */
    step1() {
        throw new Error("Метод step1 должен быть переопределен");
    }
    
    /**
     * Шаг 2 - должен быть реализован в подклассе
     */
    step2() {
        throw new Error("Метод step2 должен быть переопределен");
    }
    
    /**
     * Шаг 3 - может иметь реализацию по умолчанию
     */
    step3() {
        console.log('[AbstractClass] Выполняем шаг 3 (по умолчанию)');
    }
    
    /**
     * Крючок - опциональный метод, который может быть переопределен
     * По умолчанию ничего не делает
     */
    hook() {
        // Пустая реализация - подклассы могут переопределить
    }
    
    /**
     * Финальный метод - не может быть переопределен
     */
    finalMethod() {
        console.log('[AbstractClass] Финальный метод выполнен');
    }
}

/**
 * Конкретный класс A
 * Реализует абстрактные методы
 */
class ConcreteClassA extends AbstractClass {
    step1() {
        console.log('[ConcreteClassA] Выполняем шаг 1');
    }
    
    step2() {
        console.log('[ConcreteClassA] Выполняем шаг 2');
    }
    
    step3() {
        console.log('[ConcreteClassA] Переопределяем шаг 3');
    }
    
    hook() {
        console.log('[ConcreteClassA] Выполняем крючок');
    }
}

/**
 * Конкретный класс B
 * Реализует абстрактные методы по-другому
 */
class ConcreteClassB extends AbstractClass {
    step1() {
        console.log('[ConcreteClassB] Выполняем шаг 1 по-другому');
    }
    
    step2() {
        console.log('[ConcreteClassB] Выполняем шаг 2 по-другому');
    }
    
    // step3 использует реализацию по умолчанию
    // hook не переопределяется
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР TEMPLATE METHOD ===");

// Создаем экземпляры классов
const concreteA = new ConcreteClassA();
const concreteB = new ConcreteClassB();

// Выполняем шаблонный метод
console.log('\n--- ConcreteClassA ---');
concreteA.templateMethod();

console.log('\n--- ConcreteClassB ---');
concreteB.templateMethod();

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ОБРАБОТКА ДОКУМЕНТОВ =====

/**
 * Абстрактный класс для обработки документов
 */
class DocumentProcessor {
    /**
     * Шаблонный метод для обработки документа
     * @param {Object} document - Документ для обработки
     * @returns {Object} Обработанный документ
     */
    processDocument(document) {
        console.log(`[DocumentProcessor] Начинаем обработку документа: ${document.name}`);
        
        try {
            // Шаг 1: Валидация
            this.validateDocument(document);
            
            // Шаг 2: Обработка
            const processedDoc = this.processContent(document);
            
            // Шаг 3: Форматирование
            const formattedDoc = this.formatDocument(processedDoc);
            
            // Шаг 4: Сохранение
            this.saveDocument(formattedDoc);
            
            // Крючок для дополнительных действий
            this.postProcessHook(formattedDoc);
            
            console.log(`[DocumentProcessor] Документ ${document.name} успешно обработан`);
            return formattedDoc;
            
        } catch (error) {
            console.error(`[DocumentProcessor] Ошибка обработки документа: ${error.message}`);
            this.handleError(error, document);
            throw error;
        }
    }
    
    /**
     * Валидация документа - абстрактный метод
     * @param {Object} document - Документ для валидации
     */
    validateDocument(document) {
        throw new Error("Метод validateDocument должен быть переопределен");
    }
    
    /**
     * Обработка содержимого - абстрактный метод
     * @param {Object} document - Документ для обработки
     * @returns {Object} Обработанный документ
     */
    processContent(document) {
        throw new Error("Метод processContent должен быть переопределен");
    }
    
    /**
     * Форматирование документа - может иметь реализацию по умолчанию
     * @param {Object} document - Документ для форматирования
     * @returns {Object} Отформатированный документ
     */
    formatDocument(document) {
        console.log(`[DocumentProcessor] Форматируем документ: ${document.name}`);
        
        return {
            ...document,
            formatted: true,
            formattedAt: new Date().toISOString()
        };
    }
    
    /**
     * Сохранение документа - абстрактный метод
     * @param {Object} document - Документ для сохранения
     */
    saveDocument(document) {
        throw new Error("Метод saveDocument должен быть переопределен");
    }
    
    /**
     * Крючок для дополнительной обработки - может быть переопределен
     * @param {Object} document - Обработанный документ
     */
    postProcessHook(document) {
        // По умолчанию ничего не делает
    }
    
    /**
     * Обработка ошибок - может быть переопределен
     * @param {Error} error - Ошибка
     * @param {Object} document - Документ, вызвавший ошибку
     */
    handleError(error, document) {
        console.error(`[DocumentProcessor] Ошибка при обработке документа ${document.name}:`, error.message);
    }
    
    /**
     * Финальный метод - не может быть переопределен
     * @param {Object} document - Документ
     */
    finalizeDocument(document) {
        console.log(`[DocumentProcessor] Документ ${document.name} финализирован`);
        return { ...document, finalized: true };
    }
}

/**
 * Обработчик текстовых документов
 */
class TextDocumentProcessor extends DocumentProcessor {
    validateDocument(document) {
        console.log(`[TextDocumentProcessor] Валидируем текстовый документ: ${document.name}`);
        
        if (!document.content || document.content.trim().length === 0) {
            throw new Error('Документ не содержит текста');
        }
        
        if (document.content.length > 10000) {
            throw new Error('Документ слишком длинный');
        }
        
        console.log('[TextDocumentProcessor] Валидация пройдена');
    }
    
    processContent(document) {
        console.log(`[TextDocumentProcessor] Обрабатываем содержимое: ${document.name}`);
        
        // Убираем лишние пробелы
        const cleanedContent = document.content.replace(/\s+/g, ' ').trim();
        
        // Подсчитываем статистику
        const words = cleanedContent.split(' ').length;
        const characters = cleanedContent.length;
        
        return {
            ...document,
            content: cleanedContent,
            stats: { words, characters },
            processed: true
        };
    }
    
    saveDocument(document) {
        console.log(`[TextDocumentProcessor] Сохраняем текстовый документ: ${document.name}`);
        
        // Имитация сохранения в файл
        const savedPath = `/documents/text/${document.name}.txt`;
        document.savedPath = savedPath;
        document.savedAt = new Date().toISOString();
        
        console.log(`[TextDocumentProcessor] Документ сохранен в: ${savedPath}`);
    }
    
    postProcessHook(document) {
        console.log(`[TextDocumentProcessor] Дополнительная обработка: ${document.name}`);
        
        // Создаем резюме документа
        const summary = document.content.substring(0, 100) + '...';
        document.summary = summary;
        
        console.log(`[TextDocumentProcessor] Создано резюме: ${summary}`);
    }
}

/**
 * Обработчик HTML документов
 */
class HTMLDocumentProcessor extends DocumentProcessor {
    validateDocument(document) {
        console.log(`[HTMLDocumentProcessor] Валидируем HTML документ: ${document.name}`);
        
        if (!document.content || !document.content.includes('<html>')) {
            throw new Error('Документ не является валидным HTML');
        }
        
        if (!document.content.includes('<title>')) {
            throw new Error('HTML документ должен содержать заголовок');
        }
        
        console.log('[HTMLDocumentProcessor] Валидация пройдена');
    }
    
    processContent(document) {
        console.log(`[HTMLDocumentProcessor] Обрабатываем HTML содержимое: ${document.name}`);
        
        // Извлекаем заголовок
        const titleMatch = document.content.match(/<title>(.*?)<\/title>/i);
        const title = titleMatch ? titleMatch[1] : 'Без заголовка';
        
        // Подсчитываем теги
        const tagCount = (document.content.match(/<[^>]+>/g) || []).length;
        
        // Очищаем HTML от лишних пробелов
        const cleanedContent = document.content.replace(/>\s+</g, '><');
        
        return {
            ...document,
            content: cleanedContent,
            title: title,
            stats: { tagCount, title },
            processed: true
        };
    }
    
    saveDocument(document) {
        console.log(`[HTMLDocumentProcessor] Сохраняем HTML документ: ${document.name}`);
        
        // Имитация сохранения в файл
        const savedPath = `/documents/html/${document.name}.html`;
        document.savedPath = savedPath;
        document.savedAt = new Date().toISOString();
        
        console.log(`[HTMLDocumentProcessor] Документ сохранен в: ${savedPath}`);
    }
    
    postProcessHook(document) {
        console.log(`[HTMLDocumentProcessor] Дополнительная обработка: ${document.name}`);
        
        // Создаем минифицированную версию
        const minified = document.content.replace(/\s+/g, ' ').trim();
        document.minified = minified;
        
        console.log(`[HTMLDocumentProcessor] Создана минифицированная версия`);
    }
}

/**
 * Обработчик JSON документов
 */
class JSONDocumentProcessor extends DocumentProcessor {
    validateDocument(document) {
        console.log(`[JSONDocumentProcessor] Валидируем JSON документ: ${document.name}`);
        
        try {
            JSON.parse(document.content);
            console.log('[JSONDocumentProcessor] Валидация пройдена');
        } catch (error) {
            throw new Error('Документ не является валидным JSON');
        }
    }
    
    processContent(document) {
        console.log(`[JSONDocumentProcessor] Обрабатываем JSON содержимое: ${document.name}`);
        
        const parsed = JSON.parse(document.content);
        
        // Анализируем структуру
        const keys = Object.keys(parsed);
        const depth = this.calculateDepth(parsed);
        
        return {
            ...document,
            parsed: parsed,
            stats: { keys: keys.length, depth, structure: keys },
            processed: true
        };
    }
    
    saveDocument(document) {
        console.log(`[JSONDocumentProcessor] Сохраняем JSON документ: ${document.name}`);
        
        // Имитация сохранения в файл
        const savedPath = `/documents/json/${document.name}.json`;
        document.savedPath = savedPath;
        document.savedAt = new Date().toISOString();
        
        console.log(`[JSONDocumentProcessor] Документ сохранен в: ${savedPath}`);
    }
    
    /**
     * Вычисляет глубину JSON объекта
     * @param {Object} obj - JSON объект
     * @returns {number} Глубина
     */
    calculateDepth(obj, currentDepth = 1) {
        if (typeof obj !== 'object' || obj === null) {
            return currentDepth;
        }
        
        let maxDepth = currentDepth;
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                const depth = this.calculateDepth(obj[key], currentDepth + 1);
                maxDepth = Math.max(maxDepth, depth);
            }
        }
        
        return maxDepth;
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ОБРАБОТКА ДОКУМЕНТОВ ===");

// Создаем обработчики документов
const textProcessor = new TextDocumentProcessor();
const htmlProcessor = new HTMLDocumentProcessor();
const jsonProcessor = new JSONDocumentProcessor();

// Тестовые документы
const textDocument = {
    name: 'sample.txt',
    content: 'Это   пример   текстового   документа   с   лишними   пробелами.'
};

const htmlDocument = {
    name: 'sample.html',
    content: '<html><head><title>Пример HTML</title></head><body><h1>Заголовок</h1><p>Параграф</p></body></html>'
};

const jsonDocument = {
    name: 'sample.json',
    content: '{"name": "John", "age": 30, "address": {"city": "New York", "country": "USA"}}'
};

// Обрабатываем документы
try {
    console.log('\n--- Обработка текстового документа ---');
    const processedText = textProcessor.processDocument(textDocument);
    console.log('Результат:', processedText);
    
    console.log('\n--- Обработка HTML документа ---');
    const processedHTML = htmlProcessor.processDocument(htmlDocument);
    console.log('Результат:', processedHTML);
    
    console.log('\n--- Обработка JSON документа ---');
    const processedJSON = jsonProcessor.processDocument(jsonDocument);
    console.log('Результат:', processedJSON);
    
} catch (error) {
    console.error('Ошибка:', error.message);
}

// ===== ПРИМЕР С АЛГОРИТМАМИ СОРТИРОВКИ =====

/**
 * Абстрактный класс для алгоритмов сортировки
 */
class SortAlgorithm {
    /**
     * Шаблонный метод для сортировки
     * @param {Array} array - Массив для сортировки
     * @returns {Array} Отсортированный массив
     */
    sort(array) {
        console.log(`[SortAlgorithm] Начинаем сортировку массива из ${array.length} элементов`);
        
        // Шаг 1: Валидация
        this.validateArray(array);
        
        // Шаг 2: Предварительная обработка
        const processedArray = this.preprocess(array);
        
        // Шаг 3: Сортировка (абстрактный метод)
        const sortedArray = this.performSort(processedArray);
        
        // Шаг 4: Постобработка
        const result = this.postprocess(sortedArray);
        
        // Крючок для логирования
        this.logSortingResult(array, result);
        
        console.log(`[SortAlgorithm] Сортировка завершена`);
        return result;
    }
    
    /**
     * Валидация массива - может быть переопределен
     * @param {Array} array - Массив для валидации
     */
    validateArray(array) {
        if (!Array.isArray(array)) {
            throw new Error('Входные данные должны быть массивом');
        }
        
        if (array.length === 0) {
            throw new Error('Массив не может быть пустым');
        }
        
        console.log('[SortAlgorithm] Валидация массива пройдена');
    }
    
    /**
     * Предварительная обработка - может быть переопределен
     * @param {Array} array - Массив для обработки
     * @returns {Array} Обработанный массив
     */
    preprocess(array) {
        console.log('[SortAlgorithm] Предварительная обработка');
        return [...array]; // Копируем массив по умолчанию
    }
    
    /**
     * Выполнение сортировки - абстрактный метод
     * @param {Array} array - Массив для сортировки
     * @returns {Array} Отсортированный массив
     */
    performSort(array) {
        throw new Error("Метод performSort должен быть переопределен");
    }
    
    /**
     * Постобработка - может быть переопределен
     * @param {Array} array - Отсортированный массив
     * @returns {Array} Финальный результат
     */
    postprocess(array) {
        console.log('[SortAlgorithm] Постобработка');
        return array;
    }
    
    /**
     * Логирование результата - может быть переопределен
     * @param {Array} original - Исходный массив
     * @param {Array} sorted - Отсортированный массив
     */
    logSortingResult(original, sorted) {
        console.log(`[SortAlgorithm] Исходный массив: [${original.join(', ')}]`);
        console.log(`[SortAlgorithm] Отсортированный массив: [${sorted.join(', ')}]`);
    }
}

/**
 * Алгоритм сортировки пузырьком
 */
class BubbleSort extends SortAlgorithm {
    performSort(array) {
        console.log('[BubbleSort] Выполняем сортировку пузырьком');
        
        const arr = [...array];
        const n = arr.length;
        
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Меняем местами
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
        
        return arr;
    }
    
    logSortingResult(original, sorted) {
        super.logSortingResult(original, sorted);
        console.log('[BubbleSort] Использован алгоритм сортировки пузырьком');
    }
}

/**
 * Алгоритм быстрой сортировки
 */
class QuickSort extends SortAlgorithm {
    performSort(array) {
        console.log('[QuickSort] Выполняем быструю сортировку');
        
        if (array.length <= 1) {
            return array;
        }
        
        const pivot = array[Math.floor(array.length / 2)];
        const left = array.filter(x => x < pivot);
        const middle = array.filter(x => x === pivot);
        const right = array.filter(x => x > pivot);
        
        return [...this.performSort(left), ...middle, ...this.performSort(right)];
    }
    
    preprocess(array) {
        console.log('[QuickSort] Предварительная обработка для быстрой сортировки');
        return array.filter(x => typeof x === 'number'); // Фильтруем только числа
    }
    
    logSortingResult(original, sorted) {
        super.logSortingResult(original, sorted);
        console.log('[QuickSort] Использован алгоритм быстрой сортировки');
    }
}

/**
 * Алгоритм сортировки слиянием
 */
class MergeSort extends SortAlgorithm {
    performSort(array) {
        console.log('[MergeSort] Выполняем сортировку слиянием');
        
        if (array.length <= 1) {
            return array;
        }
        
        const mid = Math.floor(array.length / 2);
        const left = this.performSort(array.slice(0, mid));
        const right = this.performSort(array.slice(mid));
        
        return this.merge(left, right);
    }
    
    /**
     * Слияние двух отсортированных массивов
     * @param {Array} left - Левый массив
     * @param {Array} right - Правый массив
     * @returns {Array} Объединенный массив
     */
    merge(left, right) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            if (left[i] <= right[j]) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        
        return result.concat(left.slice(i), right.slice(j));
    }
    
    postprocess(array) {
        console.log('[MergeSort] Постобработка для сортировки слиянием');
        return array.reverse(); // Инвертируем результат для демонстрации
    }
    
    logSortingResult(original, sorted) {
        super.logSortingResult(original, sorted);
        console.log('[MergeSort] Использован алгоритм сортировки слиянием');
    }
}

console.log("\n=== ПРИМЕР С АЛГОРИТМАМИ СОРТИРОВКИ ===");

// Создаем алгоритмы сортировки
const bubbleSort = new BubbleSort();
const quickSort = new QuickSort();
const mergeSort = new MergeSort();

// Тестовый массив
const testArray = [64, 34, 25, 12, 22, 11, 90];

// Тестируем различные алгоритмы
console.log('\n--- Сортировка пузырьком ---');
const bubbleResult = bubbleSort.sort(testArray);

console.log('\n--- Быстрая сортировка ---');
const quickResult = quickSort.sort(testArray);

console.log('\n--- Сортировка слиянием ---');
const mergeResult = mergeSort.sort(testArray);

// ===== ПРИМЕР С ВАЛИДАЦИЕЙ ДАННЫХ =====

/**
 * Абстрактный класс для валидации данных
 */
class DataValidator {
    /**
     * Шаблонный метод для валидации
     * @param {Object} data - Данные для валидации
     * @returns {Object} Результат валидации
     */
    validate(data) {
        console.log(`[DataValidator] Начинаем валидацию данных`);
        
        try {
            // Шаг 1: Предварительная проверка
            this.preValidate(data);
            
            // Шаг 2: Основная валидация
            const validationResult = this.performValidation(data);
            
            // Шаг 3: Поствалидация
            const finalResult = this.postValidate(validationResult);
            
            // Крючок для дополнительных проверок
            this.additionalValidation(data, finalResult);
            
            console.log(`[DataValidator] Валидация завершена успешно`);
            return finalResult;
            
        } catch (error) {
            console.error(`[DataValidator] Ошибка валидации: ${error.message}`);
            this.handleValidationError(error, data);
            throw error;
        }
    }
    
    /**
     * Предварительная валидация - может быть переопределен
     * @param {Object} data - Данные для валидации
     */
    preValidate(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('Данные должны быть объектом');
        }
        console.log('[DataValidator] Предварительная валидация пройдена');
    }
    
    /**
     * Основная валидация - абстрактный метод
     * @param {Object} data - Данные для валидации
     * @returns {Object} Результат валидации
     */
    performValidation(data) {
        throw new Error("Метод performValidation должен быть переопределен");
    }
    
    /**
     * Поствалидация - может быть переопределен
     * @param {Object} validationResult - Результат валидации
     * @returns {Object} Финальный результат
     */
    postValidate(validationResult) {
        console.log('[DataValidator] Поствалидация');
        return validationResult;
    }
    
    /**
     * Дополнительная валидация - крючок
     * @param {Object} data - Исходные данные
     * @param {Object} result - Результат валидации
     */
    additionalValidation(data, result) {
        // По умолчанию ничего не делает
    }
    
    /**
     * Обработка ошибок валидации - может быть переопределен
     * @param {Error} error - Ошибка
     * @param {Object} data - Данные, вызвавшие ошибку
     */
    handleValidationError(error, data) {
        console.error(`[DataValidator] Ошибка валидации для данных:`, data);
    }
}

/**
 * Валидатор пользовательских данных
 */
class UserDataValidator extends DataValidator {
    performValidation(data) {
        console.log('[UserDataValidator] Выполняем валидацию пользовательских данных');
        
        const errors = [];
        const warnings = [];
        
        // Проверяем обязательные поля
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Имя обязательно');
        } else if (data.name.length < 2) {
            errors.push('Имя должно содержать минимум 2 символа');
        }
        
        if (!data.email) {
            errors.push('Email обязателен');
        } else if (!this.isValidEmail(data.email)) {
            errors.push('Неверный формат email');
        }
        
        if (data.age !== undefined) {
            if (data.age < 0 || data.age > 150) {
                errors.push('Возраст должен быть от 0 до 150');
            } else if (data.age < 18) {
                warnings.push('Пользователь несовершеннолетний');
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date().toISOString()
        };
    }
    
    /**
     * Проверяет валидность email
     * @param {string} email - Email для проверки
     * @returns {boolean} Валидность
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    additionalValidation(data, result) {
        console.log('[UserDataValidator] Дополнительная валидация пользователя');
        
        // Проверяем сложность пароля, если он есть
        if (data.password) {
            if (data.password.length < 8) {
                result.warnings.push('Пароль должен содержать минимум 8 символов');
            }
        }
    }
}

/**
 * Валидатор данных продукта
 */
class ProductDataValidator extends DataValidator {
    performValidation(data) {
        console.log('[ProductDataValidator] Выполняем валидацию данных продукта');
        
        const errors = [];
        const warnings = [];
        
        // Проверяем обязательные поля
        if (!data.name || data.name.trim().length === 0) {
            errors.push('Название продукта обязательно');
        }
        
        if (data.price === undefined || data.price === null) {
            errors.push('Цена обязательна');
        } else if (data.price < 0) {
            errors.push('Цена не может быть отрицательной');
        } else if (data.price > 1000000) {
            warnings.push('Цена очень высокая');
        }
        
        if (data.category && !['electronics', 'clothing', 'books', 'food'].includes(data.category)) {
            warnings.push('Неизвестная категория продукта');
        }
        
        return {
            isValid: errors.length === 0,
            errors,
            warnings,
            validatedAt: new Date().toISOString()
        };
    }
    
    postValidate(validationResult) {
        console.log('[ProductDataValidator] Поствалидация продукта');
        
        // Добавляем информацию о типе валидации
        return {
            ...validationResult,
            validatorType: 'ProductDataValidator',
            version: '1.0'
        };
    }
}

console.log("\n=== ПРИМЕР С ВАЛИДАЦИЕЙ ДАННЫХ ===");

// Создаем валидаторы
const userValidator = new UserDataValidator();
const productValidator = new ProductDataValidator();

// Тестовые данные
const userData = {
    name: 'Иван',
    email: 'ivan@example.com',
    age: 25,
    password: 'weak'
};

const productData = {
    name: 'Ноутбук',
    price: 50000,
    category: 'electronics'
};

// Валидируем данные
try {
    console.log('\n--- Валидация пользовательских данных ---');
    const userValidation = userValidator.validate(userData);
    console.log('Результат валидации:', userValidation);
    
    console.log('\n--- Валидация данных продукта ---');
    const productValidation = productValidator.validate(productData);
    console.log('Результат валидации:', productValidation);
    
} catch (error) {
    console.error('Ошибка валидации:', error.message);
}

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Избегает дублирования кода
 * - Обеспечивает единую структуру алгоритма
 * - Позволяет легко добавлять новые варианты
 * - Контролирует расширения подклассов
 * - Упрощает поддержку кода
 * - Поддерживает принцип открытости/закрытости
 * 
 * НЕДОСТАТКИ:
 * - Может нарушить принцип инверсии зависимостей
 * - Может создать жесткую структуру
 * - Сложно изменить порядок шагов
 * - Может привести к наследованию от конкретных классов
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Factory Method
 * - Может быть частью Strategy pattern
 * - Связан с Command pattern
 * - Используется в Template Method
 */
