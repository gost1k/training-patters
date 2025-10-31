/**
 * VISITOR PATTERN (Паттерн Посетитель)
 *
 * Назначение: Отделяет алгоритмы от структур данных, над которыми они
 * выполняются. Позволяет добавлять новые операции (алгоритмы), не изменяя
 * классы элементов, над которыми эти операции выполняются.
 *
 * Идея: Каждый элемент структуры "принимает" (accept) посетителя и вызывает
 * на нем метод, соответствующий конкретному типу элемента (двойная диспетчеризация).
 * Так посетитель получает доступ к данным элемента и реализует нужную операцию.
 *
 * Когда использовать:
 * - Когда нужно выполнять много разных операций над разнородными объектами сложной структуры
 * - Когда часто добавляются новые операции (но редко появляются новые типы элементов)
 * - Когда нужно централизовать операции, зависящие от конкретных типов элементов, чтобы не засорять сами элементы
 * - Когда необходимо произвести обход сложной структуры и выполнять контекстно-зависимые действия
 *
 * Примеры из жизни:
 * - Экспорт документов в разные форматы (HTML, Markdown, PDF)
 * - Анализ и трансформация AST в компиляторах/линтерах
 * - Обход файловой системы (подсчет размера, антивирусная проверка, резервное копирование)
 * - Обработка графов/сцен в игровых движках (рендер, физика, подсчет статистики)
 */

// ===================== БАЗОВЫЙ ПРИМЕР: ДОКУМЕНТ-ЭЛЕМЕНТЫ =====================

/**
 * Интерфейс элемента, принимающего посетителя
 */
class DocumentElement {
	accept(visitor) {
		throw new Error('Метод accept(visitor) должен быть переопределен');
	}
}

/**
 * Конкретные элементы документа
 */
class PlainText extends DocumentElement {
	constructor(text) {
		super();
		this.text = text;
	}

	accept(visitor) {
		return visitor.visitPlainText(this);
	}
}

class BoldText extends DocumentElement {
	constructor(text) {
		super();
		this.text = text;
	}

	accept(visitor) {
		return visitor.visitBoldText(this);
	}
}

class Link extends DocumentElement {
	constructor(text, url) {
		super();
		this.text = text;
		this.url = url;
	}

	accept(visitor) {
		return visitor.visitLink(this);
	}
}

class ImageElement extends DocumentElement {
	constructor(alt, src, width = 0, height = 0) {
		super();
		this.alt = alt;
		this.src = src;
		this.width = width;
		this.height = height;
	}

	accept(visitor) {
		return visitor.visitImage(this);
	}
}

/**
 * Интерфейс посетителя (операции над элементами)
 */
class DocumentVisitor {
	visitPlainText(element) {
		throw new Error('visitPlainText not implemented');
	}
	visitBoldText(element) {
		throw new Error('visitBoldText not implemented');
	}
	visitLink(element) {
		throw new Error('visitLink not implemented');
	}
	visitImage(element) {
		throw new Error('visitImage not implemented');
	}
}

/**
 * Конкретные посетители: рендер в HTML, извлечение текста, подсчет слов
 */
class HtmlRenderVisitor extends DocumentVisitor {
	visitPlainText(element) {
		return `<span>${escapeHtml(element.text)}</span>`;
	}
	visitBoldText(element) {
		return `<strong>${escapeHtml(element.text)}</strong>`;
	}
	visitLink(element) {
		const text = escapeHtml(element.text);
		const url = escapeHtml(element.url);
		return `<a href="${url}">${text}</a>`;
	}
	visitImage(element) {
		const alt = escapeHtml(element.alt);
		const src = escapeHtml(element.src);
		const size = element.width && element.height ? ` width="${element.width}" height="${element.height}"` : '';
		return `<img src="${src}" alt="${alt}"${size}/>`;
	}
}

class MarkdownRenderVisitor extends DocumentVisitor {
	visitPlainText(element) {
		return element.text;
	}
	visitBoldText(element) {
		return `**${element.text}**`;
	}
	visitLink(element) {
		return `[${element.text}](${element.url})`;
	}
	visitImage(element) {
		return `![${element.alt}](${element.src})`;
	}
}

class TextExtractVisitor extends DocumentVisitor {
	constructor() {
		super();
		this.collected = [];
	}
	visitPlainText(element) {
		this.collected.push(element.text);
		return element.text;
	}
	visitBoldText(element) {
		this.collected.push(element.text);
		return element.text;
	}
	visitLink(element) {
		this.collected.push(element.text);
		return element.text;
	}
	visitImage(element) {
		// Изображение текста не содержит; добавим alt как текстовое представление
		this.collected.push(element.alt);
		return element.alt;
	}
	getText() {
		return this.collected.join(' ');
	}
}

class WordCountVisitor extends DocumentVisitor {
	constructor() {
		super();
		this.count = 0;
	}
	static countWords(text) {
		if (!text) return 0;
		const tokens = text
			.replace(/[\n\r\t]+/g, ' ')
			.trim()
			.split(/\s+/);
		return tokens.filter(Boolean).length;
	}
	visitPlainText(element) {
		this.count += WordCountVisitor.countWords(element.text);
		return this.count;
	}
	visitBoldText(element) {
		this.count += WordCountVisitor.countWords(element.text);
		return this.count;
	}
	visitLink(element) {
		this.count += WordCountVisitor.countWords(element.text);
		return this.count;
	}
	visitImage(element) {
		this.count += WordCountVisitor.countWords(element.alt);
		return this.count;
	}
	getCount() {
		return this.count;
	}
}

// Утилита для экранирования HTML
function escapeHtml(str) {
	return String(str)
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&#39;');
}

console.log('=== VISITOR: базовый пример с документом ===');
const doc = [
	new PlainText('Привет, это текст.'),
	new BoldText('Важная часть'),
	new Link('ссылка', 'https://example.com'),
	new ImageElement('Логотип', '/logo.png', 64, 64)
];

const htmlVisitor = new HtmlRenderVisitor();
const mdVisitor = new MarkdownRenderVisitor();
const extractor = new TextExtractVisitor();
const wordCounter = new WordCountVisitor();

const html = doc.map(el => el.accept(htmlVisitor)).join('');
const md = doc.map(el => el.accept(mdVisitor)).join(' ');
doc.forEach(el => el.accept(extractor));
doc.forEach(el => el.accept(wordCounter));

console.log('HTML:', html);
console.log('Markdown:', md);
console.log('Сырый текст:', extractor.getText());
console.log('Количество слов:', wordCounter.getCount());

// ===================== ПРАКТИКА #1: ФАЙЛОВАЯ СИСТЕМА =====================

class FsElement {
	accept(visitor) {
		throw new Error('accept must be implemented');
	}
}

class FsFile extends FsElement {
	constructor(name, size) {
		super();
		this.name = name;
		this.size = size; // байты
	}
	accept(visitor) {
		return visitor.visitFsFile(this);
	}
}

class FsFolder extends FsElement {
	constructor(name) {
		super();
		this.name = name;
		this.children = [];
	}
	add(child) {
		this.children.push(child);
	}
	accept(visitor) {
		return visitor.visitFsFolder(this);
	}
}

class FileSystemVisitor {
	visitFsFile(file) { throw new Error('visitFsFile not implemented'); }
	visitFsFolder(folder) { throw new Error('visitFsFolder not implemented'); }
}

class SizeCalcVisitor extends FileSystemVisitor {
	constructor() {
		super();
		this.total = 0;
	}
	visitFsFile(file) {
		this.total += file.size;
		return file.size;
	}
	visitFsFolder(folder) {
		let sum = 0;
		for (const child of folder.children) {
			sum += child.accept(this) || 0;
		}
		return sum;
	}
	getTotal() { return this.total; }
}

class TreePrintVisitor extends FileSystemVisitor {
	constructor() {
		super();
		this.lines = [];
		this.level = 0;
	}
	indent() { return '  '.repeat(this.level); }
	visitFsFile(file) {
		this.lines.push(`${this.indent()}- ${file.name} (${file.size}b)`);
		return null;
	}
	visitFsFolder(folder) {
		this.lines.push(`${this.indent()}+ ${folder.name}/`);
		this.level++;
		for (const child of folder.children) {
			child.accept(this);
		}
		this.level--;
		return null;
	}
	toString() { return this.lines.join('\n'); }
}

console.log('\n=== VISITOR: файловая система ===');
const root = new FsFolder('root');
const docs = new FsFolder('docs');
const pics = new FsFolder('pics');
const f1 = new FsFile('readme.txt', 1200);
const f2 = new FsFile('cv.pdf', 230_000);
const img = new FsFile('photo.jpg', 2_048_576);
root.add(docs); root.add(pics);
docs.add(f1); docs.add(f2); pics.add(img);

const sizer = new SizeCalcVisitor();
root.accept(sizer);
const treePrinter = new TreePrintVisitor();
root.accept(treePrinter);

console.log('Размер всего:', sizer.getTotal(), 'байт');
console.log('Дерево:\n' + treePrinter.toString());

// ===================== ПРАКТИКА #2: AST (вычисление выражений) =====================

class AstNode {
	accept(visitor) { throw new Error('accept must be implemented'); }
}

class NumberNode extends AstNode {
	constructor(value) { super(); this.value = value; }
	accept(visitor) { return visitor.visitNumber(this); }
}

class AddNode extends AstNode {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	accept(visitor) { return visitor.visitAdd(this); }
}

class MulNode extends AstNode {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	accept(visitor) { return visitor.visitMul(this); }
}

class AstVisitor {
	visitNumber(node) { throw new Error('visitNumber not implemented'); }
	visitAdd(node) { throw new Error('visitAdd not implemented'); }
	visitMul(node) { throw new Error('visitMul not implemented'); }
}

class EvalVisitor extends AstVisitor {
	visitNumber(node) { return node.value; }
	visitAdd(node) { return node.left.accept(this) + node.right.accept(this); }
	visitMul(node) { return node.left.accept(this) * node.right.accept(this); }
}

class PrintVisitor extends AstVisitor {
	visitNumber(node) { return String(node.value); }
	visitAdd(node) { return `(${node.left.accept(this)} + ${node.right.accept(this)})`; }
	visitMul(node) { return `(${node.left.accept(this)} * ${node.right.accept(this)})`; }
}

class OptimizeVisitor extends AstVisitor {
	// Простейшие оптимизации констант и нулей/единиц
	visitNumber(node) { return node; }
	visitAdd(node) {
		const l = node.left.accept(this);
		const r = node.right.accept(this);
		if (l instanceof NumberNode && r instanceof NumberNode) {
			return new NumberNode(l.value + r.value);
		}
		if (l instanceof NumberNode && l.value === 0) return r;
		if (r instanceof NumberNode && r.value === 0) return l;
		return new AddNode(l, r);
	}
	visitMul(node) {
		const l = node.left.accept(this);
		const r = node.right.accept(this);
		if (l instanceof NumberNode && r instanceof NumberNode) {
			return new NumberNode(l.value * r.value);
		}
		if (l instanceof NumberNode && l.value === 0) return new NumberNode(0);
		if (r instanceof NumberNode && r.value === 0) return new NumberNode(0);
		if (l instanceof NumberNode && l.value === 1) return r;
		if (r instanceof NumberNode && r.value === 1) return l;
		return new MulNode(l, r);
	}
}

console.log('\n=== VISITOR: AST ===');
// (2 + 3) * (4 + 5)
const ast = new MulNode(
	new AddNode(new NumberNode(2), new NumberNode(3)),
	new AddNode(new NumberNode(4), new NumberNode(5))
);

const evaluator = new EvalVisitor();
const printer = new PrintVisitor();
const optimizer = new OptimizeVisitor();

console.log('Выражение:', ast.accept(printer));
console.log('Значение:', ast.accept(evaluator));
const optimized = ast.accept(optimizer);
console.log('Оптимизированное выражение:', optimized.accept(printer));
console.log('Оптимизированное значение:', optimized.accept(evaluator));

// ===================== ПРЕИМУЩЕСТВА / НЕДОСТАТКИ / СВЯЗИ =====================

/**
 * Преимущества:
 * - Легко добавлять новые операции (посетители), не меняя классы элементов
 * - Сосредотачивает связанную логику (операцию) в одном месте
 * - Упрощает обход сложных структур, позволяя хранить состояние обхода в посетителе
 *
 * Недостатки:
 * - Трудно добавлять новые виды элементов (нужно менять интерфейс Visitor и все его реализации)
 * - Меньшая инкапсуляция: посетителю может понадобиться доступ к внутреннему состоянию элементов
 * - Усложняет код при большом количестве типов элементов/операций
 *
 * Связи с другими паттернами:
 * - Часто используется совместно с Composite (обход древовидных структур)
 * - Имеет общие идеи с Iterator (обход), но Visitor переносит операции вне элементов
 * - Применяется в компиляторах вместе с Interpreter и Template Method
 */
