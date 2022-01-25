/**
 * @partial
 */
export declare class TestPlatform {
    /**
     * @target web
     * @partial
     */
    static saveFile(name: string, data: Uint8Array): Promise<void>;
    /**
     * @target web
     * @partial
     */
    static loadFile(path: string): Promise<Uint8Array>;
    /**
     * @target web
     * @partial
     */
    static listDirectory(path: string): Promise<string[]>;
    static loadFileAsString(path: string): Promise<string>;
    static changeExtension(file: string, extension: string): string;
}
