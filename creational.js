// Singleton - гарантирует, что существует только один экземпляр объекта
const Singleton = (() => {
  let instance;
  return () => instance || (instance = { value: Math.random() });
})();
Singleton() === Singleton();


// Factory Method - создает объекты, не указывая конкретный класс
const createUser = (role) =>
  role === 'admin'
    ? { role, right: ['*'] }
    : { role, right: ['read'] };
createUser('admin');

// Abstract Factory - предоставляет интерфейс для создания семейств связанных объектов
const macFactory = { createButton: () => 'MacButton' };
const winFactory = { createButton: () => 'WinButton' };
const createGUI = f => ({ button: f.createButton() });
createGUI(macFactory);


// Builder - поэтапная сборка сложного объекта
class CarBuilder {
  constructor() { this.car={} }
  setColor = (c) => { this.car.color=c; return this }
  setSeats = (s) => { this.car.seats=s; return this }
  build => this.car
}
new CarBuilder().setColor('red').setSeats(4).build();


// Prototype - создание новых объектов на основе существующего
const proto = { greet: () => 'Hi' };
const obj = Object.create(proto);
obj.greet(); // Hi