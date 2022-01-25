import { PendingBuffer } from './PendingBuffer';
export declare class DeflaterHuffman {
    private static readonly BUFSIZE;
    private static readonly LITERAL_NUM;
    /**
     * Written to Zip file to identify a stored block
     */
    static readonly STORED_BLOCK = 0;
    /**
     * Identifies static tree in Zip file
     */
    static readonly STATIC_TREES = 1;
    /**
     * Identifies dynamic tree in Zip file
     */
    static readonly DYN_TREES = 2;
    private static readonly DIST_NUM;
    private static staticLCodes;
    private static staticLLength;
    private static staticDCodes;
    private static staticDLength;
    static staticInit(): void;
    private static readonly BL_ORDER;
    private static readonly bit4Reverse;
    /**
     * Reverse the bits of a 16 bit value.
     * @param toReverse Value to reverse bits
     * @returns Value with bits reversed
     */
    static bitReverse(toReverse: number): number;
    private static readonly BITLEN_NUM;
    private static readonly EOF_SYMBOL;
    /**
     * Pending buffer to use
     */
    pending: PendingBuffer;
    private literalTree;
    private distTree;
    private blTree;
    private d_buf;
    private l_buf;
    private last_lit;
    private extra_bits;
    constructor(pending: PendingBuffer);
    isFull(): boolean;
    reset(): void;
    flushStoredBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void;
    flushBlock(stored: Uint8Array, storedOffset: number, storedLength: number, lastBlock: boolean): void;
    /**
     * Write all trees to pending buffer
     * @param blTreeCodes The number/rank of treecodes to send.
     */
    sendAllTrees(blTreeCodes: number): void;
    /**
     * Compress current buffer writing data to pending buffer
     */
    compressBlock(): void;
    /**
     * Add distance code and length to literal and distance trees
     * @param distance Distance code
     * @param length Length
     * @returns Value indicating if internal buffer is full
     */
    tallyDist(distance: number, length: number): boolean;
    /**
     * Add literal to buffer
     * @param literal Literal value to add to buffer
     * @returns Value indicating internal buffer is full
     */
    tallyLit(literal: number): boolean;
    private static Lcode;
    private static Dcode;
}
