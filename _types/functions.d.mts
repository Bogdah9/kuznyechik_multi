/**
 * Сложение/вычетание в поле Галуа эквивалент XOR
 *
 * XOR (исключающее или) для буферов, возвращает сам буфер
 */
export declare const XOR: (a: Buffer | Array<number>, b: Buffer) => Buffer;
/**
 * Умножение в поле Галуа по модулю неприводимого многочлена x^{8}+x^{7}+x^{6}+x+1}
 */
export declare const GALOIS_MULT: (a: number, b: number) => number;
/**
 * S преобразование
 *
 * Операция замены байтов путем применения нелинейной биективного преобразования
 */
export declare const S_TRANSFORM: (buf: Buffer) => Buffer;
/**
 * R преобразование
 *
 * Умножение + сдвиг
 */
export declare const R_TRANFORM: (buf: Buffer) => Buffer;
/**
 * Обратное R преобразование
 */
export declare const REV_R_TRANSFORM: (buf: Buffer) => Buffer<ArrayBuffer>;
/**
 * Обратное S преобразование
 *
 * Обратная операция замены байтов путем применения нелинейной биективного преобразования
 */
export declare const REV_S_TRANSFORM: (buf: Buffer) => Buffer<ArrayBuffer>;
/**L (линейное) преобразование  */
export declare const L_TRANSFORM: (buf: Buffer) => Buffer;
/**Обратное L (линейное) преобразование  */
export declare const REV_L_TRANSFORM: (buf: Buffer) => Buffer<ArrayBuffer>;
/** Преобразования ячейки Фейстеля */
export declare const FEISTEL_NETWORK: (key1: Buffer, key2: Buffer, iterC: Buffer) => [Buffer, Buffer];
/** Расчет раундовых ключей */
export declare const EXPAND_KEYS: (masterkey: Buffer) => Buffer[];
export declare function ROUNDS_10(block: Array<number> | Buffer, keys: Buffer[]): Buffer<ArrayBufferLike>;
export declare function REV_ROUNDS_10(block: Array<number> | Buffer, keys: Buffer[]): Buffer<ArrayBufferLike>;
export declare const encryptSync: (data: Buffer, masterkey: string | Buffer) => Buffer;
/**Асинхронное шифрование по методу Кузнечик */
export declare function encryptAsync(data: Buffer, masterkey: string | Buffer): Promise<Buffer>;
/**Асинхронное дешифрование по методу Кузнечик */
export declare function decryptAsync(data: Buffer, masterkey: string | Buffer, trimStart?: boolean): Promise<Buffer>;
export declare const decryptSync: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
/**Многопоточное шифрование по методу Кузнечик */
export declare const encryptChilds: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
/**Многопоточное дешифрование по методу Кузнечик */
export declare const decryptChilds: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
