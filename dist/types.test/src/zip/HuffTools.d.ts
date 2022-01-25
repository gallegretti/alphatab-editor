import { Huffman } from '@src/zip/Huffman';
export declare class HuffTools {
    static make(lengths: number[], pos: number, nlengths: number, maxbits: number): Huffman;
    private static treeMake;
    private static treeCompress;
    private static treeWalk;
    private static treeDepth;
}
