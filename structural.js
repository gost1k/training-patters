// Adapter - преобразует интерфейс объекта к нужному виду
const oldApi = () => 'fetch(`url`)';
const adapter = () => ({ newMethod: oldApi });
adapter().newMethod(); // fetch(`url`)


// Decorator - добавляет функциональность объекту без изменения его кода
const greet = () => 'Hello';
const excitedGreet = () => greet() + 'world!';
excitedGreet(); // Hellow world


// Proxy - контроль доступа к объекту или изменение поведения
const objProxy = { a: 1 };
const proxy = new Proxy(objProxy, { get:(t,p) => t[p]*2 });
proxy.a; // 2


// Facade - упрощает работу с сложной системой, объединяя интерфейсы
const cpu = { start:() => 1 }, 
const mem = { load:() => 2 };
const computer={ start:() => [cpu.start(), mem.load()] };
computer.start();


// Bridge - разделяет абстракцию и реализацию, чтобы их менять независимо
class Renderer { render = (x) => `Render ${x}` }
class Shape { 
    constructor(r) { this.r=r } 
    draw = () => this.r.render('shape') 
}
new Shape(new Renderer()).draw();


// Composite - позволяет работать с группой объектов как с одним объектом
class Leaf { draw => 'Leaf' }
class Composite { 
    constructor() { this.children=[] } 
    add = (c) => this.children.push(c) 
    draw = () => this.children.map(c=>c.draw()).join(',') 
}
const tree = new Composite(); 
tree.add(new Leaf()); 
tree.draw();


// Flyweight - уменьшение расхода памяти за счет совместного использования объектов
const flyweights = {};
const getFlyweight = (k) => flyweights[k] || (flyweights[k]={k});
getFlyweight('a') === getFlyweight('a');