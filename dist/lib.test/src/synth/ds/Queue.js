export class Queue {
    constructor() {
        this._items = [];
        this._position = 0;
        this.isEmpty = true;
    }
    clear() {
        this._items = [];
        this._position = 0;
        this.isEmpty = true;
    }
    enqueue(item) {
        this.isEmpty = false;
        this._items.push(item);
    }
    peek() {
        return this._items[this._position];
    }
    dequeue() {
        const item = this._items[this._position];
        this._position++;
        if (this._position >= this._items.length / 2) {
            this._items = this._items.slice(this._position);
            this._position = 0;
        }
        this.isEmpty = this._items.length == 0;
        return item;
    }
    toArray() {
        const items = this._items.slice(this._position);
        items.reverse();
        return items;
    }
}
//# sourceMappingURL=Queue.js.map