// Observer - уведомляет подписчиков об изменениях состояния объекта
const subject={ 
    ob:[], 
    subscribe:fn => subject.ob.push(fn), 
    notify:d => subject.ob.forEach(f=>f(d))
};
subject.subscribe(d=>d);
subject.notify('Hi');

// Strategy - инкапсулирует алгоритмы и делает их взаимозаменяемыми
const strategies={
    add:(a,b)=>a+b,
    mul:(a,b)=>a*b
};
strategies.add(2,3); // 5

// Command - превращает действия в объекты для управления ими
const command={ execute:() => 'method: save' };
command.execute();

// Mediator - централизует взаимодействие между объектами
const mediator = {
    c:{},
    subscribe:(ch,fn) => ( mediator.c[ch] = mediator.c[ch]||[] ).push(fn),
    notify:(ch,d)=>( mediator.c[ch]||[] ).forEach(f=>f(d))
};
mediator.subscribe('msg',d=>d); mediator.notify('msg','Hello');

// State - позволяет объекту менять поведение при смене состояния
const states={
    happy: () => ':)',
    sad: () => ':('
};
let current = states.happy; 
current(); // :)
current = states.sad; 
current(); // :(

// Chain of Responsibility - передает запрос по цепочке объектов, пока кто-то не обработает
const f1 = (n, next) => n > 0 ? 1 : next(n);
const f2 = (n) => 0;
f1(1,f2);

// Iterator - предоставляет способ последовательного доступа к элементам коллекции
const arr=[1,2]; 
const it = arr[Symbol.iterator](); 
it.next().value;

// Memento - сохраняет состояние объекта, чтобы его можно было восстановить
const objM = { state:1 }; 
const snap={ ...objM }; 
objM.state=2; 
snap.state;

// Template Method - определяет скелет алгоритма, оставляя детали подклассам
class Game {
    play = () => {
        this.start();
        this.end()};
        start=()=>1;
        end=()=>2
    }
new Game().play();

// Visitor - позволяет добавить операцию для объектов без изменения их классов
const elements = [{accept:v => v(this)}]; 
const visitor = { visit:e => 1 }; 
elements.forEach(e=>e.accept(visitor.visit));