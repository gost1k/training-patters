/**
 * INTERPRETER PATTERN (Паттерн Интерпретатор)
 *
 * Назначение: Определяет представление грамматики простого языка и
 * интерпретатор, который использует это представление для интерпретации
 * предложений языка.
 *
 * Идея: Для каждой грамматической конструкции создается класс выражения,
 * реализующий метод interpret(context). Композиция классов образует AST.
 *
 * Когда использовать:
 * - Язык простой, грамматика стабильная, объем выражений небольшой
 * - Нужна расширяемость семантики и поддержка разных интерпретаций
 * - Нужна читаемая и тестируемая модель выражений
 */

// ===================== МАТЕМАТИЧЕСКИЙ ЯЗЫК =====================

class Context {
	constructor(variables = {}) { this.variables = { ...variables }; }
	get(name) { return this.variables[name]; }
	set(name, value) { this.variables[name] = value; }
}

class Expression { interpret(ctx) { throw new Error('interpret not implemented'); } }

class NumberExpr extends Expression {
	constructor(value) { super(); this.value = Number(value); }
	interpret() { return this.value; }
}

class VariableExpr extends Expression {
	constructor(name) { super(); this.name = name; }
	interpret(ctx) { const v = ctx.get(this.name); if (v === undefined) throw new Error(`Переменная ${this.name} не определена`); return v; }
}

class AddExpr extends Expression {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	interpret(ctx) { return this.left.interpret(ctx) + this.right.interpret(ctx); }
}
class SubExpr extends Expression {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	interpret(ctx) { return this.left.interpret(ctx) - this.right.interpret(ctx); }
}
class MulExpr extends Expression {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	interpret(ctx) { return this.left.interpret(ctx) * this.right.interpret(ctx); }
}
class DivExpr extends Expression {
	constructor(left, right) { super(); this.left = left; this.right = right; }
	interpret(ctx) { return this.left.interpret(ctx) / this.right.interpret(ctx); }
}

// Простейший парсер инфиксных выражений с приоритетами (+,-,*,/), числа и переменные
class Parser {
	constructor(input) { this.tokens = Parser.tokenize(input); this.pos = 0; }
	static tokenize(s) {
		return s.match(/[A-Za-z_][A-Za-z0-9_]*|\d+\.?\d*|[()+\-*/]/g) || [];
	}
	peek() { return this.tokens[this.pos]; }
	next() { return this.tokens[this.pos++]; }
	parseExpression() { return this.parseAddSub(); }
	parseAddSub() {
		let node = this.parseMulDiv();
		while (this.peek() === '+' || this.peek() === '-') {
			const op = this.next();
			const right = this.parseMulDiv();
			node = op === '+' ? new AddExpr(node, right) : new SubExpr(node, right);
		}
		return node;
	}
	parseMulDiv() {
		let node = this.parsePrimary();
		while (this.peek() === '*' || this.peek() === '/') {
			const op = this.next();
			const right = this.parsePrimary();
			node = op === '*' ? new MulExpr(node, right) : new DivExpr(node, right);
		}
		return node;
	}
	parsePrimary() {
		const t = this.next();
		if (t === '(') {
			const expr = this.parseExpression();
			if (this.next() !== ')') throw new Error('Ожидалась )');
			return expr;
		}
		if (/^\d/.test(t)) return new NumberExpr(t);
		if (/^[A-Za-z_]/.test(t)) return new VariableExpr(t);
		throw new Error(`Неожиданный токен: ${t}`);
	}
}

console.log('=== INTERPRETER: математика ===');
const ctx = new Context({ x: 2, y: 3 });
const expr = new Parser('2 + x * (y + 5) / 2').parseExpression();
console.log('Результат:', expr.interpret(ctx));

// ===================== ЛОГИЧЕСКИЕ ВЫРАЖЕНИЯ =====================

class BoolContext extends Context {}
class BoolExpression extends Expression {}
class BoolLiteral extends BoolExpression { constructor(v) { super(); this.v = !!v; } interpret() { return this.v; } }
class BoolVar extends BoolExpression { constructor(name) { super(); this.name = name; } interpret(ctx) { return !!ctx.get(this.name); } }
class AndExpr extends BoolExpression { constructor(l, r) { super(); this.l = l; this.r = r; } interpret(ctx) { return this.l.interpret(ctx) && this.r.interpret(ctx); } }
class OrExpr extends BoolExpression { constructor(l, r) { super(); this.l = l; this.r = r; } interpret(ctx) { return this.l.interpret(ctx) || this.r.interpret(ctx); } }
class NotExpr extends BoolExpression { constructor(e) { super(); this.e = e; } interpret(ctx) { return !this.e.interpret(ctx); } }

console.log('\n=== INTERPRETER: логика ===');
const bctx = new BoolContext({ admin: true, paid: false });
const rule = new AndExpr(new BoolVar('admin'), new NotExpr(new BoolVar('banned')));
console.log('Правило доступа:', rule.interpret(bctx));

// ===================== ПРЕИМУЩЕСТВА / НЕДОСТАТКИ / СВЯЗИ =====================

/**
 * Преимущества:
 * - Простое добавление новых правил/операций через новые классы выражений
 * - Читаемый AST, удобный для тестирования и отладки
 *
 * Недостатки:
 * - Взрыв количества классов при сложной грамматике
 * - Низкая производительность по сравнению с генераторами парсеров
 *
 * Связи:
 * - Часто используется вместе с Visitor для обхода/анализа AST
 * - Сопровождается Composite (дерево выражений)
 */
