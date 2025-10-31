/**
 * STATE PATTERN (Паттерн Состояние)
 * 
 * Назначение: Позволяет объекту изменять свое поведение в зависимости от внутреннего состояния.
 * Паттерн создает впечатление, что объект изменил свой класс.
 * 
 * Когда использовать:
 * - Когда объект должен изменять свое поведение в зависимости от состояния
 * - Когда код содержит множество условных операторов, зависящих от состояния объекта
 * - Когда состояния объекта и их переходы сложны
 * - Когда нужно избежать дублирования кода для различных состояний
 * - Когда нужно обеспечить легкое добавление новых состояний
 * 
 * Примеры использования:
 * - Управление жизненным циклом объектов
 * - Автоматы состояний
 * - Игровые персонажи
 * - Документы (черновик, на рассмотрении, одобрен)
 * - Заказы (создан, оплачен, отправлен)
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Абстрактный класс состояния
 * Определяет интерфейс для всех состояний
 */
class State {
    /**
     * Метод для обработки запроса в текущем состоянии
     * @param {Context} context - Контекст
     */
    handle(context) {
        throw new Error("Метод handle должен быть переопределен");
    }
    
    /**
     * Возвращает название состояния
     * @returns {string}
     */
    getName() {
        return this.constructor.name;
    }
}

/**
 * Контекст
 * Хранит ссылку на текущее состояние и делегирует ему выполнение
 */
class Context {
    constructor() {
        this.state = null;
        this.stateHistory = [];
    }
    
    /**
     * Устанавливает новое состояние
     * @param {State} state - Новое состояние
     */
    setState(state) {
        const oldState = this.state ? this.state.getName() : 'None';
        this.state = state;
        
        // Записываем переход в историю
        this.stateHistory.push({
            from: oldState,
            to: state.getName(),
            timestamp: new Date().toISOString()
        });
        
        console.log(`[Context] Состояние изменено: ${oldState} → ${state.getName()}`);
    }
    
    /**
     * Обрабатывает запрос через текущее состояние
     */
    request() {
        if (this.state) {
            this.state.handle(this);
        } else {
            console.log('[Context] Состояние не установлено');
        }
    }
    
    /**
     * Возвращает текущее состояние
     * @returns {State}
     */
    getCurrentState() {
        return this.state;
    }
    
    /**
     * Возвращает историю переходов состояний
     * @returns {Array}
     */
    getStateHistory() {
        return [...this.stateHistory];
    }
    
    /**
     * Возвращает количество переходов
     * @returns {number}
     */
    getTransitionCount() {
        return this.stateHistory.length;
    }
}

// ===== КОНКРЕТНЫЕ СОСТОЯНИЯ =====

/**
 * Состояние A
 */
class ConcreteStateA extends State {
    handle(context) {
        console.log(`[${this.getName()}] Обрабатываем запрос в состоянии A`);
        
        // Можем изменить состояние контекста
        // context.setState(new ConcreteStateB());
        
        console.log(`[${this.getName()}] Запрос обработан в состоянии A`);
    }
}

/**
 * Состояние B
 */
class ConcreteStateB extends State {
    handle(context) {
        console.log(`[${this.getName()}] Обрабатываем запрос в состоянии B`);
        
        // Можем изменить состояние контекста
        // context.setState(new ConcreteStateC());
        
        console.log(`[${this.getName()}] Запрос обработан в состоянии B`);
    }
}

/**
 * Состояние C
 */
class ConcreteStateC extends State {
    handle(context) {
        console.log(`[${this.getName()}] Обрабатываем запрос в состоянии C`);
        
        // Можем изменить состояние контекста
        // context.setState(new ConcreteStateA());
        
        console.log(`[${this.getName()}] Запрос обработан в состоянии C`);
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР STATE ===");

// Создаем контекст
const context = new Context();

// Создаем состояния
const stateA = new ConcreteStateA();
const stateB = new ConcreteStateB();
const stateC = new ConcreteStateC();

// Устанавливаем начальное состояние
context.setState(stateA);

// Обрабатываем запросы в разных состояниях
context.request();

context.setState(stateB);
context.request();

context.setState(stateC);
context.request();

// Возвращаемся к первому состоянию
context.setState(stateA);
context.request();

// Показываем историю переходов
console.log('\nИстория переходов состояний:');
context.getStateHistory().forEach(transition => {
    console.log(`${transition.timestamp}: ${transition.from} → ${transition.to}`);
});

console.log(`Всего переходов: ${context.getTransitionCount()}`);

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ЗАКАЗ В ИНТЕРНЕТ-МАГАЗИНЕ =====

/**
 * Абстрактный класс состояния заказа
 */
class OrderState {
    /**
     * Обрабатывает заказ в текущем состоянии
     * @param {Order} order - Заказ
     */
    process(order) {
        throw new Error("Метод process должен быть переопределен");
    }
    
    /**
     * Отменяет заказ в текущем состоянии
     * @param {Order} order - Заказ
     */
    cancel(order) {
        throw new Error("Метод cancel должен быть переопределен");
    }
    
    /**
     * Возвращает заказ в текущем состоянии
     * @param {Order} order - Заказ
     */
    return(order) {
        throw new Error("Метод return должен быть переопределен");
    }
    
    /**
     * Возвращает название состояния
     * @returns {string}
     */
    getName() {
        return this.constructor.name;
    }
    
    /**
     * Возвращает описание состояния
     * @returns {string}
     */
    getDescription() {
        return this.constructor.name;
    }
}

/**
 * Состояние "Создан"
 */
class CreatedState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Обрабатываем заказ ${order.id}`);
        
        // Проверяем доступность товаров
        if (order.checkAvailability()) {
            console.log(`[${this.getName()}] Товары доступны, переводим в состояние "Подтвержден"`);
            order.setState(new ConfirmedState());
        } else {
            console.log(`[${this.getName()}] Товары недоступны, переводим в состояние "Отменен"`);
            order.setState(new CancelledState());
        }
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отменяем заказ ${order.id}`);
        order.setState(new CancelledState());
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возврат невозможен для заказа в состоянии "Создан"`);
    }
    
    getDescription() {
        return 'Заказ создан, ожидает подтверждения';
    }
}

/**
 * Состояние "Подтвержден"
 */
class ConfirmedState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Обрабатываем заказ ${order.id}`);
        
        // Проверяем оплату
        if (order.checkPayment()) {
            console.log(`[${this.getName()}] Оплата подтверждена, переводим в состояние "Оплачен"`);
            order.setState(new PaidState());
        } else {
            console.log(`[${this.getName()}] Оплата не подтверждена, ожидаем`);
        }
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отменяем заказ ${order.id}`);
        order.setState(new CancelledState());
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возврат невозможен для заказа в состоянии "Подтвержден"`);
    }
    
    getDescription() {
        return 'Заказ подтвержден, ожидает оплаты';
    }
}

/**
 * Состояние "Оплачен"
 */
class PaidState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Обрабатываем заказ ${order.id}`);
        
        // Готовим к отправке
        if (order.prepareForShipping()) {
            console.log(`[${this.getName()}] Заказ подготовлен к отправке, переводим в состояние "Отправлен"`);
            order.setState(new ShippedState());
        } else {
            console.log(`[${this.getName()}] Ошибка подготовки к отправке`);
        }
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отменяем заказ ${order.id} с возвратом средств`);
        order.refundPayment();
        order.setState(new CancelledState());
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возврат невозможен для заказа в состоянии "Оплачен"`);
    }
    
    getDescription() {
        return 'Заказ оплачен, готовится к отправке';
    }
}

/**
 * Состояние "Отправлен"
 */
class ShippedState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Обрабатываем заказ ${order.id}`);
        
        // Проверяем доставку
        if (order.checkDelivery()) {
            console.log(`[${this.getName()}] Заказ доставлен, переводим в состояние "Доставлен"`);
            order.setState(new DeliveredState());
        } else {
            console.log(`[${this.getName()}] Заказ в пути`);
        }
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отмена невозможна для отправленного заказа`);
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возврат невозможен для заказа в состоянии "Отправлен"`);
    }
    
    getDescription() {
        return 'Заказ отправлен, в пути';
    }
}

/**
 * Состояние "Доставлен"
 */
class DeliveredState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Заказ ${order.id} уже доставлен`);
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отмена невозможна для доставленного заказа`);
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возвращаем заказ ${order.id}`);
        order.setState(new ReturnedState());
    }
    
    getDescription() {
        return 'Заказ доставлен';
    }
}

/**
 * Состояние "Возвращен"
 */
class ReturnedState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Обрабатываем возврат заказа ${order.id}`);
        
        // Возвращаем средства
        order.refundPayment();
        console.log(`[${this.getName()}] Средства возвращены`);
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Отмена невозможна для возвращенного заказа`);
    }
    
    return(order) {
        console.log(`[${this.getName()}] Заказ уже возвращен`);
    }
    
    getDescription() {
        return 'Заказ возвращен';
    }
}

/**
 * Состояние "Отменен"
 */
class CancelledState extends OrderState {
    process(order) {
        console.log(`[${this.getName()}] Заказ ${order.id} отменен, обработка невозможна`);
    }
    
    cancel(order) {
        console.log(`[${this.getName()}] Заказ ${order.id} уже отменен`);
    }
    
    return(order) {
        console.log(`[${this.getName()}] Возврат невозможен для отмененного заказа`);
    }
    
    getDescription() {
        return 'Заказ отменен';
    }
}

/**
 * Класс заказа
 */
class Order {
    constructor(id, items = []) {
        this.id = id;
        this.items = items;
        this.state = new CreatedState();
        this.paymentStatus = 'pending';
        this.shippingStatus = 'not_shipped';
        this.deliveryStatus = 'not_delivered';
        this.stateHistory = [];
        this.createdAt = new Date();
    }
    
    /**
     * Устанавливает новое состояние
     * @param {OrderState} newState - Новое состояние
     */
    setState(newState) {
        const oldState = this.state.getName();
        this.state = newState;
        
        // Записываем переход в историю
        this.stateHistory.push({
            from: oldState,
            to: newState.getName(),
            timestamp: new Date().toISOString()
        });
        
        console.log(`[Order] Состояние заказа ${this.id} изменено: ${oldState} → ${newState.getName()}`);
    }
    
    /**
     * Обрабатывает заказ
     */
    process() {
        this.state.process(this);
    }
    
    /**
     * Отменяет заказ
     */
    cancel() {
        this.state.cancel(this);
    }
    
    /**
     * Возвращает заказ
     */
    return() {
        this.state.return(this);
    }
    
    /**
     * Проверяет доступность товаров
     * @returns {boolean}
     */
    checkAvailability() {
        // Имитация проверки доступности
        const available = Math.random() > 0.2;
        console.log(`[Order] Проверка доступности товаров: ${available ? 'доступны' : 'недоступны'}`);
        return available;
    }
    
    /**
     * Проверяет статус оплаты
     * @returns {boolean}
     */
    checkPayment() {
        // Имитация проверки оплаты
        const paid = Math.random() > 0.3;
        if (paid) {
            this.paymentStatus = 'paid';
        }
        console.log(`[Order] Проверка оплаты: ${paid ? 'оплачен' : 'не оплачен'}`);
        return paid;
    }
    
    /**
     * Готовит заказ к отправке
     * @returns {boolean}
     */
    prepareForShipping() {
        // Имитация подготовки к отправке
        const prepared = Math.random() > 0.1;
        if (prepared) {
            this.shippingStatus = 'ready';
        }
        console.log(`[Order] Подготовка к отправке: ${prepared ? 'готов' : 'ошибка'}`);
        return prepared;
    }
    
    /**
     * Проверяет статус доставки
     * @returns {boolean}
     */
    checkDelivery() {
        // Имитация проверки доставки
        const delivered = Math.random() > 0.4;
        if (delivered) {
            this.deliveryStatus = 'delivered';
        }
        console.log(`[Order] Проверка доставки: ${delivered ? 'доставлен' : 'в пути'}`);
        return delivered;
    }
    
    /**
     * Возвращает средства
     */
    refundPayment() {
        this.paymentStatus = 'refunded';
        console.log(`[Order] Средства возвращены для заказа ${this.id}`);
    }
    
    /**
     * Возвращает текущее состояние
     * @returns {OrderState}
     */
    getCurrentState() {
        return this.state;
    }
    
    /**
     * Возвращает описание текущего состояния
     * @returns {string}
     */
    getStateDescription() {
        return this.state.getDescription();
    }
    
    /**
     * Возвращает историю переходов состояний
     * @returns {Array}
     */
    getStateHistory() {
        return [...this.stateHistory];
    }
    
    /**
     * Возвращает информацию о заказе
     * @returns {Object}
     */
    getInfo() {
        return {
            id: this.id,
            state: this.state.getName(),
            stateDescription: this.getStateDescription(),
            paymentStatus: this.paymentStatus,
            shippingStatus: this.shippingStatus,
            deliveryStatus: this.deliveryStatus,
            items: this.items,
            createdAt: this.createdAt,
            stateHistory: this.getStateHistory()
        };
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ЗАКАЗ В ИНТЕРНЕТ-МАГАЗИНЕ ===");

// Создаем заказ
const order = new Order('ORD-001', ['Ноутбук', 'Мышь', 'Клавиатура']);

console.log('Начальное состояние:', order.getStateDescription());

// Обрабатываем заказ пошагово
console.log('\n--- Шаг 1: Обработка созданного заказа ---');
order.process();
console.log('Текущее состояние:', order.getStateDescription());

console.log('\n--- Шаг 2: Обработка подтвержденного заказа ---');
order.process();
console.log('Текущее состояние:', order.getStateDescription());

console.log('\n--- Шаг 3: Обработка оплаченного заказа ---');
order.process();
console.log('Текущее состояние:', order.getStateDescription());

console.log('\n--- Шаг 4: Обработка отправленного заказа ---');
order.process();
console.log('Текущее состояние:', order.getStateDescription());

// Пытаемся отменить доставленный заказ
console.log('\n--- Попытка отмены доставленного заказа ---');
order.cancel();

// Возвращаем доставленный заказ
console.log('\n--- Возврат доставленного заказа ---');
order.return();
console.log('Текущее состояние:', order.getStateDescription());

// Показываем информацию о заказе
console.log('\n--- Информация о заказе ---');
console.log(order.getInfo());

// ===== ПРИМЕР С АВТОМАТОМ СОСТОЯНИЙ =====

/**
 * Абстрактный класс состояния автомата
 */
class AutomatonState {
    /**
     * Обрабатывает входной символ
     * @param {string} input - Входной символ
     * @param {Automaton} automaton - Автомат
     * @returns {boolean} Результат обработки
     */
    process(input, automaton) {
        throw new Error("Метод process должен быть переопределен");
    }
    
    /**
     * Возвращает название состояния
     * @returns {string}
     */
    getName() {
        return this.constructor.name;
    }
    
    /**
     * Проверяет, является ли состояние конечным
     * @returns {boolean}
     */
    isFinal() {
        return false;
    }
}

/**
 * Начальное состояние автомата
 */
class InitialState extends AutomatonState {
    process(input, automaton) {
        console.log(`[${this.getName()}] Обрабатываем символ: ${input}`);
        
        if (input === 'a') {
            console.log(`[${this.getName()}] Переходим в состояние A`);
            automaton.setState(new StateA());
            return true;
        } else if (input === 'b') {
            console.log(`[${this.getName()}] Переходим в состояние B`);
            automaton.setState(new StateB());
            return true;
        } else {
            console.log(`[${this.getName()}] Неверный символ: ${input}`);
            return false;
        }
    }
}

/**
 * Состояние A автомата
 */
class StateA extends AutomatonState {
    process(input, automaton) {
        console.log(`[${this.getName()}] Обрабатываем символ: ${input}`);
        
        if (input === 'a') {
            console.log(`[${this.getName()}] Остаемся в состоянии A`);
            return true;
        } else if (input === 'b') {
            console.log(`[${this.getName()}] Переходим в состояние B`);
            automaton.setState(new StateB());
            return true;
        } else if (input === 'c') {
            console.log(`[${this.getName()}] Переходим в конечное состояние C`);
            automaton.setState(new FinalStateC());
            return true;
        } else {
            console.log(`[${this.getName()}] Неверный символ: ${input}`);
            return false;
        }
    }
}

/**
 * Состояние B автомата
 */
class StateB extends AutomatonState {
    process(input, automaton) {
        console.log(`[${this.getName()}] Обрабатываем символ: ${input}`);
        
        if (input === 'a') {
            console.log(`[${this.getName()}] Переходим в состояние A`);
            automaton.setState(new StateA());
            return true;
        } else if (input === 'b') {
            console.log(`[${this.getName()}] Остаемся в состоянии B`);
            return true;
        } else if (input === 'c') {
            console.log(`[${this.getName()}] Переходим в конечное состояние C`);
            automaton.setState(new FinalStateC());
            return true;
        } else {
            console.log(`[${this.getName()}] Неверный символ: ${input}`);
            return false;
        }
    }
}

/**
 * Конечное состояние C автомата
 */
class FinalStateC extends AutomatonState {
    process(input, automaton) {
        console.log(`[${this.getName()}] Обрабатываем символ: ${input}`);
        console.log(`[${this.getName()}] Достигнуто конечное состояние, дальнейшая обработка невозможна`);
        return false;
    }
    
    isFinal() {
        return true;
    }
}

/**
 * Автомат состояний
 */
class Automaton {
    constructor() {
        this.state = new InitialState();
        this.inputHistory = [];
        this.stateHistory = [];
    }
    
    /**
     * Устанавливает новое состояние
     * @param {AutomatonState} newState - Новое состояние
     */
    setState(newState) {
        const oldState = this.state.getName();
        this.state = newState;
        
        // Записываем переход в историю
        this.stateHistory.push({
            from: oldState,
            to: newState.getName(),
            timestamp: new Date().toISOString()
        });
        
        console.log(`[Automaton] Состояние изменено: ${oldState} → ${newState.getName()}`);
    }
    
    /**
     * Обрабатывает входную строку
     * @param {string} input - Входная строка
     * @returns {boolean} Результат обработки
     */
    processInput(input) {
        console.log(`[Automaton] Обрабатываем входную строку: "${input}"`);
        
        this.inputHistory = [];
        this.stateHistory = [];
        
        // Устанавливаем начальное состояние
        this.setState(new InitialState());
        
        for (let i = 0; i < input.length; i++) {
            const symbol = input[i];
            this.inputHistory.push(symbol);
            
            console.log(`\n[Automaton] Обрабатываем символ ${i + 1}/${input.length}: "${symbol}"`);
            
            if (!this.state.process(symbol, this)) {
                console.log(`[Automaton] Ошибка обработки символа "${symbol}"`);
                return false;
            }
            
            if (this.state.isFinal()) {
                console.log(`[Automaton] Достигнуто конечное состояние`);
                break;
            }
        }
        
        const isValid = this.state.isFinal();
        console.log(`[Automaton] Результат обработки: ${isValid ? 'принято' : 'отклонено'}`);
        
        return isValid;
    }
    
    /**
     * Возвращает текущее состояние
     * @returns {AutomatonState}
     */
    getCurrentState() {
        return this.state;
    }
    
    /**
     * Возвращает историю входных символов
     * @returns {Array}
     */
    getInputHistory() {
        return [...this.inputHistory];
    }
    
    /**
     * Возвращает историю переходов состояний
     * @returns {Array}
     */
    getStateHistory() {
        return [...this.stateHistory];
    }
    
    /**
     * Возвращает информацию об автомате
     * @returns {Object}
     */
    getInfo() {
        return {
            currentState: this.state.getName(),
            isFinal: this.state.isFinal(),
            inputHistory: this.getInputHistory(),
            stateHistory: this.getStateHistory()
        };
    }
}

console.log("\n=== ПРИМЕР С АВТОМАТОМ СОСТОЯНИЙ ===");

// Создаем автомат
const automaton = new Automaton();

// Тестируем различные входные строки
const testInputs = ['abc', 'aabc', 'bbac', 'cab', 'abab'];

testInputs.forEach(input => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`Тестируем входную строку: "${input}"`);
    console.log(`${'='.repeat(50)}`);
    
    const result = automaton.processInput(input);
    console.log(`\nРезультат: ${result ? 'ПРИНЯТО' : 'ОТКЛОНЕНО'}`);
    
    console.log('\nИнформация об автомате:');
    console.log(automaton.getInfo());
});

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Избегает множественных условных операторов
 * - Упрощает добавление новых состояний
 * - Инкапсулирует поведение состояний
 * - Упрощает тестирование
 * - Поддерживает принцип единственной ответственности
 * - Обеспечивает легкое изменение поведения объекта
 * 
 * НЕДОСТАТКИ:
 * - Может привести к созданию множества классов состояний
 * - Усложняет архитектуру для простых случаев
 * - Может создать проблемы с производительностью
 * - Сложно отследить переходы между состояниями
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Strategy pattern
 * - Может быть частью Command pattern
 * - Связан с Observer pattern
 * - Используется в Template Method
 */
