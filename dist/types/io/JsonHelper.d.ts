/**
 * @partial
 */
export declare class JsonHelper {
    /**
     * @target web
     * @partial
     */
    static parseEnum<T>(s: unknown, enumType: any): T | null;
    /**
     * @target web
     * @partial
     */
    static forEach(s: unknown, func: (v: unknown, k: string) => void): void;
}
