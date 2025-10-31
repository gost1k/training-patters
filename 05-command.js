/**
 * COMMAND PATTERN (Паттерн Команда)
 *
 * Назначение: Инкапсулирует запрос как объект, позволяя параметризовать
 * клиентов с различными запросами, ставить запросы в очередь или логировать их,
 * а также поддерживать отмену операций.
 *
 * Когда использовать:
 * - Когда нужно параметризовать объекты выполняемыми действиями
 * - Когда нужно ставить операции в очередь, выполнять их по расписанию
 * - Когда нужно поддерживать отмену операций
 * - Когда нужно поддерживать логирование операций
 * - Когда нужно поддерживать транзакции
 *
 * Примеры использования:
 * - Кнопки в UI
 * - Система отмены/повтора действий
 * - Очередь команд
 * - Логирование операций
 * - Транзакции в базе данных
 */

// ===== БАЗОВАЯ РЕАЛИЗАЦИЯ =====

/**
 * Интерфейс команды
 * Все команды должны реализовывать методы execute и undo
 */
class Command {
  /**
   * Выполняет команду
   */
  execute() {
    throw new Error("Метод execute должен быть переопределен");
  }

  /**
   * Отменяет команду
   */
  undo() {
    throw new Error("Метод undo должен быть переопределен");
  }

  /**
   * Возвращает название команды
   * @returns {string}
   */
  getName() {
    return this.constructor.name;
  }
}

/**
 * Получатель команды
 * Знает, как выполнять операции, связанные с командой
 */
class Receiver {
  constructor(name = "Receiver") {
    this.name = name;
    this.state = 0;
    this.history = [];
  }

  /**
   * Увеличивает состояние
   */
  increment() {
    const oldState = this.state;
    this.state++;
    this.history.push({ action: "increment", oldState, newState: this.state });
    console.log(
      `[${this.name}] Состояние увеличено: ${oldState} → ${this.state}`
    );
    return this.state;
  }

  /**
   * Уменьшает состояние
   */
  decrement() {
    const oldState = this.state;
    this.state--;
    this.history.push({ action: "decrement", oldState, newState: this.state });
    console.log(
      `[${this.name}] Состояние уменьшено: ${oldState} → ${this.state}`
    );
    return this.state;
  }

  /**
   * Устанавливает состояние
   * @param {number} value - Новое значение
   */
  setState(value) {
    const oldState = this.state;
    this.state = value;
    this.history.push({ action: "setState", oldState, newState: this.state });
    console.log(
      `[${this.name}] Состояние установлено: ${oldState} → ${this.state}`
    );
    return this.state;
  }

  /**
   * Возвращает текущее состояние
   * @returns {number}
   */
  getState() {
    return this.state;
  }

  /**
   * Возвращает историю изменений
   * @returns {Array}
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Возвращает последнее изменение
   * @returns {Object|null}
   */
  getLastChange() {
    return this.history.length > 0
      ? this.history[this.history.length - 1]
      : null;
  }
}

/**
 * Вызыватель команды
 * Хранит команду и вызывает её выполнение
 */
class Invoker {
  constructor() {
    this.commands = [];
    this.executedCommands = [];
    this.undoneCommands = [];
  }

  /**
   * Устанавливает команду для выполнения
   * @param {Command} command - Команда для выполнения
   */
  setCommand(command) {
    this.commands.push(command);
    console.log(`Команда ${command.getName()} добавлена в очередь`);
  }

  /**
   * Выполняет команду
   */
  executeCommand() {
    if (this.commands.length === 0) {
      console.log("Нет команд для выполнения");
      return;
    }

    const command = this.commands.shift();
    command.execute();
    this.executedCommands.push(command);

    // Очищаем стек отмены при выполнении новой команды
    this.undoneCommands = [];

    console.log(`Команда ${command.getName()} выполнена`);
  }

  /**
   * Выполняет все команды в очереди
   */
  executeAllCommands() {
    console.log(`Выполняем ${this.commands.length} команд`);
    while (this.commands.length > 0) {
      this.executeCommand();
    }
  }

  /**
   * Отменяет последнюю выполненную команду
   */
  undo() {
    if (this.executedCommands.length === 0) {
      console.log("Нет команд для отмены");
      return;
    }

    const command = this.executedCommands.pop();
    command.undo();
    this.undoneCommands.push(command);
    console.log(`Команда ${command.getName()} отменена`);
  }

  /**
   * Повторяет последнюю отмененную команду
   */
  redo() {
    if (this.undoneCommands.length === 0) {
      console.log("Нет команд для повтора");
      return;
    }

    const command = this.undoneCommands.pop();
    command.execute();
    this.executedCommands.push(command);
    console.log(`Команда ${command.getName()} повторена`);
  }

  /**
   * Возвращает количество команд в очереди
   * @returns {number}
   */
  getQueueSize() {
    return this.commands.length;
  }

  /**
   * Возвращает количество выполненных команд
   * @returns {number}
   */
  getExecutedCount() {
    return this.executedCommands.length;
  }

  /**
   * Возвращает количество отмененных команд
   * @returns {number}
   */
  getUndoneCount() {
    return this.undoneCommands.length;
  }
}

// ===== КОНКРЕТНЫЕ КОМАНДЫ =====

/**
 * Команда увеличения состояния
 */
class IncrementCommand extends Command {
  constructor(receiver) {
    super();
    this.receiver = receiver;
    this.previousState = null;
  }

  execute() {
    this.previousState = this.receiver.getState();
    return this.receiver.increment();
  }

  undo() {
    if (this.previousState !== null) {
      this.receiver.setState(this.previousState);
      console.log(
        `[${this.getName()}] Отменено: ${this.receiver.getState()} → ${
          this.previousState
        }`
      );
    }
  }
}

/**
 * Команда уменьшения состояния
 */
class DecrementCommand extends Command {
  constructor(receiver) {
    super();
    this.receiver = receiver;
    this.previousState = null;
  }

  execute() {
    this.previousState = this.receiver.getState();
    return this.receiver.decrement();
  }

  undo() {
    if (this.previousState !== null) {
      this.receiver.setState(this.previousState);
      console.log(
        `[${this.getName()}] Отменено: ${this.receiver.getState()} → ${
          this.previousState
        }`
      );
    }
  }
}

/**
 * Команда установки состояния
 */
class SetStateCommand extends Command {
  constructor(receiver, newState) {
    super();
    this.receiver = receiver;
    this.newState = newState;
    this.previousState = null;
  }

  execute() {
    this.previousState = this.receiver.getState();
    return this.receiver.setState(this.newState);
  }

  undo() {
    if (this.previousState !== null) {
      this.receiver.setState(this.previousState);
      console.log(
        `[${this.getName()}] Отменено: ${this.receiver.getState()} → ${
          this.previousState
        }`
      );
    }
  }
}

// ===== ПРИМЕР ИСПОЛЬЗОВАНИЯ =====

console.log("=== БАЗОВЫЙ ПРИМЕР COMMAND ===");

// Создаем получателя
const receiver = new Receiver("Основной получатель");

// Создаем команды
const incrementCmd = new IncrementCommand(receiver);
const decrementCmd = new DecrementCommand(receiver);
const setStateCmd = new SetStateCommand(receiver, 10);

// Создаем вызывателя
const invoker = new Invoker();

// Добавляем команды в очередь
invoker.setCommand(incrementCmd);
invoker.setCommand(incrementCmd);
invoker.setCommand(setStateCmd);
invoker.setCommand(decrementCmd);

console.log(`Размер очереди: ${invoker.getQueueSize()}`);

// Выполняем команды
invoker.executeCommand();
invoker.executeCommand();
invoker.executeCommand();
invoker.executeCommand();

console.log(`Текущее состояние: ${receiver.getState()}`);
console.log(`Выполнено команд: ${invoker.getExecutedCount()}`);

// Отменяем команды
invoker.undo();
invoker.undo();

console.log(`Текущее состояние: ${receiver.getState()}`);

// Повторяем команды
invoker.redo();
invoker.redo();

console.log(`Текущее состояние: ${receiver.getState()}`);

// ===== ПРАКТИЧЕСКИЙ ПРИМЕР - РЕДАКТОР ТЕКСТА =====

/**
 * Получатель для текстового редактора
 */
class TextEditor {
  constructor() {
    this.content = "";
    this.cursorPosition = 0;
    this.history = [];
  }

  /**
   * Вставляет текст в текущую позицию курсора
   * @param {string} text - Текст для вставки
   */
  insertText(text) {
    const before = this.content.slice(0, this.cursorPosition);
    const after = this.content.slice(this.cursorPosition);

    this.history.push({
      action: "insertText",
      position: this.cursorPosition,
      text: text,
      oldContent: this.content,
    });

    this.content = before + text + after;
    this.cursorPosition += text.length;

    console.log(`[TextEditor] Вставлен текст: "${text}"`);
    return this.content;
  }

  /**
   * Удаляет символы в указанной позиции
   * @param {number} count - Количество символов для удаления
   */
  deleteText(count) {
    const before = this.content.slice(0, this.cursorPosition);
    const after = this.content.slice(this.cursorPosition + count);
    const deletedText = this.content.slice(
      this.cursorPosition,
      this.cursorPosition + count
    );

    this.history.push({
      action: "deleteText",
      position: this.cursorPosition,
      deletedText: deletedText,
      oldContent: this.content,
    });

    this.content = before + after;

    console.log(`[TextEditor] Удален текст: "${deletedText}"`);
    return this.content;
  }

  /**
   * Перемещает курсор в указанную позицию
   * @param {number} position - Новая позиция курсора
   */
  moveCursor(position) {
    const oldPosition = this.cursorPosition;

    if (position >= 0 && position <= this.content.length) {
      this.cursorPosition = position;
      console.log(
        `[TextEditor] Курсор перемещен: ${oldPosition} → ${position}`
      );
    } else {
      console.log(`[TextEditor] Недопустимая позиция курсора: ${position}`);
    }

    return this.cursorPosition;
  }

  /**
   * Возвращает текущее содержимое
   * @returns {string}
   */
  getContent() {
    return this.content;
  }

  /**
   * Возвращает текущую позицию курсора
   * @returns {number}
   */
  getCursorPosition() {
    return this.cursorPosition;
  }

  /**
   * Возвращает историю изменений
   * @returns {Array}
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Отменяет последнее изменение
   * @returns {boolean}
   */
  undoLastChange() {
    if (this.history.length === 0) {
      return false;
    }

    const lastChange = this.history.pop();

    switch (lastChange.action) {
      case "insertText":
        this.content = lastChange.oldContent;
        this.cursorPosition = lastChange.position;
        break;
      case "deleteText":
        this.content = lastChange.oldContent;
        this.cursorPosition = lastChange.position;
        break;
    }

    console.log(`[TextEditor] Отменено изменение: ${lastChange.action}`);
    return true;
  }
}

/**
 * Команда вставки текста
 */
class InsertTextCommand extends Command {
  constructor(editor, text) {
    super();
    this.editor = editor;
    this.text = text;
    this.previousState = null;
  }

  execute() {
    this.previousState = {
      content: this.editor.getContent(),
      cursorPosition: this.editor.getCursorPosition(),
    };
    return this.editor.insertText(this.text);
  }

  undo() {
    if (this.previousState) {
      this.editor.content = this.previousState.content;
      this.editor.cursorPosition = this.previousState.cursorPosition;
      console.log(`[${this.getName()}] Отменено вставление текста`);
    }
  }
}

/**
 * Команда удаления текста
 */
class DeleteTextCommand extends Command {
  constructor(editor, count) {
    super();
    this.editor = editor;
    this.count = count;
    this.previousState = null;
  }

  execute() {
    this.previousState = {
      content: this.editor.getContent(),
      cursorPosition: this.editor.getCursorPosition(),
    };
    return this.editor.deleteText(this.count);
  }

  undo() {
    if (this.previousState) {
      this.editor.content = this.previousState.content;
      this.editor.cursorPosition = this.previousState.cursorPosition;
      console.log(`[${this.getName()}] Отменено удаление текста`);
    }
  }
}

/**
 * Команда перемещения курсора
 */
class MoveCursorCommand extends Command {
  constructor(editor, position) {
    super();
    this.editor = editor;
    this.position = position;
    this.previousPosition = null;
  }

  execute() {
    this.previousPosition = this.editor.getCursorPosition();
    return this.editor.moveCursor(this.position);
  }

  undo() {
    if (this.previousPosition !== null) {
      this.editor.moveCursor(this.previousPosition);
      console.log(`[${this.getName()}] Отменено перемещение курсора`);
    }
  }
}

console.log("\n=== ПРАКТИЧЕСКИЙ ПРИМЕР - РЕДАКТОР ТЕКСТА ===");

// Создаем текстовый редактор
const textEditor = new TextEditor();

// Создаем команды
const insertHelloCmd = new InsertTextCommand(textEditor, "Hello");
const insertWorldCmd = new InsertTextCommand(textEditor, " World!");
const moveCursorCmd = new MoveCursorCommand(textEditor, 5);
const deleteTextCmd = new DeleteTextCommand(textEditor, 6);

// Создаем вызывателя
const editorInvoker = new Invoker();

// Добавляем команды в очередь
editorInvoker.setCommand(insertHelloCmd);
editorInvoker.setCommand(insertWorldCmd);
editorInvoker.setCommand(moveCursorCmd);
editorInvoker.setCommand(deleteTextCmd);

// Выполняем все команды
editorInvoker.executeAllCommands();

console.log(`\nФинальное содержимое: "${textEditor.getContent()}"`);
console.log(`Позиция курсора: ${textEditor.getCursorPosition()}`);

// Отменяем последние изменения
editorInvoker.undo();
editorInvoker.undo();

console.log(`\nПосле отмены: "${textEditor.getContent()}"`);
console.log(`Позиция курсора: ${textEditor.getCursorPosition()}`);

// ===== ПРИМЕР С МАКРОКОМАНДАМИ =====

/**
 * Макрокоманда - выполняет несколько команд как одну
 */
class MacroCommand extends Command {
  constructor(name = "MacroCommand") {
    super();
    this.name = name;
    this.commands = [];
    this.executedStates = [];
  }

  /**
   * Добавляет команду в макрокоманду
   * @param {Command} command - Команда для добавления
   */
  addCommand(command) {
    this.commands.push(command);
  }

  /**
   * Выполняет все команды в макрокоманде
   */
  execute() {
    this.executedStates = [];

    console.log(
      `[${this.name}] Выполняем макрокоманду из ${this.commands.length} команд`
    );

    for (const command of this.commands) {
      // Сохраняем состояние перед выполнением каждой команды
      this.executedStates.push({
        command: command,
        state: command.receiver ? command.receiver.getState() : null,
      });

      command.execute();
    }

    console.log(`[${this.name}] Макрокоманда выполнена`);
  }

  /**
   * Отменяет все команды в макрокоманде в обратном порядке
   */
  undo() {
    console.log(`[${this.name}] Отменяем макрокоманду`);

    // Отменяем команды в обратном порядке
    for (let i = this.commands.length - 1; i >= 0; i--) {
      this.commands[i].undo();
    }

    console.log(`[${this.name}] Макрокоманда отменена`);
  }

  /**
   * Возвращает количество команд в макрокоманде
   * @returns {number}
   */
  getCommandCount() {
    return this.commands.length;
  }
}

console.log("\n=== ПРИМЕР С МАКРОКОМАНДАМИ ===");

// Создаем макрокоманду для инициализации
const initMacro = new MacroCommand("Инициализация");

// Добавляем команды в макрокоманду
initMacro.addCommand(new SetStateCommand(receiver, 0));
initMacro.addCommand(new IncrementCommand(receiver));
initMacro.addCommand(new IncrementCommand(receiver));
initMacro.addCommand(new IncrementCommand(receiver));

// Выполняем макрокоманду
initMacro.execute();

console.log(`Состояние после макрокоманды: ${receiver.getState()}`);

// Отменяем макрокоманду
initMacro.undo();

console.log(`Состояние после отмены макрокоманды: ${receiver.getState()}`);

// ===== ПРИМЕР С ЛОГИРОВАНИЕМ КОМАНД =====

/**
 * Команда с логированием
 */
class LoggingCommand extends Command {
  constructor(command, logger) {
    super();
    this.command = command;
    this.logger = logger;
  }

  execute() {
    const startTime = Date.now();

    this.logger.log(`Выполнение команды: ${this.command.getName()}`);

    try {
      const result = this.command.execute();
      const executionTime = Date.now() - startTime;

      this.logger.log(
        `Команда ${this.command.getName()} выполнена за ${executionTime}ms`
      );
      return result;
    } catch (error) {
      this.logger.log(
        `Ошибка выполнения команды ${this.command.getName()}: ${error.message}`
      );
      throw error;
    }
  }

  undo() {
    this.logger.log(`Отмена команды: ${this.command.getName()}`);
    return this.command.undo();
  }
}

/**
 * Простой логгер
 */
class SimpleLogger {
  constructor() {
    this.logs = [];
  }

  log(message) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      message: message,
    };

    this.logs.push(logEntry);
    console.log(`[LOG] ${message}`);
  }

  getLogs() {
    return [...this.logs];
  }

  clear() {
    this.logs = [];
  }
}

console.log("\n=== ПРИМЕР С ЛОГИРОВАНИЕМ ===");

// Создаем логгер
const logger = new SimpleLogger();

// Создаем команды с логированием
const loggedIncrementCmd = new LoggingCommand(
  new IncrementCommand(receiver),
  logger
);
const loggedDecrementCmd = new LoggingCommand(
  new DecrementCommand(receiver),
  logger
);

// Выполняем команды с логированием
loggedIncrementCmd.execute();
loggedDecrementCmd.execute();

// Отменяем команды
loggedIncrementCmd.undo();
loggedDecrementCmd.undo();

// Показываем логи
console.log("\nЛоги выполнения:");
logger.getLogs().forEach((log) => {
  console.log(`${log.timestamp}: ${log.message}`);
});

// ===== ПРЕИМУЩЕСТВА И НЕДОСТАТКИ =====

/**
 * ПРЕИМУЩЕСТВА:
 * - Разделяет объект, вызывающий операцию, от объекта, который её выполняет
 * - Легко добавлять новые команды
 * - Поддерживает отмену операций
 * - Поддерживает логирование операций
 * - Позволяет создавать сложные команды из простых
 * - Поддерживает очередь команд
 *
 * НЕДОСТАТКИ:
 * - Может привести к созданию множества классов команд
 * - Усложняет архитектуру для простых случаев
 * - Может привести к накладным расходам на создание объектов команд
 *
 * СВЯЗИ С ДРУГИМИ ПАТТЕРНАМИ:
 * - Часто используется с Memento для сохранения состояния
 * - Может быть частью Chain of Responsibility
 * - Связан с Strategy pattern
 * - Используется в Template Method
 */
