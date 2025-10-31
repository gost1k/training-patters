/**
 * COMPOSITE PATTERN (Паттерн Компоновщик)
 * 
 * Назначение: Позволяет сгруппировать объекты в древовидную структуру
 * и работать с ней так, как будто это единичный объект. Паттерн
 * обеспечивает единообразное обращение как к составным, так и к
 * индивидуальным объектам композиции.
 * 
 * Когда использовать:
 * - Когда нужно представить иерархию объектов в виде дерева
 * - Когда клиенты должны единообразно работать с составными и индивидуальными объектами
 * - Когда нужно легко добавлять новые типы компонентов
 * - Когда нужно обеспечить гибкость в структуре объектов
 * - Когда нужно реализовать рекурсивную обработку
 * 
 * Примеры использования:
 * - Файловая система
 * - UI компоненты
 * - Организационная структура
 * - Документы и их части
 * - Игровые объекты
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Абстрактный компонент
 * Определяет общий интерфейс для всех компонентов
 */
class Component {
    constructor(name) {
        this.name = name;
        this.parent = null;
    }
    
    /**
     * Добавляет дочерний компонент
     * @param {Component} component - Дочерний компонент
     */
    add(component) {
        throw new Error("Метод add должен быть переопределен");
    }
    
    /**
     * Удаляет дочерний компонент
     * @param {Component} component - Дочерний компонент
     */
    remove(component) {
        throw new Error("Метод remove должен быть переопределен");
    }
    
    /**
     * Получает дочерний компонент по индексу
     * @param {number} index - Индекс дочернего компонента
     * @returns {Component}
     */
    getChild(index) {
        throw new Error("Метод getChild должен быть переопределен");
    }
    
    /**
     * Возвращает количество дочерних компонентов
     * @returns {number}
     */
    getChildrenCount() {
        throw new Error("Метод getChildrenCount должен быть переопределен");
    }
    
    /**
     * Устанавливает родительский компонент
     * @param {Component} parent - Родительский компонент
     */
    setParent(parent) {
        this.parent = parent;
    }
    
    /**
     * Получает родительский компонент
     * @returns {Component}
     */
    getParent() {
        return this.parent;
    }
    
    /**
     * Возвращает название компонента
     * @returns {string}
     */
    getName() {
        return this.name;
    }
    
    /**
     * Операция, которую может выполнить компонент
     */
    operation() {
        throw new Error("Метод operation должен быть переопределен");
    }
    
    /**
     * Проверяет, является ли компонент составным
     * @returns {boolean}
     */
    isComposite() {
        return false;
    }
    
    /**
     * Возвращает путь к компоненту
     * @returns {string}
     */
    getPath() {
        if (this.parent) {
            return `${this.parent.getPath()}/${this.name}`;
        }
        return this.name;
    }
}

/**
 * Листовой компонент (не имеет дочерних элементов)
 */
class Leaf extends Component {
    constructor(name) {
        super(name);
    }
    
    add(component) {
        throw new Error("Листовой компонент не может иметь дочерние элементы");
    }
    
    remove(component) {
        throw new Error("Листовой компонент не может иметь дочерние элементы");
    }
    
    getChild(index) {
        throw new Error("Листовой компонент не может иметь дочерние элементы");
    }
    
    getChildrenCount() {
        return 0;
    }
    
    operation() {
        console.log(`[Leaf] Выполняем операцию для листового компонента: ${this.name}`);
        return `Операция выполнена для: ${this.name}`;
    }
    
    isComposite() {
        return false;
    }
}

/**
 * Составной компонент (может иметь дочерние элементы)
 */
class Composite extends Component {
    constructor(name) {
        super(name);
        this.children = [];
    }
    
    add(component) {
        component.setParent(this);
        this.children.push(component);
        console.log(`[Composite] Добавлен дочерний компонент: ${component.getName()} к ${this.name}`);
    }
    
    remove(component) {
        const index = this.children.indexOf(component);
        if (index !== -1) {
            this.children.splice(index, 1);
            component.setParent(null);
            console.log(`[Composite] Удален дочерний компонент: ${component.getName()} из ${this.name}`);
        }
    }
    
    getChild(index) {
        if (index >= 0 && index < this.children.length) {
            return this.children[index];
        }
        return null;
    }
    
    getChildrenCount() {
        return this.children.length;
    }
    
    operation() {
        console.log(`[Composite] Выполняем операцию для составного компонента: ${this.name}`);
        
        const results = [];
        
        // Выполняем операцию для всех дочерних компонентов
        for (const child of this.children) {
            const result = child.operation();
            results.push(result);
        }
        
        return `Операция выполнена для ${this.name} с результатами: [${results.join(', ')}]`;
    }
    
    isComposite() {
        return true;
    }
    
    /**
     * Возвращает все дочерние компоненты
     * @returns {Array}
     */
    getChildren() {
        return [...this.children];
    }
    
    /**
     * Находит компонент по имени
     * @param {string} name - Имя компонента
     * @returns {Component|null}
     */
    findByName(name) {
        if (this.name === name) {
            return this;
        }
        
        for (const child of this.children) {
            if (child.isComposite()) {
                const found = child.findByName(name);
                if (found) {
                    return found;
                }
            } else if (child.name === name) {
                return child;
            }
        }
        
        return null;
    }
    
    /**
     * Возвращает все листовые компоненты
     * @returns {Array}
     */
    getLeaves() {
        const leaves = [];
        
        for (const child of this.children) {
            if (child.isComposite()) {
                leaves.push(...child.getLeaves());
            } else {
                leaves.push(child);
            }
        }
        
        return leaves;
    }
    
    /**
     * Возвращает глубину дерева
     * @returns {number}
     */
    getDepth() {
        if (this.children.length === 0) {
            return 0;
        }
        
        let maxDepth = 0;
        for (const child of this.children) {
            if (child.isComposite()) {
                maxDepth = Math.max(maxDepth, child.getDepth());
            }
        }
        
        return maxDepth + 1;
    }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР COMPOSITE ===");

// Создаем компоненты
const root = new Composite('Root');
const branch1 = new Composite('Branch1');
const branch2 = new Composite('Branch2');
const leaf1 = new Leaf('Leaf1');
const leaf2 = new Leaf('Leaf2');
const leaf3 = new Leaf('Leaf3');

// Строим дерево
root.add(branch1);
root.add(branch2);
branch1.add(leaf1);
branch1.add(leaf2);
branch2.add(leaf3);

// Выполняем операции
console.log('\n--- Выполнение операций ---');
console.log('Результат операции для root:', root.operation());

console.log('\n--- Информация о структуре ---');
console.log('Путь к leaf1:', leaf1.getPath());
console.log('Путь к leaf3:', leaf3.getPath());
console.log('Глубина дерева:', root.getDepth());
console.log('Количество дочерних элементов root:', root.getChildrenCount());
console.log('Количество дочерних элементов branch1:', branch1.getChildrenCount());

console.log('\n--- Поиск компонентов ---');
const foundComponent = root.findByName('Leaf2');
if (foundComponent) {
    console.log('Найден компонент:', foundComponent.getName());
    console.log('Путь к компоненту:', foundComponent.getPath());
}

console.log('\n--- Все листовые компоненты ---');
const leaves = root.getLeaves();
leaves.forEach(leaf => {
    console.log(`Лист: ${leaf.getName()}, путь: ${leaf.getPath()}`);
});

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - ФАЙЛОВАЯ СИСТЕМА =====

/**
 * Абстрактный файловый компонент
 */
class FileSystemComponent {
    constructor(name, size = 0) {
        this.name = name;
        this.size = size;
        this.parent = null;
        this.createdAt = new Date();
        this.modifiedAt = new Date();
    }
    
    /**
     * Добавляет дочерний компонент
     * @param {FileSystemComponent} component - Дочерний компонент
     */
    add(component) {
        throw new Error("Метод add должен быть переопределен");
    }
    
    /**
     * Удаляет дочерний компонент
     * @param {FileSystemComponent} component - Дочерний компонент
     */
    remove(component) {
        throw new Error("Метод remove должен быть переопределен");
    }
    
    /**
     * Получает дочерний компонент по индексу
     * @param {number} index - Индекс дочернего компонента
     * @returns {FileSystemComponent}
     */
    getChild(index) {
        throw new Error("Метод getChild должен быть переопределен");
    }
    
    /**
     * Возвращает количество дочерних компонентов
     * @returns {number}
     */
    getChildrenCount() {
        throw new Error("Метод getChildrenCount должен быть переопределен");
    }
    
    /**
     * Устанавливает родительский компонент
     * @param {FileSystemComponent} parent - Родительский компонент
     */
    setParent(parent) {
        this.parent = parent;
    }
    
    /**
     * Получает родительский компонент
     * @returns {FileSystemComponent}
     */
    getParent() {
        return this.parent;
    }
    
    /**
     * Возвращает название компонента
     * @returns {string}
     */
    getName() {
        return this.name;
    }
    
    /**
     * Возвращает размер компонента
     * @returns {number}
     */
    getSize() {
        return this.size;
    }
    
    /**
     * Возвращает дату создания
     * @returns {Date}
     */
    getCreatedAt() {
        return this.createdAt;
    }
    
    /**
     * Возвращает дату последнего изменения
     * @returns {Date}
     */
    getModifiedAt() {
        return this.modifiedAt;
    }
    
    /**
     * Обновляет дату изменения
     */
    updateModifiedAt() {
        this.modifiedAt = new Date();
    }
    
    /**
     * Возвращает путь к компоненту
     * @returns {string}
     */
    getPath() {
        if (this.parent) {
            return `${this.parent.getPath()}/${this.name}`;
        }
        return this.name;
    }
    
    /**
     * Проверяет, является ли компонент составным
     * @returns {boolean}
     */
    isComposite() {
        return false;
    }
    
    /**
     * Выполняет операцию с файлом
     * @param {string} operation - Тип операции
     * @returns {string} Результат операции
     */
    executeOperation(operation) {
        throw new Error("Метод executeOperation должен быть переопределен");
    }
    
    /**
     * Возвращает информацию о компоненте
     * @returns {Object}
     */
    getInfo() {
        return {
            name: this.name,
            size: this.size,
            path: this.getPath(),
            createdAt: this.createdAt.toISOString(),
            modifiedAt: this.modifiedAt.toISOString(),
            isComposite: this.isComposite()
        };
    }
}

/**
 * Файл (листовой компонент)
 */
class File extends FileSystemComponent {
    constructor(name, size = 0, extension = '') {
        super(name, size);
        this.extension = extension;
        this.content = '';
    }
    
    add(component) {
        throw new Error("Файл не может содержать другие компоненты");
    }
    
    remove(component) {
        throw new Error("Файл не может содержать другие компоненты");
    }
    
    getChild(index) {
        throw new Error("Файл не может содержать другие компоненты");
    }
    
    getChildrenCount() {
        return 0;
    }
    
    /**
     * Устанавливает содержимое файла
     * @param {string} content - Содержимое файла
     */
    setContent(content) {
        this.content = content;
        this.size = content.length;
        this.updateModifiedAt();
    }
    
    /**
     * Получает содержимое файла
     * @returns {string}
     */
    getContent() {
        return this.content;
    }
    
    /**
     * Возвращает расширение файла
     * @returns {string}
     */
    getExtension() {
        return this.extension;
    }
    
    executeOperation(operation) {
        console.log(`[File] Выполняем операцию ${operation} для файла: ${this.name}`);
        
        switch (operation) {
            case 'read':
                return `Читаем файл ${this.name}: ${this.content}`;
            case 'write':
                return `Записываем в файл ${this.name}`;
            case 'delete':
                return `Удаляем файл ${this.name}`;
            case 'copy':
                return `Копируем файл ${this.name}`;
            default:
                return `Неизвестная операция ${operation} для файла ${this.name}`;
        }
    }
    
    getInfo() {
        return {
            ...super.getInfo(),
            extension: this.extension,
            contentLength: this.content.length
        };
    }
}

/**
 * Папка (составной компонент)
 */
class Folder extends FileSystemComponent {
    constructor(name) {
        super(name);
        this.children = [];
    }
    
    add(component) {
        component.setParent(this);
        this.children.push(component);
        this.updateModifiedAt();
        console.log(`[Folder] Добавлен компонент: ${component.getName()} в папку ${this.name}`);
    }
    
    remove(component) {
        const index = this.children.indexOf(component);
        if (index !== -1) {
            this.children.splice(index, 1);
            component.setParent(null);
            this.updateModifiedAt();
            console.log(`[Folder] Удален компонент: ${component.getName()} из папки ${this.name}`);
        }
    }
    
    getChild(index) {
        if (index >= 0 && index < this.children.length) {
            return this.children[index];
        }
        return null;
    }
    
    getChildrenCount() {
        return this.children.length;
    }
    
    /**
     * Возвращает размер папки (сумма размеров всех файлов)
     * @returns {number}
     */
    getSize() {
        let totalSize = 0;
        for (const child of this.children) {
            totalSize += child.getSize();
        }
        return totalSize;
    }
    
    /**
     * Возвращает все дочерние компоненты
     * @returns {Array}
     */
    getChildren() {
        return [...this.children];
    }
    
    /**
     * Находит компонент по имени
     * @param {string} name - Имя компонента
     * @returns {FileSystemComponent|null}
     */
    findByName(name) {
        if (this.name === name) {
            return this;
        }
        
        for (const child of this.children) {
            if (child.isComposite()) {
                const found = child.findByName(name);
                if (found) {
                    return found;
                }
            } else if (child.name === name) {
                return child;
            }
        }
        
        return null;
    }
    
    /**
     * Возвращает все файлы в папке и подпапках
     * @returns {Array}
     */
    getAllFiles() {
        const files = [];
        
        for (const child of this.children) {
            if (child.isComposite()) {
                files.push(...child.getAllFiles());
            } else {
                files.push(child);
            }
        }
        
        return files;
    }
    
    /**
     * Возвращает все папки в папке и подпапках
     * @returns {Array}
     */
    getAllFolders() {
        const folders = [];
        
        for (const child of this.children) {
            if (child.isComposite()) {
                folders.push(child);
                folders.push(...child.getAllFolders());
            }
        }
        
        return folders;
    }
    
    /**
     * Возвращает статистику папки
     * @returns {Object}
     */
    getStats() {
        const files = this.getAllFiles();
        const folders = this.getAllFolders();
        
        return {
            totalFiles: files.length,
            totalFolders: folders.length,
            totalSize: this.getSize(),
            averageFileSize: files.length > 0 ? this.getSize() / files.length : 0
        };
    }
    
    executeOperation(operation) {
        console.log(`[Folder] Выполняем операцию ${operation} для папки: ${this.name}`);
        
        const results = [];
        
        // Выполняем операцию для всех дочерних компонентов
        for (const child of this.children) {
            const result = child.executeOperation(operation);
            results.push(result);
        }
        
        return `Операция ${operation} выполнена для папки ${this.name} с результатами: [${results.join(', ')}]`;
    }
    
    isComposite() {
        return true;
    }
    
    getInfo() {
        return {
            ...super.getInfo(),
            childrenCount: this.children.length,
            stats: this.getStats()
        };
    }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - ФАЙЛОВАЯ СИСТЕМА ===");

// Создаем файловую систему
const rootFolder = new Folder('Root');
const documentsFolder = new Folder('Documents');
const picturesFolder = new Folder('Pictures');
const workFolder = new Folder('Work');
const personalFolder = new Folder('Personal');

// Создаем файлы
const resumeFile = new File('resume.txt', 0, 'txt');
const photoFile = new File('photo.jpg', 2048576, 'jpg');
const reportFile = new File('report.pdf', 1048576, 'pdf');
const notesFile = new File('notes.txt', 0, 'txt');

// Устанавливаем содержимое текстовых файлов
resumeFile.setContent('Мое резюме: опыт работы, навыки, образование');
notesFile.setContent('Важные заметки: встречи, задачи, идеи');

// Строим структуру папок
rootFolder.add(documentsFolder);
rootFolder.add(picturesFolder);
documentsFolder.add(workFolder);
documentsFolder.add(personalFolder);
workFolder.add(reportFile);
personalFolder.add(resumeFile);
picturesFolder.add(photoFile);
personalFolder.add(notesFile);

// Выполняем операции
console.log('\n--- Выполнение операций с файлами ---');
console.log('Чтение всех файлов в корневой папке:');
console.log(rootFolder.executeOperation('read'));

console.log('\n--- Информация о структуре ---');
console.log('Путь к resume.txt:', resumeFile.getPath());
console.log('Путь к report.pdf:', reportFile.getPath());
console.log('Размер папки Documents:', documentsFolder.getSize(), 'байт');
console.log('Размер папки Personal:', personalFolder.getSize(), 'байт');

console.log('\n--- Поиск компонентов ---');
const foundFile = rootFolder.findByName('resume.txt');
if (foundFile) {
    console.log('Найден файл:', foundFile.getName());
    console.log('Путь к файлу:', foundFile.getPath());
    console.log('Содержимое:', foundFile.getContent());
}

console.log('\n--- Статистика папок ---');
console.log('Статистика корневой папки:', rootFolder.getStats());
console.log('Статистика папки Documents:', documentsFolder.getStats());
console.log('Статистика папки Personal:', personalFolder.getStats());

console.log('\n--- Все файлы в системе ---');
const allFiles = rootFolder.getAllFiles();
allFiles.forEach(file => {
    console.log(`Файл: ${file.getName()}, размер: ${file.getSize()} байт, путь: ${file.getPath()}`);
});

// ===== ПРИМЕР С UI КОМПОНЕНТАМИ =====

/**
 * Абстрактный UI компонент
 */
class UIComponent {
    constructor(name, x = 0, y = 0, width = 100, height = 100) {
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.visible = true;
        this.enabled = true;
        this.parent = null;
        this.children = [];
    }
    
    /**
     * Добавляет дочерний компонент
     * @param {UIComponent} component - Дочерний компонент
     */
    add(component) {
        component.setParent(this);
        this.children.push(component);
        console.log(`[UIComponent] Добавлен дочерний компонент: ${component.getName()} к ${this.name}`);
    }
    
    /**
     * Удаляет дочерний компонент
     * @param {UIComponent} component - Дочерний компонент
     */
    remove(component) {
        const index = this.children.indexOf(component);
        if (index !== -1) {
            this.children.splice(index, 1);
            component.setParent(null);
            console.log(`[UIComponent] Удален дочерний компонент: ${component.getName()} из ${this.name}`);
        }
    }
    
    /**
     * Получает дочерний компонент по индексу
     * @param {number} index - Индекс дочернего компонента
     * @returns {UIComponent}
     */
    getChild(index) {
        if (index >= 0 && index < this.children.length) {
            return this.children[index];
        }
        return null;
    }
    
    /**
     * Возвращает количество дочерних компонентов
     * @returns {number}
     */
    getChildrenCount() {
        return this.children.length;
    }
    
    /**
     * Устанавливает родительский компонент
     * @param {UIComponent} parent - Родительский компонент
     */
    setParent(parent) {
        this.parent = parent;
    }
    
    /**
     * Получает родительский компонент
     * @returns {UIComponent}
     */
    getParent() {
        return this.parent;
    }
    
    /**
     * Возвращает название компонента
     * @returns {string}
     */
    getName() {
        return this.name;
    }
    
    /**
     * Устанавливает позицию компонента
     * @param {number} x - X координата
     * @param {number} y - Y координата
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    /**
     * Устанавливает размер компонента
     * @param {number} width - Ширина
     * @param {number} height - Высота
     */
    setSize(width, height) {
        this.width = width;
        this.height = height;
    }
    
    /**
     * Устанавливает видимость компонента
     * @param {boolean} visible - Видимость
     */
    setVisible(visible) {
        this.visible = visible;
    }
    
    /**
     * Устанавливает активность компонента
     * @param {boolean} enabled - Активность
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    
    /**
     * Возвращает абсолютную позицию компонента
     * @returns {Object}
     */
    getAbsolutePosition() {
        if (this.parent) {
            const parentPos = this.parent.getAbsolutePosition();
            return {
                x: parentPos.x + this.x,
                y: parentPos.y + this.y
            };
        }
        return { x: this.x, y: this.y };
    }
    
    /**
     * Возвращает границы компонента
     * @returns {Object}
     */
    getBounds() {
        const pos = this.getAbsolutePosition();
        return {
            x: pos.x,
            y: pos.y,
            width: this.width,
            height: this.height,
            right: pos.x + this.width,
            bottom: pos.y + this.height
        };
    }
    
    /**
     * Проверяет, находится ли точка в границах компонента
     * @param {number} x - X координата точки
     * @param {number} y - Y координата точки
     * @returns {boolean}
     */
    containsPoint(x, y) {
        const bounds = this.getBounds();
        return x >= bounds.x && x <= bounds.right && y >= bounds.y && y <= bounds.bottom;
    }
    
    /**
     * Проверяет, является ли компонент составным
     * @returns {boolean}
     */
    isComposite() {
        return this.children.length > 0;
    }
    
    /**
     * Отрисовывает компонент
     */
    render() {
        throw new Error("Метод render должен быть переопределен");
    }
    
    /**
     * Обрабатывает событие
     * @param {string} eventType - Тип события
     * @param {Object} eventData - Данные события
     */
    handleEvent(eventType, eventData) {
        throw new Error("Метод handleEvent должен быть переопределен");
    }
    
    /**
     * Возвращает информацию о компоненте
     * @returns {Object}
     */
    getInfo() {
        return {
            name: this.name,
            position: { x: this.x, y: this.y },
            size: { width: this.width, height: this.height },
            visible: this.visible,
            enabled: this.enabled,
            isComposite: this.isComposite(),
            childrenCount: this.children.length
        };
    }
}

/**
 * Кнопка (листовой компонент)
 */
class Button extends UIComponent {
    constructor(name, x = 0, y = 0, width = 100, height = 30, text = '') {
        super(name, x, y, width, height);
        this.text = text;
        this.clicked = false;
    }
    
    /**
     * Устанавливает текст кнопки
     * @param {string} text - Текст кнопки
     */
    setText(text) {
        this.text = text;
    }
    
    /**
     * Возвращает текст кнопки
     * @returns {string}
     */
    getText() {
        return this.text;
    }
    
    /**
     * Симулирует клик по кнопке
     */
    click() {
        if (this.enabled) {
            this.clicked = true;
            console.log(`[Button] Кнопка "${this.text}" нажата`);
            this.handleEvent('click', { button: this.name, text: this.text });
        }
    }
    
    render() {
        if (this.visible) {
            const pos = this.getAbsolutePosition();
            console.log(`[Button] Отрисовываем кнопку "${this.text}" в позиции (${pos.x}, ${pos.y}) размером ${this.width}x${this.height}`);
        }
    }
    
    handleEvent(eventType, eventData) {
        switch (eventType) {
            case 'click':
                console.log(`[Button] Обрабатываем событие click для кнопки "${this.text}"`);
                break;
            case 'hover':
                console.log(`[Button] Обрабатываем событие hover для кнопки "${this.text}"`);
                break;
            default:
                console.log(`[Button] Неизвестное событие ${eventType} для кнопки "${this.text}"`);
        }
    }
    
    getInfo() {
        return {
            ...super.getInfo(),
            text: this.text,
            clicked: this.clicked
        };
    }
}

/**
 * Панель (составной компонент)
 */
class Panel extends UIComponent {
    constructor(name, x = 0, y = 0, width = 200, height = 150) {
        super(name, x, y, width, height);
        this.backgroundColor = '#f0f0f0';
        this.borderColor = '#cccccc';
        this.borderWidth = 1;
    }
    
    /**
     * Устанавливает цвет фона
     * @param {string} color - Цвет фона
     */
    setBackgroundColor(color) {
        this.backgroundColor = color;
    }
    
    /**
     * Устанавливает цвет границы
     * @param {string} color - Цвет границы
     */
    setBorderColor(color) {
        this.borderColor = color;
    }
    
    /**
     * Устанавливает ширину границы
     * @param {number} width - Ширина границы
     */
    setBorderWidth(width) {
        this.borderWidth = width;
    }
    
    render() {
        if (this.visible) {
            const pos = this.getAbsolutePosition();
            console.log(`[Panel] Отрисовываем панель "${this.name}" в позиции (${pos.x}, ${pos.y}) размером ${this.width}x${this.height}`);
            console.log(`[Panel] Фон: ${this.backgroundColor}, граница: ${this.borderColor}, ширина границы: ${this.borderWidth}`);
            
            // Отрисовываем дочерние компоненты
            for (const child of this.children) {
                child.render();
            }
        }
    }
    
    handleEvent(eventType, eventData) {
        console.log(`[Panel] Обрабатываем событие ${eventType} для панели "${this.name}"`);
        
        // Передаем событие дочерним компонентам
        for (const child of this.children) {
            if (child.enabled) {
                child.handleEvent(eventType, eventData);
            }
        }
    }
    
    /**
     * Находит компонент по имени
     * @param {string} name - Имя компонента
     * @returns {UIComponent|null}
     */
    findByName(name) {
        if (this.name === name) {
            return this;
        }
        
        for (const child of this.children) {
            if (child.isComposite()) {
                const found = child.findByName(name);
                if (found) {
                    return found;
                }
            } else if (child.name === name) {
                return child;
            }
        }
        
        return null;
    }
    
    /**
     * Возвращает все кнопки в панели и подпанелях
     * @returns {Array}
     */
    getAllButtons() {
        const buttons = [];
        
        for (const child of this.children) {
            if (child instanceof Button) {
                buttons.push(child);
            } else if (child.isComposite()) {
                buttons.push(...child.getAllButtons());
            }
        }
        
        return buttons;
    }
    
    getInfo() {
        return {
            ...super.getInfo(),
            backgroundColor: this.backgroundColor,
            borderColor: this.borderColor,
            borderWidth: this.borderWidth
        };
    }
}

console.log("\n=== ПРИМЕР С UI КОМПОНЕНТАМИ ===");

// Создаем UI компоненты
const mainPanel = new Panel('MainPanel', 0, 0, 400, 300);
const headerPanel = new Panel('HeaderPanel', 0, 0, 400, 50);
const contentPanel = new Panel('ContentPanel', 0, 50, 400, 200);
const footerPanel = new Panel('FooterPanel', 0, 250, 400, 50);

// Создаем кнопки
const saveButton = new Button('SaveButton', 10, 10, 80, 30, 'Сохранить');
const cancelButton = new Button('CancelButton', 100, 10, 80, 30, 'Отмена');
const okButton = new Button('OkButton', 10, 10, 60, 30, 'OK');

// Строим структуру UI
mainPanel.add(headerPanel);
mainPanel.add(contentPanel);
mainPanel.add(footerPanel);
headerPanel.add(saveButton);
headerPanel.add(cancelButton);
footerPanel.add(okButton);

// Настраиваем стили
headerPanel.setBackgroundColor('#e0e0e0');
contentPanel.setBackgroundColor('#ffffff');
footerPanel.setBackgroundColor('#f5f5f5');

// Отрисовываем UI
console.log('\n--- Отрисовка UI ---');
mainPanel.render();

// Тестируем события
console.log('\n--- Тестирование событий ---');
mainPanel.handleEvent('click', { x: 50, y: 20 });
saveButton.click();

// Поиск компонентов
console.log('\n--- Поиск компонентов ---');
const foundButton = mainPanel.findByName('SaveButton');
if (foundButton) {
    console.log('Найдена кнопка:', foundButton.getInfo());
}

// Получение всех кнопок
console.log('\n--- Все кнопки в системе ---');
const allButtons = mainPanel.getAllButtons();
allButtons.forEach(button => {
    console.log(`Кнопка: ${button.getText()}, позиция: (${button.x}, ${button.y})`);
});

// Информация о компонентах
console.log('\n--- Информация о компонентах ---');
console.log('Главная панель:', mainPanel.getInfo());
console.log('Заголовок:', headerPanel.getInfo());
console.log('Кнопка сохранения:', saveButton.getInfo());

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Упрощает работу с составными объектами
 * - Позволяет легко добавлять новые типы компонентов
 * - Обеспечивает единообразное обращение к объектам
 * - Поддерживает рекурсивную обработку
 * - Упрощает управление сложными структурами
 * - Поддерживает принцип открытости/закрытости
 * 
 * НЕДОСТАТКИ:
 * - Может усложнить дизайн системы
 * - Сложно ограничить типы дочерних компонентов
 * - Может привести к слишком общему интерфейсу
 * - Сложно обеспечить типобезопасность
 * 
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Iterator pattern
 * - Может быть частью Visitor pattern
 * - Связан с Decorator pattern
 * - Используется в Builder pattern
 */
