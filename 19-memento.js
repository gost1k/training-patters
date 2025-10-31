/**
 * MEMENTO PATTERN (Паттерн Снимок)
 *
 * Назначение: Фиксирует и восстанавливает внутреннее состояние объекта
 * без нарушения инкапсуляции. Позволяет реализовать undo/redo.
 *
 * Идея: Originator создает неизменяемый снимок (Memento) своего состояния.
 * Caretaker хранит снимки и управляет откатами/повторами, не заглядывая внутрь.
 *
 * Когда использовать:
 * - Нужна отмена действий (undo) и/или повтор (redo)
 * - Нужно безопасно сохранять версии состояния
 * - Важно не нарушать инкапсуляцию Originator
 */

// ===================== БАЗОВАЯ РЕАЛИЗАЦИЯ =====================

class Memento {
	constructor(state) {
		// Делаем состояние неизменяемым (глубокая копия для примера)
		this._state = JSON.parse(JSON.stringify(state));
		this._createdAt = new Date();
	}
	getState() { return JSON.parse(JSON.stringify(this._state)); }
	getCreatedAt() { return this._createdAt; }
}

class Originator {
	constructor(initialState = {}) {
		this._state = { ...initialState };
	}
	setState(partial) {
		this._state = { ...this._state, ...partial };
	}
	getState() { return { ...this._state }; }
	createMemento() { return new Memento(this._state); }
	restore(memento) { this._state = memento.getState(); }
}

class Caretaker {
	constructor(originator) {
		this.originator = originator;
		this.undoStack = [];
		this.redoStack = [];
	}
	save() {
		this.undoStack.push(this.originator.createMemento());
		this.redoStack = [];
	}
	undo() {
		if (this.undoStack.length === 0) return false;
		const m = this.undoStack.pop();
		this.redoStack.push(this.originator.createMemento());
		this.originator.restore(m);
		return true;
	}
	redo() {
		if (this.redoStack.length === 0) return false;
		const m = this.redoStack.pop();
		this.undoStack.push(this.originator.createMemento());
		this.originator.restore(m);
		return true;
	}
	stats() { return { undo: this.undoStack.length, redo: this.redoStack.length }; }
}

console.log('=== MEMENTO: базовый пример ===');
const origin = new Originator({ a: 1, b: 2 });
const caretaker = new Caretaker(origin);
caretaker.save();
origin.setState({ a: 10 });
caretaker.save();
origin.setState({ b: 20 });
console.log('Состояние:', origin.getState(), 'Стек:', caretaker.stats());
caretaker.undo();
console.log('После undo:', origin.getState(), 'Стек:', caretaker.stats());
caretaker.redo();
console.log('После redo:', origin.getState(), 'Стек:', caretaker.stats());

// ===================== ПРАКТИКА: ТЕКСТОВЫЙ РЕДАКТОР С UNDO/REDO =====================

class TextEditor {
	constructor() {
		this._content = '';
		this._selection = { start: 0, end: 0 };
		this._clipboard = '';
	}
	insert(text) {
		const { start, end } = this._selection;
		this._content = this._content.slice(0, start) + text + this._content.slice(end);
		const pos = start + text.length;
		this._selection = { start: pos, end: pos };
	}
	select(start, end) { this._selection = { start, end }; }
	copy() { const { start, end } = this._selection; this._clipboard = this._content.slice(start, end); }
	paste() { this.insert(this._clipboard); }
	delete() { this.insert(''); }
	getText() { return this._content; }
	getState() { return { content: this._content, selection: { ...this._selection }, clipboard: this._clipboard }; }
	setState(state) {
		this._content = state.content;
		this._selection = { ...state.selection };
		this._clipboard = state.clipboard;
	}
	createMemento() { return new Memento(this.getState()); }
	restore(m) { this.setState(m.getState()); }
}

class EditorHistory {
	constructor(editor) { this.editor = editor; this.undoStack = []; this.redoStack = []; }
	save() { this.undoStack.push(this.editor.createMemento()); this.redoStack = []; }
	undo() { if (!this.undoStack.length) return false; const m = this.undoStack.pop(); this.redoStack.push(this.editor.createMemento()); this.editor.restore(m); return true; }
	redo() { if (!this.redoStack.length) return false; const m = this.redoStack.pop(); this.undoStack.push(this.editor.createMemento()); this.editor.restore(m); return true; }
}

console.log('\n=== MEMENTO: текстовый редактор ===');
const editor = new TextEditor();
const history = new EditorHistory(editor);

history.save();
editor.insert('Hello');
history.save();
editor.insert(' World');
console.log('Текст:', editor.getText());

editor.select(6, 11);
editor.copy();
editor.select(11, 11);
history.save();
editor.paste();
console.log('После paste:', editor.getText());

history.undo();
console.log('После undo:', editor.getText());

history.redo();
console.log('После redo:', editor.getText());

/**
 * Преимущества:
 * - Реализация undo/redo без нарушения инкапсуляции
 * - Простая сериализация состояний
 *
 * Недостатки:
 * - Память: хранение множества снимков
 * - Нужно решать, насколько глубоко копировать состояние
 *
 * Связи:
 * - Часто сочетается с Command (команды создают снимки перед выполнением)
 * - Может использоваться с Prototype при клонировании состояния
 */
