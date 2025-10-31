/**
 * MEDIATOR PATTERN (Паттерн Посредник)
 *
 * Назначение: Инкапсулирует способ взаимодействия множества объектов,
 * устраняя их прямые зависимости и упрощая коммуникацию через единый объект.
 *
 * Идея: Объекты-коллеги не знают друг о друге напрямую. Вместо этого они
 * отправляют сообщения посреднику, который маршрутизирует их дальше.
 *
 * Когда использовать:
 * - Когда сложно поддерживать множество связей «каждый с каждым» между объектами
 * - Когда нужно централизовать бизнес-правила взаимодействия
 * - Когда нужно уменьшить связанность и облегчить повторное использование коллег
 *
 * Примеры:
 * - Чат-комната (чат-канал) и пользователи
 * - Окно диалога с виджетами (кнопки, поля) согласуют состояния через посредника
 * - Диспетчеризация в авиации (самолеты общаются через диспетчера)
 */

// ===================== БАЗОВЫЙ ПРИМЕР: ЧАТ-КОМНАТА =====================

class ChatMediator {
	register(user) { throw new Error('register not implemented'); }
	send(from, to, message) { throw new Error('send not implemented'); }
	broadcast(from, message) { throw new Error('broadcast not implemented'); }
}

class ChatRoom extends ChatMediator {
	constructor() {
		super();
		this.users = new Map(); // name -> User
	}
	register(user) {
		this.users.set(user.name, user);
		user.mediator = this;
	}
	send(from, to, message) {
		const receiver = this.users.get(to);
		if (receiver) {
			receiver.receive(from, message);
		}
	}
	broadcast(from, message) {
		for (const [name, user] of this.users) {
			if (name !== from) user.receive(from, message);
		}
	}
}

class ChatUser {
	constructor(name) { this.name = name; this.mediator = null; }
	send(to, message) {
		if (!this.mediator) throw new Error('User is not registered in a chat');
		console.log(`[Send] ${this.name} -> ${to}: ${message}`);
		this.mediator.send(this.name, to, message);
	}
	broadcast(message) {
		console.log(`[Broadcast] ${this.name}: ${message}`);
		this.mediator.broadcast(this.name, message);
	}
	receive(from, message) { console.log(`[Recv] ${this.name} <- ${from}: ${message}`); }
}

console.log('=== MEDIATOR: чат ===');
const room = new ChatRoom();
const alice = new ChatUser('Alice');
const bob = new ChatUser('Bob');
const charlie = new ChatUser('Charlie');
room.register(alice); room.register(bob); room.register(charlie);
alice.send('Bob', 'Привет!');
charlie.broadcast('Всем привет!');

// ===================== ПРАКТИКА #1: ДИАЛОГ С ВИДЖЕТАМИ =====================

class DialogMediator {
	constructor() { this.widgets = new Set(); }
	register(widget) { this.widgets.add(widget); widget.mediator = this; }
	notify(sender, event, payload) { throw new Error('notify not implemented'); }
}

class LoginDialog extends DialogMediator {
	constructor() {
		super();
		this.state = { username: '', password: '', remember: false };
	}
	notify(sender, event, payload) {
		if (sender instanceof TextBox && event === 'change') {
			this.state[sender.name] = payload;
			console.log(`[LoginDialog] ${sender.name} изменен: ${payload}`);
		}
		if (sender instanceof CheckBox && event === 'toggle') {
			this.state.remember = payload;
			console.log(`[LoginDialog] remember=${payload}`);
		}
		if (sender instanceof Button && event === 'click') {
			const { username, password } = this.state;
			if (username && password) {
				console.log('[LoginDialog] Авторизация...');
				// имитация
				console.log(`[LoginDialog] Добро пожаловать, ${username}!`);
			} else {
				console.log('[LoginDialog] Заполните имя и пароль');
			}
		}
	}
}

class Widget { constructor(name) { this.name = name; this.mediator = null; } }
class TextBox extends Widget {
	setValue(v) { this.value = v; this.mediator?.notify(this, 'change', v); }
}
class CheckBox extends Widget {
	setChecked(v) { this.checked = v; this.mediator?.notify(this, 'toggle', v); }
}
class Button extends Widget {
	click() { this.mediator?.notify(this, 'click'); }
}

console.log('\n=== MEDIATOR: диалог логина ===');
const dialog = new LoginDialog();
const username = new TextBox('username');
const password = new TextBox('password');
const remember = new CheckBox('remember');
const submit = new Button('submit');
[username, password, remember, submit].forEach(w => dialog.register(w));
username.setValue('admin');
password.setValue('1234');
remember.setChecked(true);
submit.click();

// ===================== ПРАЕИМУЩЕСТВА / НЕДОСТАТКИ / СВЯЗИ =====================

/**
 * Преимущества:
 * - Уменьшает связанность между коллегами
 * - Централизует и упрощает сложные протоколы взаимодействий
 * - Упрощает повторное использование отдельных компонентов
 *
 * Недостатки:
 * - Посредник может разрастись и стать «божественным объектом»
 * - Скрытая логика маршрутизации усложняет отладку
 *
 * Связи:
 * - Часто используется вместе с Observer (последний может быть реализацией доставки событий посреднику)
 * - Может дополнять Colleague-объекты, реализованные через Strategy/State
 */
