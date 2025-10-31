/**
 * BRIDGE PATTERN (Паттерн Мост)
 *
 * Назначение: Разделяет абстракцию и реализацию так, чтобы они могли
 * изменяться независимо друг от друга. Паттерн устраняет жесткую привязку
 * между иерархиями классов, позволяя комбинировать их свободно.
 *
 * Идея: Абстракция хранит ссылку на объект-реализацию (Implementor) и
 * делегирует ему низкоуровневую работу. Клиент работает с абстракцией,
 * не зная деталей реализации.
 *
 * Когда использовать:
 * - Когда нужно разделить ответственность за высокоуровневое поведение и низкоуровневую реализацию
 * - Когда реализаций много и они часто меняются (или должны быть взаимозаменяемы)
 * - Когда нужно комбинировать разные абстракции с разными реализациями без взрыва количества классов
 * - Когда необходимо скрыть платформенные различия под единой абстракцией
 *
 * Примеры:
 * - Пульт (абстракция) и устройство (TV/Radio как реализации)
 * - Рендерер фигур (векторный/растровый) и фигуры (круг/квадрат)
 * - Логгер и бэкенды хранения (файл, БД, сеть)
 */

// ===================== БАЗОВЫЙ ПРИМЕР: ПУЛЬТ И УСТРОЙСТВО =====================

/**
 * Интерфейс реализации (Implementor)
 */
class Device {
  isEnabled() {
    throw new Error("isEnabled not implemented");
  }
  enable() {
    throw new Error("enable not implemented");
  }
  disable() {
    throw new Error("disable not implemented");
  }
  getVolume() {
    throw new Error("getVolume not implemented");
  }
  setVolume(v) {
    throw new Error("setVolume not implemented");
  }
  getChannel() {
    throw new Error("getChannel not implemented");
  }
  setChannel(c) {
    throw new Error("setChannel not implemented");
  }
  getName() {
    throw new Error("getName not implemented");
  }
}

class TV extends Device {
  constructor() {
    super();
    this.enabled = false;
    this.volume = 30;
    this.channel = 1;
  }
  isEnabled() {
    return this.enabled;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  getVolume() {
    return this.volume;
  }
  setVolume(v) {
    this.volume = Math.max(0, Math.min(100, v));
  }
  getChannel() {
    return this.channel;
  }
  setChannel(c) {
    this.channel = Math.max(1, c | 0);
  }
  getName() {
    return "TV";
  }
}

class Radio extends Device {
  constructor() {
    super();
    this.enabled = false;
    this.volume = 50;
    this.frequency = 101.1;
  }
  isEnabled() {
    return this.enabled;
  }
  enable() {
    this.enabled = true;
  }
  disable() {
    this.enabled = false;
  }
  getVolume() {
    return this.volume;
  }
  setVolume(v) {
    this.volume = Math.max(0, Math.min(100, v));
  }
  getChannel() {
    return this.frequency;
  }
  setChannel(freq) {
    this.frequency = Math.max(80.0, Math.min(120.0, Number(freq)));
  }
  getName() {
    return "Radio";
  }
}

/**
 * Абстракция (Abstraction)
 */
class RemoteControl {
  constructor(device) {
    this.device = device;
  }
  togglePower() {
    if (this.device.isEnabled()) {
      this.device.disable();
      console.log(`[Remote] Выключили ${this.device.getName()}`);
    } else {
      this.device.enable();
      console.log(`[Remote] Включили ${this.device.getName()}`);
    }
  }
  volumeDown() {
    this.device.setVolume(this.device.getVolume() - 10);
    console.log(
      `[Remote] Громкость ${this.device.getName()}: ${this.device.getVolume()}`
    );
  }
  volumeUp() {
    this.device.setVolume(this.device.getVolume() + 10);
    console.log(
      `[Remote] Громкость ${this.device.getName()}: ${this.device.getVolume()}`
    );
  }
  channelDown() {
    const ch = this.device.getChannel();
    this.device.setChannel(typeof ch === "number" ? ch - 1 : ch - 0.2);
    console.log(
      `[Remote] Канал/частота ${this.device.getName()}: ${this.device.getChannel()}`
    );
  }
  channelUp() {
    const ch = this.device.getChannel();
    this.device.setChannel(typeof ch === "number" ? ch + 1 : ch + 0.2);
    console.log(
      `[Remote] Канал/частота ${this.device.getName()}: ${this.device.getChannel()}`
    );
  }
}

/**
 * Уточненная абстракция (RefinedAbstraction)
 */
class AdvancedRemoteControl extends RemoteControl {
  mute() {
    this.device.setVolume(0);
    console.log(`[AdvancedRemote] Mute для ${this.device.getName()}`);
  }
  setChannel(ch) {
    this.device.setChannel(ch);
    console.log(
      `[AdvancedRemote] Установили канал/частоту ${this.device.getName()}: ${this.device.getChannel()}`
    );
  }
}

console.log("=== BRIDGE: базовый пример (Remote + Device) ===");
const tv = new TV();
const radio = new Radio();
const tvRemote = new RemoteControl(tv);
const radioRemote = new AdvancedRemoteControl(radio);

tvRemote.togglePower();
tvRemote.volumeUp();
tvRemote.channelUp();
radioRemote.togglePower();
radioRemote.volumeDown();
radioRemote.setChannel(99.5);
radioRemote.mute();

// ===================== ПРАКТИКА #1: ФИГУРЫ + РЕНДЕРЕР =====================

class Renderer {
  drawCircle(x, y, r) {
    throw new Error("drawCircle not implemented");
  }
  drawRectangle(x, y, w, h) {
    throw new Error("drawRectangle not implemented");
  }
}

class VectorRenderer extends Renderer {
  drawCircle(x, y, r) {
    console.log(`[VectorRenderer] Круг центр=(${x},${y}) r=${r}`);
  }
  drawRectangle(x, y, w, h) {
    console.log(`[VectorRenderer] Прямоугольник (${x},${y}, ${w}x${h})`);
  }
}

class RasterRenderer extends Renderer {
  drawCircle(x, y, r) {
    console.log(`[RasterRenderer] Рисуем пикселями круг r=${r} @ (${x},${y})`);
  }
  drawRectangle(x, y, w, h) {
    console.log(
      `[RasterRenderer] Рисуем пикселями прямоугольник ${w}x${h} @ (${x},${y})`
    );
  }
}

class Shape {
  constructor(renderer) {
    this.renderer = renderer;
  }
  draw() {
    throw new Error("draw not implemented");
  }
}

class Circle extends Shape {
  constructor(renderer, x, y, r) {
    super(renderer);
    this.x = x;
    this.y = y;
    this.r = r;
  }
  draw() {
    this.renderer.drawCircle(this.x, this.y, this.r);
  }
}

class Rectangle extends Shape {
  constructor(renderer, x, y, w, h) {
    super(renderer);
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  draw() {
    this.renderer.drawRectangle(this.x, this.y, this.w, this.h);
  }
}

console.log("\n=== BRIDGE: фигуры и рендерер ===");
const vector = new VectorRenderer();
const raster = new RasterRenderer();
new Circle(vector, 10, 10, 5).draw();
new Circle(raster, 20, 5, 10).draw();
new Rectangle(vector, 0, 0, 100, 50).draw();

// ===================== ПРЕИМУЩЕСТВА / НЕДОСТАТКИ / СВЯЗИ =====================

/**
 * Преимущества:
 * - Независимая эволюция абстракций и реализаций
 * - Снижение количества классов (вместо декартова произведения иерархий)
 * - Сокрытие платформенных/технических деталей за реализацией
 *
 * Недостатки:
 * - Усложнение кода из-за дополнительного уровня косвенности
 * - Могут возникать сложности в отладке при глубокой делегации
 *
 * Связи:
 * - Похож на Strategy, но у Bridge реализация является частью абстракции и может меняться в рантайме
 * - Часто используется с Abstract Factory для создания подходящих реализаций
 * - Сочетается с Adapter, если нужно подружить существующие реализации
 */
