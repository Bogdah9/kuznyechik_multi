/**
 * Сихронное шифрование по методу Кузнечик
 * @param data - шифруемые данные
 * @param masterkey - ключ
*/
export declare const encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
/**
 * Сихронное дешифрование по методу Кузнечик
 * @param data - дешифруемые данные
 * @param masterkey - ключ
 * @param trimStart - убрать нули вначале (по умолчанию true)
*/
export declare const decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
/**
 * Сихронное дешифрование по методу Кузнечик
 */
declare const _default: {
    encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
    decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
};
export default _default;
