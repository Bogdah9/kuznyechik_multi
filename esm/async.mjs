import { encryptAsync, decryptAsync } from "./functions.mjs";
/**
 * Асинхронное шифрование по методу Кузнечик
 * @param data - шифруемые данные
 * @param masterkey - ключ
*/
export const encrypt = encryptAsync;
/**
 * Асинхронное дешифрование по методу Кузнечик
 * @param data - дешифруемые данные
 * @param masterkey - ключ
 * @param trimStart - убрать нули вначале (по умолчанию true)
*/
export const decrypt = decryptAsync;
/**
  * Асинхронное шифрование по методу Кузнечик
 */
export default {
    encrypt: encryptAsync,
    decrypt: decryptAsync
};
