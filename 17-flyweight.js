/**
 * FLYWEIGHT PATTERN (Паттерн Приспособленец)
 *
 * Назначение: Экономит память, разделяя общее (внутреннее) состояние объектов
 * между множеством мелких однотипных объектов. Внешнее состояние хранится
 * снаружи и передается при вызовах.
 *
 * Идея: Разделяем тяжелые неизменяемые данные (intrinsic state) и легкие
 * изменяемые данные (extrinsic state). Общие данные кэшируем и переиспользуем.
 *
 * Когда использовать:
 * - Когда нужно создавать крайне много однотипных объектов (десятки/сотни тысяч)
 * - Когда большая часть состояния повторяется и может быть вынесена и разделена
 * - Когда критична экономия памяти и улучшение кэш-локальности
 *
 * Примеры:
 * - Рендер леса: тысячи деревьев с несколькими типами (текстуры/цвета общие)
 * - Текстовый редактор: символы используют общие глифы/шрифты
 * - Иконки/спрайты UI, кэширование стилей
 */

// ===================== БАЗОВЫЙ ПРИМЕР: СИМВОЛЫ ТЕКСТА =====================

class Glyph {
	constructor(char, fontFamily, fontSize, fontWeight) {
		this.char = char; // intrinsic (может быть ключом)
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.fontWeight = fontWeight;
	}
	draw(x, y, color) {
		console.log(`[Glyph] '${this.char}' @ (${x},${y}) font=${this.fontFamily} ${this.fontSize}px ${this.fontWeight} color=${color}`);
	}
}

class GlyphFactory {
	constructor() {
		this.cache = new Map(); // key -> Glyph
	}
	_key(char, fontFamily, fontSize, fontWeight) {
		return `${char}|${fontFamily}|${fontSize}|${fontWeight}`;
	}
	getGlyph(char, fontFamily = 'Arial', fontSize = 14, fontWeight = 'normal') {
		const key = this._key(char, fontFamily, fontSize, fontWeight);
		if (!this.cache.has(key)) {
			this.cache.set(key, new Glyph(char, fontFamily, fontSize, fontWeight));
		}
		return this.cache.get(key);
	}
	stats() {
		return { poolSize: this.cache.size };
	}
}

console.log('=== FLYWEIGHT: текстовые глифы ===');
const glyphs = new GlyphFactory();
const text = 'Flyweight pattern reduces memory';
let x = 0;
for (const ch of text) {
	const glyph = glyphs.getGlyph(ch, 'Inter', 14, 'normal'); // intrinsic
	glyph.draw(x, 10, '#333'); // extrinsic: позиция и цвет
	x += 8;
}
console.log('Размер пула глифов:', glyphs.stats());

// ===================== ПРАКТИКА #1: ЛЕС С ДЕРЕВЬЯМИ =====================

class TreeType {
	constructor(name, color, texture) {
		this.name = name;
		this.color = color;
		this.texture = texture; // тяжелые данные/изображение
	}
	draw(x, y) {
		console.log(`[TreeType] ${this.name} @ (${x},${y}), color=${this.color}, texture=${this.texture}`);
	}
}

class TreeFactory {
	constructor() { this.types = new Map(); }
	getTreeType(name, color, texture) {
		const key = `${name}|${color}|${texture}`;
		if (!this.types.has(key)) {
			this.types.set(key, new TreeType(name, color, texture));
		}
		return this.types.get(key);
	}
	stats() { return { types: this.types.size }; }
}

class Tree {
	constructor(x, y, type) {
		this.x = x; // extrinsic
		this.y = y; // extrinsic
		this.type = type; // shared intrinsic
	}
	draw() { this.type.draw(this.x, this.y); }
}

class Forest {
	constructor(factory = new TreeFactory()) {
		this.factory = factory;
		this.trees = [];
	}
	plantTree(x, y, name, color, texture) {
		const type = this.factory.getTreeType(name, color, texture);
		this.trees.push(new Tree(x, y, type));
	}
	draw() {
		for (const tree of this.trees) tree.draw();
	}
	stats() { return { instances: this.trees.length, ...this.factory.stats() }; }
}

console.log('\n=== FLYWEIGHT: лес ===');
const forest = new Forest();
for (let i = 0; i < 1000; i++) {
	const kind = i % 3 === 0 ? 'Oak' : i % 3 === 1 ? 'Pine' : 'Birch';
	const color = kind === 'Oak' ? 'green' : kind === 'Pine' ? 'darkgreen' : 'lightgreen';
	forest.plantTree(Math.random() * 500, Math.random() * 500, kind, color, `${kind}.png`);
}
forest.draw();
console.log('Статистика:', forest.stats());

// ===================== ПРАКТИКА #2: ИКОНКИ UI =====================

class Icon {
	constructor(name, svg) { this.name = name; this.svg = svg; }
	draw(x, y, scale = 1, color = '#000') {
		console.log(`[Icon] ${this.name} @ (${x},${y}) scale=${scale} color=${color}`);
	}
}

class IconFactory {
	constructor() { this.cache = new Map(); }
	getIcon(name) {
		if (!this.cache.has(name)) {
			// Имитируем загрузку SVG
			this.cache.set(name, new Icon(name, `<svg id="${name}">...</svg>`));
		}
		return this.cache.get(name);
	}
	stats() { return { icons: this.cache.size }; }
}

class IconButton {
	constructor(iconName, x, y, factory) {
		this.icon = factory.getIcon(iconName); // intrinsic
		this.x = x; this.y = y; // extrinsic
	}
	render() { this.icon.draw(this.x, this.y, 1, '#555'); }
}

console.log('\n=== FLYWEIGHT: иконки ===');
const iconFactory = new IconFactory();
const buttons = [];
['play','pause','stop','play','pause','settings','play'].forEach((name, i) => {
	buttons.push(new IconButton(name, i * 20, 0, iconFactory));
});
buttons.forEach(b => b.render());
console.log('Кэш иконок:', iconFactory.stats());

// ===================== ПРЕИМУЩЕСТВА / НЕДОСТАТКИ / СВЯЗИ =====================

/**
 * Преимущества:
 * - Существенно экономит память при большом количестве однотипных объектов
 * - Повышает производительность за счет кэширования и уменьшения аллокаций
 *
 * Недостатки:
 * - Усложняет код: требуется разделение состояний и управление внешним состоянием
 * - Возможны ошибки, если перепутать intrinsic/extrinsic ответственность
 * - Не подходит, если объекты действительно уникальны и почти не шарят состояния
 *
 * Связи:
 * - Часто используется вместе с Factory/Abstract Factory для выдачи кэшированных экземпляров
 * - Может дополнять Prototype, если создание базового образца дорого и его можно шарить
 */
