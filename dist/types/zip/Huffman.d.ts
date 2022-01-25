export declare class Huffman {
}
export declare class Found extends Huffman {
    readonly n: number;
    constructor(n: number);
}
export declare class NeedBit extends Huffman {
    readonly left: Huffman;
    readonly right: Huffman;
    constructor(left: Huffman, right: Huffman);
}
export declare class NeedBits extends Huffman {
    readonly n: number;
    readonly table: Huffman[];
    constructor(n: number, table: Huffman[]);
}
