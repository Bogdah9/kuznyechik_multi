import { encryptAsync, decryptAsync } from "./functions.mjs";
/**
 * Асинхронное дешифрование по методу Кузнечик
 */
export declare const async: {
    encrypt: typeof encryptAsync;
    decrypt: typeof decryptAsync;
};
/**
 * Многопоточное дешифрование методом Кузнечик
 */
export declare const multithreading: {
    encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
    decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
};
/**
 * Сихронное шифрование по методу Кузнечик
 */
export declare const sync: {
    encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
    decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
};
/**
 * Шифрование по методу Кузнечик
 */
declare const _default: {
    async: {
        encrypt: typeof encryptAsync;
        decrypt: typeof decryptAsync;
    };
    sync: {
        encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
        decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
    };
    multithreading: {
        encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
        decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
    };
};
export default _default;
