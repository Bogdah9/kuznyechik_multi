import { encryptAsync, decryptAsync } from "./functions.mjs";
/**
 * Асинхронное шифрование по методу Кузнечик
 * @param data - шифруемые данные
 * @param masterkey - ключ
*/
export declare const encrypt: typeof encryptAsync;
/**
 * Асинхронное дешифрование по методу Кузнечик
 * @param data - дешифруемые данные
 * @param masterkey - ключ
 * @param trimStart - убрать нули вначале (по умолчанию true)
*/
export declare const decrypt: typeof decryptAsync;
/**
  * Асинхронное шифрование по методу Кузнечик
 */
declare const _default: {
    encrypt: typeof encryptAsync;
    decrypt: typeof decryptAsync;
};
export default _default;
