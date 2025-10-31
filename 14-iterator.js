/**
 * ITERATOR PATTERN (Паттерн Итератор)
 * 
 * Назначение: Предоставляет способ последовательного доступа к элементам
 * составного объекта, не раскрывая его внутреннего представления.
 * Паттерн позволяет обходить элементы коллекции без знания
 * деталей её реализации.
 * 
 * Когда использовать:
 * - Когда нужно предоставить единообразный интерфейс для обхода различных структур данных
 * - Когда нужно скрыть сложность внутренней структуры коллекции
 * - Когда нужно поддерживать множественные способы обхода одной коллекции
 * - Когда нужно обеспечить параллельный обход одной коллекции
 * - Когда нужно добавить новые способы обхода без изменения коллекции
 * 
 * Примеры использования:
 * - Обход элементов массива, списка, дерева
 * - Обход файловой системы
 * - Обход результатов базы данных
 * - Обход элементов UI
 * - Обход игровых объектов
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Интерфейс итератора
 * Определяет методы для обхода коллекции
 */
class Iterator {
    /**
     * Возвращает следующий элемент коллекции
     * @returns {*} Следующий элемент или undefined, если элементов больше нет
     */
    next() {
        throw new Error("Метод next должен быть переопределен");
    }
    
    /**
     * Проверяет, есть ли еще элементы в коллекции
     * @returns {boolean} true, если есть еще элементы, false в противном случае
     */
    hasNext() {
        throw new Error("Метод hasNext должен быть переопределен");
    }
    
    /**
     * Возвращает текущий элемент
     * @returns {*} Текущий элемент
     */
    current() {
        throw new Error("Метод current должен быть переопределен");
    }
    
    /**
     * Возвращает индекс текущего элемента
     * @returns {number} Индекс текущего элемента
     */
    currentIndex() {
        throw new Error("Метод currentIndex должен быть переопределен");
    }
    
    /**
     * Сбрасывает итератор в начальное состояние
     */
    reset() {
        throw new Error("Метод reset должен быть переопределен");
    }
    
    /**
     * Переходит к элементу по индексу
     * @param {number} index - Индекс элемента
     */
    goTo(index) {
        throw new Error("Метод goTo должен быть переопределен");
    }
    
    /**
     * Возвращает общее количество элементов
     * @returns {number} Количество элементов
     */
    count() {
        throw new Error("Метод count должен быть переопределен");
    }
}

/**
 * Интерфейс коллекции
 * Определяет методы для создания итераторов
 */
class Collection {
    /**
     * Создает итератор для коллекции
     * @returns {Iterator} Итератор
     */
    createIterator() {
        throw new Error("Метод createIterator должен быть переопределен");
    }
    
    /**
     * Создает обратный итератор для коллекции
     * @returns {Iterator} Обратный итератор
     */
    createReverseIterator() {
        throw new Error("Метод createReverseIterator должен быть переопределен");
    }
    
    /**
     * Возвращает количество элементов в коллекции
     * @returns {number} Количество элементов
     */
    size() {
        throw new Error("Метод size должен быть переопределен");
    }
    
    /**
     * Проверяет, пуста ли коллекция
     * @returns {boolean} true, если коллекция пуста, false в противном случае
     */
    isEmpty() {
        throw new Error("Метод isEmpty должен быть переопределен");
    }
    
    /**
     * Очищает коллекцию
     */
    clear() {
        throw new Error("Метод clear должен быть переопределен");
    }
}

/**
 * Конкретная коллекция - массив
 */
class ArrayCollection extends Collection {
    constructor(items = []) {
        super();
        this.items = [...items];
    }
    
    /**
     * Добавляет элемент в коллекцию
     * @param {*} item - Элемент для добавления
     */
    add(item) {
        this.items.push(item);
    }
    
    /**
     * Удаляет элемент из коллекции
     * @param {*} item - Элемент для удаления
     * @returns {boolean} true, если элемент был удален, false в противном случае
     */
    remove(item) {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Получает элемент по индексу
     * @param {number} index - Индекс элемента
     * @returns {*} Элемент по указанному индексу
     */
    get(index) {
        if (index >= 0 && index < this.items.length) {
            return this.items[index];
        }
        return undefined;
    }
    
    /**
     * Устанавливает элемент по индексу
     * @param {number} index - Индекс элемента
     * @param {*} item - Новый элемент
     */
    set(index, item) {
        if (index >= 0 && index < this.items.length) {
            this.items[index] = item;
        }
    }
    
    /**
     * Возвращает количество элементов в коллекции
     * @returns {number} Количество элементов
     */
    size() {
        return this.items.length;
    }
    
    /**
     * Проверяет, пуста ли коллекция
     * @returns {boolean} true, если коллекция пуста, false в противном случае
     */
    isEmpty() {
        return this.items.length === 0;
    }
    
    /**
     * Очищает коллекцию
     */
    clear() {
        this.items = [];
    }
    
    /**
     * Создает итератор для коллекции
     * @returns {Iterator} Итератор
     */
    createIterator() {
        return new ArrayIterator(this);
    }
    
    /**
     * Создает обратный итератор для коллекции
     * @returns {Iterator} Обратный итератор
     */
    createReverseIterator() {
        return new ReverseArrayIterator(this);
    }
    
    /**
     * Возвращает копию массива элементов
     * @returns {Array} Копия массива
     */
    toArray() {
        return [...this.items];
    }
    
    /**
     * Фильтрует элементы коллекции
     * @param {Function} predicate - Функция-предикат
     * @returns {ArrayCollection} Новая коллекция с отфильтрованными элементами
     */
    filter(predicate) {
        return new ArrayCollection(this.items.filter(predicate));
    }
    
    /**
     * Преобразует элементы коллекции
     * @param {Function} mapper - Функция преобразования
     * @returns {ArrayCollection} Новая коллекция с преобразованными элементами
     */
    map(mapper) {
        return new ArrayCollection(this.items.map(mapper));
    }
    
    /**
     * Сортирует элементы коллекции
     * @param {Function} comparator - Функция сравнения
     * @returns {ArrayCollection} Новая отсортированная коллекция
     */
    sort(comparator) {
        return new ArrayCollection([...this.items].sort(comparator));
    }
}

/**
 * Итератор для массива
 */
class ArrayIterator extends Iterator {
    constructor(collection) {
        super();
        this.collection = collection;
        this.currentIndex = 0;
    }
    
    /**
     * Возвращает следующий элемент коллекции
     * @returns {*} Следующий элемент или undefined, если элементов больше нет
     */
    next() {
        if (this.hasNext()) {
            const item = this.collection.get(this.currentIndex);
            this.currentIndex++;
            return item;
        }
        return undefined;
    }
    
    /**
     * Проверяет, есть ли еще элементы в коллекции
     * @returns {boolean} true, если есть еще элементы, false в противном случае
     */
    hasNext() {
        return this.currentIndex < this.collection.size();
    }
    
    /**
     * Возвращает текущий элемент
     * @returns {*} Текущий элемент
     */
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.collection.size()) {
            return this.collection.get(this.currentIndex);
        }
        return undefined;
    }
    
    /**
     * Возвращает индекс текущего элемента
     * @returns {number} Индекс текущего элемента
     */
    currentIndex() {
        return this.currentIndex;
    }
    
    /**
     * Сбрасывает итератор в начальное состояние
     */
    reset() {
        this.currentIndex = 0;
    }
    
    /**
     * Переходит к элементу по индексу
     * @param {number} index - Индекс элемента
     */
    goTo(index) {
        if (index >= 0 && index < this.collection.size()) {
            this.currentIndex = index;
        }
    }
    
    /**
     * Возвращает общее количество элементов
     * @returns {number} Количество элементов
     */
    count() {
        return this.collection.size();
    }
    
    /**
     * Возвращает предыдущий элемент
     * @returns {*} Предыдущий элемент или undefined
     */
    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.collection.get(this.currentIndex);
        }
        return undefined;
    }
    
    /**
     * Проверяет, есть ли предыдущий элемент
     * @returns {boolean} true, если есть предыдущий элемент, false в противном случае
     */
    hasPrevious() {
        return this.currentIndex > 0;
    }
}

/**
 * Обратный итератор для массива
 */
class ReverseArrayIterator extends Iterator {
    constructor(collection) {
        super();
        this.collection = collection;
        this.currentIndex = collection.size() - 1;
    }
    
    /**
     * Возвращает следующий элемент коллекции (в обратном порядке)
     * @returns {*} Следующий элемент или undefined, если элементов больше нет
     */
    next() {
        if (this.hasNext()) {
            const item = this.collection.get(this.currentIndex);
            this.currentIndex--;
            return item;
        }
        return undefined;
    }
    
    /**
     * Проверяет, есть ли еще элементы в коллекции
     * @returns {boolean} true, если есть еще элементы, false в противном случае
     */
    hasNext() {
        return this.currentIndex >= 0;
    }
    
    /**
     * Возвращает текущий элемент
     * @returns {*} Текущий элемент
     */
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.collection.size()) {
            return this.collection.get(this.currentIndex);
        }
        return undefined;
    }
    
    /**
     * Возвращает индекс текущего элемента
     * @returns {number} Индекс текущего элемента
     */
    currentIndex() {
        return this.currentIndex;
    }
    
    /**
     * Сбрасывает итератор в начальное состояние
     */
    reset() {
        this.currentIndex = this.collection.size() - 1;
    }
    
    /**
     * Переходит к элементу по индексу
     * @param {number} index - Индекс элемента
     */
    goTo(index) {
        if (index >= 0 && index < this.collection.size()) {
            this.currentIndex = index;
        }
    }
    
    /**
     * Возвращает общее количество элементов
     * @returns {number} Количество элементов
     */
    count() {
        return this.collection.size();
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР ITERATOR ===");

// Создаем коллекцию
const collection = new ArrayCollection(['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry']);

console.log('Размер коллекции:', collection.size());
console.log('Коллекция пуста:', collection.isEmpty());

// Создаем итератор
const iterator = collection.createIterator();

console.log('\n--- Обход коллекции вперед ---');
while (iterator.hasNext()) {
    console.log(`Элемент ${iterator.currentIndex()}: ${iterator.next()}`);
}

// Сбрасываем итератор
iterator.reset();

console.log('\n--- Обход коллекции с использованием current() ---');
while (iterator.hasNext()) {
    console.log(`Текущий элемент ${iterator.currentIndex()}: ${iterator.current()}`);
    iterator.next();
}

// Создаем обратный итератор
const reverseIterator = collection.createReverseIterator();

console.log('\n--- Обход коллекции в обратном порядке ---');
while (reverseIterator.hasNext()) {
    console.log(`Элемент ${reverseIterator.currentIndex()}: ${reverseIterator.next()}`);
}

// Тестируем методы итератора
console.log('\n--- Тестирование методов итератора ---');
iterator.reset();
iterator.goTo(2);
console.log('Переход к индексу 2, текущий элемент:', iterator.current());

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ФАЙЛОВАЯ СИСТЕМА =====

/**
 * Файловая система с поддержкой итерации
 */
class FileSystem {
    constructor() {
        this.files = [];
        this.folders = [];
    }
    
    /**
     * Добавляет файл в систему
     * @param {Object} file - Файл для добавления
     */
    addFile(file) {
        this.files.push(file);
    }
    
    /**
     * Добавляет папку в систему
     * @param {Object} folder - Папка для добавления
     */
    addFolder(folder) {
        this.folders.push(folder);
    }
    
    /**
     * Создает итератор для всех файлов
     * @returns {Iterator} Итератор файлов
     */
    createFileIterator() {
        return new FileIterator(this.files);
    }
    
    /**
     * Создает итератор для всех папок
     * @returns {Iterator} Итератор папок
     */
    createFolderIterator() {
        return new FolderIterator(this.folders);
    }
    
    /**
     * Создает итератор для всех элементов (файлов и папок)
     * @returns {Iterator} Итератор всех элементов
     */
    createAllItemsIterator() {
        return new AllItemsIterator([...this.files, ...this.folders]);
    }
    
    /**
     * Создает итератор для элементов по типу
     * @param {string} type - Тип элементов ('file' или 'folder')
     * @returns {Iterator} Итератор элементов указанного типа
     */
    createTypeIterator(type) {
        if (type === 'file') {
            return this.createFileIterator();
        } else if (type === 'folder') {
            return this.createFolderIterator();
        }
        return this.createAllItemsIterator();
    }
    
    /**
     * Возвращает общее количество элементов
     * @returns {number} Количество элементов
     */
    size() {
        return this.files.length + this.folders.length;
    }
    
    /**
     * Проверяет, пуста ли система
     * @returns {boolean} true, если система пуста, false в противном случае
     */
    isEmpty() {
        return this.size() === 0;
    }
}

/**
 * Итератор для файлов
 */
class FileIterator extends Iterator {
    constructor(files) {
        super();
        this.files = files;
        this.currentIndex = 0;
    }
    
    next() {
        if (this.hasNext()) {
            const file = this.files[this.currentIndex];
            this.currentIndex++;
            return file;
        }
        return undefined;
    }
    
    hasNext() {
        return this.currentIndex < this.files.length;
    }
    
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.files.length) {
            return this.files[this.currentIndex];
        }
        return undefined;
    }
    
    currentIndex() {
        return this.currentIndex;
    }
    
    reset() {
        this.currentIndex = 0;
    }
    
    goTo(index) {
        if (index >= 0 && index < this.files.length) {
            this.currentIndex = index;
        }
    }
    
    count() {
        return this.files.length;
    }
}

/**
 * Итератор для папок
 */
class FolderIterator extends Iterator {
    constructor(folders) {
        super();
        this.folders = folders;
        this.currentIndex = 0;
    }
    
    next() {
        if (this.hasNext()) {
            const folder = this.folders[this.currentIndex];
            this.currentIndex++;
            return folder;
        }
        return undefined;
    }
    
    hasNext() {
        return this.currentIndex < this.folders.length;
    }
    
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.folders.length) {
            return this.folders[this.currentIndex];
        }
        return undefined;
    }
    
    currentIndex() {
        return this.currentIndex;
    }
    
    reset() {
        this.currentIndex = 0;
    }
    
    goTo(index) {
        if (index >= 0 && index < this.folders.length) {
            this.currentIndex = index;
        }
    }
    
    count() {
        return this.folders.length;
    }
}

/**
 * Итератор для всех элементов
 */
class AllItemsIterator extends Iterator {
    constructor(items) {
        super();
        this.items = items;
        this.currentIndex = 0;
    }
    
    next() {
        if (this.hasNext()) {
            const item = this.items[this.currentIndex];
            this.currentIndex++;
            return item;
        }
        return undefined;
    }
    
    hasNext() {
        return this.currentIndex < this.items.length;
    }
    
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.items.length) {
            return this.items[this.currentIndex];
        }
        return undefined;
    }
    
    currentIndex() {
        return this.currentIndex;
    }
    
    reset() {
        this.currentIndex = 0;
    }
    
    goTo(index) {
        if (index >= 0 && index < this.items.length) {
            this.currentIndex = index;
        }
    }
    
    count() {
        return this.items.length;
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ФАЙЛОВАЯ СИСТЕМА ===");

// Создаем файловую систему
const fileSystem = new FileSystem();

// Добавляем файлы
fileSystem.addFile({ name: 'document.txt', size: 1024, type: 'text' });
fileSystem.addFile({ name: 'image.jpg', size: 2048576, type: 'image' });
fileSystem.addFile({ name: 'video.mp4', size: 104857600, type: 'video' });
fileSystem.addFile({ name: 'script.js', size: 5120, type: 'code' });

// Добавляем папки
fileSystem.addFolder({ name: 'Documents', path: '/home/user/documents' });
fileSystem.addFolder({ name: 'Pictures', path: '/home/user/pictures' });
fileSystem.addFolder({ name: 'Downloads', path: '/home/user/downloads' });

console.log('Общий размер файловой системы:', fileSystem.size());

// Итерируемся по файлам
console.log('\n--- Итерация по файлам ---');
const fileIterator = fileSystem.createFileIterator();
while (fileIterator.hasNext()) {
    const file = fileIterator.next();
    console.log(`Файл: ${file.name}, размер: ${file.size} байт, тип: ${file.type}`);
}

// Итерируемся по папкам
console.log('\n--- Итерация по папкам ---');
const folderIterator = fileSystem.createFolderIterator();
while (folderIterator.hasNext()) {
    const folder = folderIterator.next();
    console.log(`Папка: ${folder.name}, путь: ${folder.path}`);
}

// Итерируемся по всем элементам
console.log('\n--- Итерация по всем элементам ---');
const allItemsIterator = fileSystem.createAllItemsIterator();
while (allItemsIterator.hasNext()) {
    const item = allItemsIterator.next();
    if (item.type) {
        console.log(`Файл: ${item.name}`);
    } else {
        console.log(`Папка: ${item.name}`);
    }
}

// ===== ПРИМЕР С ДЕРЕВОМ =====

/**
 * Узел дерева
 */
class TreeNode {
    constructor(value) {
        this.value = value;
        this.children = [];
        this.parent = null;
    }
    
    /**
     * Добавляет дочерний узел
     * @param {TreeNode} child - Дочерний узел
     */
    addChild(child) {
        child.parent = this;
        this.children.push(child);
    }
    
    /**
     * Удаляет дочерний узел
     * @param {TreeNode} child - Дочерний узел
     * @returns {boolean} true, если узел был удален, false в противном случае
     */
    removeChild(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
            child.parent = null;
            return true;
        }
        return false;
    }
    
    /**
     * Возвращает количество дочерних узлов
     * @returns {number} Количество дочерних узлов
     */
    getChildrenCount() {
        return this.children.length;
    }
    
    /**
     * Возвращает дочерний узел по индексу
     * @param {number} index - Индекс дочернего узла
     * @returns {TreeNode} Дочерний узел
     */
    getChild(index) {
        if (index >= 0 && index < this.children.length) {
            return this.children[index];
        }
        return null;
    }
    
    /**
     * Проверяет, является ли узел листом
     * @returns {boolean} true, если узел является листом, false в противном случае
     */
    isLeaf() {
        return this.children.length === 0;
    }
    
    /**
     * Проверяет, является ли узел корнем
     * @returns {boolean} true, если узел является корнем, false в противном случае
     */
    isRoot() {
        return this.parent === null;
    }
    
    /**
     * Возвращает глубину узла
     * @returns {number} Глубина узла
     */
    getDepth() {
        if (this.isRoot()) {
            return 0;
        }
        return this.parent.getDepth() + 1;
    }
    
    /**
     * Возвращает высоту поддерева
     * @returns {number} Высота поддерева
     */
    getHeight() {
        if (this.isLeaf()) {
            return 0;
        }
        
        let maxHeight = 0;
        for (const child of this.children) {
            maxHeight = Math.max(maxHeight, child.getHeight());
        }
        
        return maxHeight + 1;
    }
}

/**
 * Дерево с поддержкой итерации
 */
class Tree extends Collection {
    constructor(root = null) {
        super();
        this.root = root;
    }
    
    /**
     * Устанавливает корень дерева
     * @param {TreeNode} root - Корневой узел
     */
    setRoot(root) {
        this.root = root;
    }
    
    /**
     * Возвращает корень дерева
     * @returns {TreeNode} Корневой узел
     */
    getRoot() {
        return this.root;
    }
    
    /**
     * Создает итератор для обхода дерева в глубину (DFS)
     * @returns {Iterator} Итератор DFS
     */
    createIterator() {
        return new DepthFirstIterator(this.root);
    }
    
    /**
     * Создает итератор для обхода дерева в ширину (BFS)
     * @returns {Iterator} Итератор BFS
     */
    createBreadthFirstIterator() {
        return new BreadthFirstIterator(this.root);
    }
    
    /**
     * Создает итератор для обхода дерева в порядке "in-order"
     * @returns {Iterator} Итератор in-order
     */
    createInOrderIterator() {
        return new InOrderIterator(this.root);
    }
    
    /**
     * Возвращает количество узлов в дереве
     * @returns {number} Количество узлов
     */
    size() {
        if (!this.root) {
            return 0;
        }
        return this.countNodes(this.root);
    }
    
    /**
     * Рекурсивно подсчитывает количество узлов
     * @param {TreeNode} node - Узел для подсчета
     * @returns {number} Количество узлов в поддереве
     */
    countNodes(node) {
        if (!node) {
            return 0;
        }
        
        let count = 1;
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        
        return count;
    }
    
    /**
     * Проверяет, пусто ли дерево
     * @returns {boolean} true, если дерево пусто, false в противном случае
     */
    isEmpty() {
        return this.root === null;
    }
    
    /**
     * Очищает дерево
     */
    clear() {
        this.root = null;
    }
}

/**
 * Итератор для обхода дерева в глубину (DFS)
 */
class DepthFirstIterator extends Iterator {
    constructor(root) {
        super();
        this.root = root;
        this.stack = [];
        this.currentNode = null;
        this.reset();
    }
    
    next() {
        if (!this.hasNext()) {
            return undefined;
        }
        
        this.currentNode = this.stack.pop();
        
        // Добавляем дочерние узлы в стек (в обратном порядке для правильного обхода)
        for (let i = this.currentNode.children.length - 1; i >= 0; i--) {
            this.stack.push(this.currentNode.children[i]);
        }
        
        return this.currentNode;
    }
    
    hasNext() {
        return this.stack.length > 0;
    }
    
    current() {
        return this.currentNode;
    }
    
    currentIndex() {
        return this.stack.length;
    }
    
    reset() {
        this.stack = [];
        this.currentNode = null;
        if (this.root) {
            this.stack.push(this.root);
        }
    }
    
    goTo(index) {
        // Для дерева переход по индексу не имеет смысла
        console.warn('Переход по индексу не поддерживается для дерева');
    }
    
    count() {
        if (!this.root) {
            return 0;
        }
        return this.countNodes(this.root);
    }
    
    countNodes(node) {
        if (!node) {
            return 0;
        }
        
        let count = 1;
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        
        return count;
    }
}

/**
 * Итератор для обхода дерева в ширину (BFS)
 */
class BreadthFirstIterator extends Iterator {
    constructor(root) {
        super();
        this.root = root;
        this.queue = [];
        this.currentNode = null;
        this.reset();
    }
    
    next() {
        if (!this.hasNext()) {
            return undefined;
        }
        
        this.currentNode = this.queue.shift();
        
        // Добавляем дочерние узлы в очередь
        for (const child of this.currentNode.children) {
            this.queue.push(child);
        }
        
        return this.currentNode;
    }
    
    hasNext() {
        return this.queue.length > 0;
    }
    
    current() {
        return this.currentNode;
    }
    
    currentIndex() {
        return this.queue.length;
    }
    
    reset() {
        this.queue = [];
        this.currentNode = null;
        if (this.root) {
            this.queue.push(this.root);
        }
    }
    
    goTo(index) {
        // Для дерева переход по индексу не имеет смысла
        console.warn('Переход по индексу не поддерживается для дерева');
    }
    
    count() {
        if (!this.root) {
            return 0;
        }
        return this.countNodes(this.root);
    }
    
    countNodes(node) {
        if (!node) {
            return 0;
        }
        
        let count = 1;
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        
        return count;
    }
}

/**
 * Итератор для обхода дерева в порядке "in-order"
 * (для бинарного дерева: левый потомок, корень, правый потомок)
 */
class InOrderIterator extends Iterator {
    constructor(root) {
        super();
        this.root = root;
        this.stack = [];
        this.currentNode = null;
        this.reset();
    }
    
    next() {
        if (!this.hasNext()) {
            return undefined;
        }
        
        // Находим следующий узел в порядке in-order
        while (this.currentNode || this.stack.length > 0) {
            if (this.currentNode) {
                this.stack.push(this.currentNode);
                this.currentNode = this.currentNode.children[0] || null;
            } else {
                this.currentNode = this.stack.pop();
                const result = this.currentNode;
                
                // Переходим к правому потомку
                this.currentNode = this.currentNode.children[1] || null;
                
                return result;
            }
        }
        
        return undefined;
    }
    
    hasNext() {
        return this.currentNode !== null || this.stack.length > 0;
    }
    
    current() {
        return this.currentNode;
    }
    
    currentIndex() {
        return this.stack.length;
    }
    
    reset() {
        this.stack = [];
        this.currentNode = this.root;
    }
    
    goTo(index) {
        // Для дерева переход по индексу не имеет смысла
        console.warn('Переход по индексу не поддерживается для дерева');
    }
    
    count() {
        if (!this.root) {
            return 0;
        }
        return this.countNodes(this.root);
    }
    
    countNodes(node) {
        if (!node) {
            return 0;
        }
        
        let count = 1;
        for (const child of node.children) {
            count += this.countNodes(child);
        }
        
        return count;
    }
}

console.log("\n=== ПРИМЕР С ДЕРЕВОМ ===");

// Создаем дерево
const tree = new Tree();

// Создаем узлы
const rootNode = new TreeNode('Root');
const child1 = new TreeNode('Child 1');
const child2 = new TreeNode('Child 2');
const grandchild1 = new TreeNode('Grandchild 1');
const grandchild2 = new TreeNode('Grandchild 2');
const grandchild3 = new TreeNode('Grandchild 3');

// Строим дерево
rootNode.addChild(child1);
rootNode.addChild(child2);
child1.addChild(grandchild1);
child1.addChild(grandchild2);
child2.addChild(grandchild3);

tree.setRoot(rootNode);

console.log('Размер дерева:', tree.size());
console.log('Высота дерева:', rootNode.getHeight());
console.log('Глубина узла Grandchild 1:', grandchild1.getDepth());

// Обход дерева в глубину (DFS)
console.log('\n--- Обход дерева в глубину (DFS) ---');
const dfsIterator = tree.createIterator();
while (dfsIterator.hasNext()) {
    const node = dfsIterator.next();
    console.log(`Узел: ${node.value}, глубина: ${node.getDepth()}`);
}

// Обход дерева в ширину (BFS)
console.log('\n--- Обход дерева в ширину (BFS) ---');
const bfsIterator = tree.createBreadthFirstIterator();
while (bfsIterator.hasNext()) {
    const node = bfsIterator.next();
    console.log(`Узел: ${node.value}, глубина: ${node.getDepth()}`);
}

// ===== ПРИМЕР С КОЛЛЕКЦИЕЙ ОБЪЕКТОВ =====

/**
 * Коллекция пользователей
 */
class UserCollection extends Collection {
    constructor() {
        super();
        this.users = [];
    }
    
    /**
     * Добавляет пользователя
     * @param {Object} user - Пользователь для добавления
     */
    addUser(user) {
        this.users.push(user);
    }
    
    /**
     * Удаляет пользователя
     * @param {string} id - ID пользователя
     * @returns {boolean} true, если пользователь был удален, false в противном случае
     */
    removeUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
    
    /**
     * Находит пользователя по ID
     * @param {string} id - ID пользователя
     * @returns {Object} Пользователь или undefined
     */
    findUser(id) {
        return this.users.find(user => user.id === id);
    }
    
    /**
     * Фильтрует пользователей по критерию
     * @param {Function} predicate - Функция-предикат
     * @returns {UserCollection} Новая коллекция с отфильтрованными пользователями
     */
    filterUsers(predicate) {
        const filteredUsers = this.users.filter(predicate);
        const newCollection = new UserCollection();
        filteredUsers.forEach(user => newCollection.addUser(user));
        return newCollection;
    }
    
    /**
     * Сортирует пользователей по полю
     * @param {string} field - Поле для сортировки
     * @param {boolean} ascending - Сортировка по возрастанию
     * @returns {UserCollection} Новая отсортированная коллекция
     */
    sortUsers(field, ascending = true) {
        const sortedUsers = [...this.users].sort((a, b) => {
            if (a[field] < b[field]) {
                return ascending ? -1 : 1;
            }
            if (a[field] > b[field]) {
                return ascending ? 1 : -1;
            }
            return 0;
        });
        
        const newCollection = new UserCollection();
        sortedUsers.forEach(user => newCollection.addUser(user));
        return newCollection;
    }
    
    /**
     * Создает итератор для всех пользователей
     * @returns {Iterator} Итератор пользователей
     */
    createIterator() {
        return new UserIterator(this.users);
    }
    
    /**
     * Создает итератор для активных пользователей
     * @returns {Iterator} Итератор активных пользователей
     */
    createActiveUsersIterator() {
        const activeUsers = this.users.filter(user => user.active);
        return new UserIterator(activeUsers);
    }
    
    /**
     * Создает итератор для пользователей определенной роли
     * @param {string} role - Роль пользователей
     * @returns {Iterator} Итератор пользователей с указанной ролью
     */
    createRoleIterator(role) {
        const roleUsers = this.users.filter(user => user.role === role);
        return new UserIterator(roleUsers);
    }
    
    /**
     * Возвращает количество пользователей
     * @returns {number} Количество пользователей
     */
    size() {
        return this.users.length;
    }
    
    /**
     * Проверяет, пуста ли коллекция
     * @returns {boolean} true, если коллекция пуста, false в противном случае
     */
    isEmpty() {
        return this.users.length === 0;
    }
    
    /**
     * Очищает коллекцию
     */
    clear() {
        this.users = [];
    }
}

/**
 * Итератор для пользователей
 */
class UserIterator extends Iterator {
    constructor(users) {
        super();
        this.users = users;
        this.currentIndex = 0;
    }
    
    next() {
        if (this.hasNext()) {
            const user = this.users[this.currentIndex];
            this.currentIndex++;
            return user;
        }
        return undefined;
    }
    
    hasNext() {
        return this.currentIndex < this.users.length;
    }
    
    current() {
        if (this.currentIndex >= 0 && this.currentIndex < this.users.length) {
            return this.users[this.currentIndex];
        }
        return undefined;
    }
    
    currentIndex() {
        return this.currentIndex;
    }
    
    reset() {
        this.currentIndex = 0;
    }
    
    goTo(index) {
        if (index >= 0 && index < this.users.length) {
            this.currentIndex = index;
        }
    }
    
    count() {
        return this.users.length;
    }
}

console.log("\n=== ПРИМЕР С КОЛЛЕКЦИЕЙ ПОЛЬЗОВАТЕЛЕЙ ===");

// Создаем коллекцию пользователей
const userCollection = new UserCollection();

// Добавляем пользователей
userCollection.addUser({ id: '1', name: 'Alice', age: 25, role: 'admin', active: true });
userCollection.addUser({ id: '2', name: 'Bob', age: 30, role: 'user', active: true });
userCollection.addUser({ id: '3', name: 'Charlie', age: 35, role: 'moderator', active: false });
userCollection.addUser({ id: '4', name: 'Diana', age: 28, role: 'user', active: true });
userCollection.addUser({ id: '5', name: 'Eve', age: 32, role: 'admin', active: true });

console.log('Общее количество пользователей:', userCollection.size());

// Итерируемся по всем пользователям
console.log('\n--- Все пользователи ---');
const allUsersIterator = userCollection.createIterator();
while (allUsersIterator.hasNext()) {
    const user = allUsersIterator.next();
    console.log(`${user.name} (${user.role}) - ${user.active ? 'активен' : 'неактивен'}`);
}

// Итерируемся по активным пользователям
console.log('\n--- Активные пользователи ---');
const activeUsersIterator = userCollection.createActiveUsersIterator();
while (activeUsersIterator.hasNext()) {
    const user = activeUsersIterator.next();
    console.log(`${user.name} (${user.role})`);
}

// Итерируемся по администраторам
console.log('\n--- Администраторы ---');
const adminIterator = userCollection.createRoleIterator('admin');
while (adminIterator.hasNext()) {
    const user = adminIterator.next();
    console.log(`${user.name} (${user.age} лет)`);
}

// Фильтруем пользователей по возрасту
console.log('\n--- Пользователи старше 30 лет ---');
const olderUsers = userCollection.filterUsers(user => user.age > 30);
const olderUsersIterator = olderUsers.createIterator();
while (olderUsersIterator.hasNext()) {
    const user = olderUsersIterator.next();
    console.log(`${user.name} (${user.age} лет)`);
}

// Сортируем пользователей по имени
console.log('\n--- Пользователи, отсортированные по имени ---');
const sortedUsers = userCollection.sortUsers('name');
const sortedIterator = sortedUsers.createIterator();
while (sortedIterator.hasNext()) {
    const user = sortedIterator.next();
    console.log(`${user.name} (${user.role})`);
}

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Упрощает интерфейс коллекции
 * - Позволяет скрыть детали реализации обхода
 * - Поддерживает множественные способы обхода
 * - Обеспечивает параллельный обход одной коллекции
 * - Упрощает добавление новых способов обхода
 * - Поддерживает принцип единственной ответственности
 * - Упрощает тестирование
 * 
 * НЕДОСТАТКИ:
 * - Может усложнить архитектуру для простых коллекций
 * - Дополнительные объекты в памяти
 * - Может быть избыточным для простых случаев
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Composite pattern
 * - Может быть частью Visitor pattern
 * - Связан с Factory Method pattern
 * - Используется в Command pattern
 */
