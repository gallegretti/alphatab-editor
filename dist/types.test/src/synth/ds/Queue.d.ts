export declare class Queue<T> {
    private _items;
    private _position;
    isEmpty: boolean;
    clear(): void;
    enqueue(item: T): void;
    peek(): T;
    dequeue(): T;
    toArray(): T[];
}
