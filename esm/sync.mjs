import { encryptSync, decryptSync } from "./functions.mjs";
/**
 * Сихронное шифрование по методу Кузнечик
 * @param data - шифруемые данные
 * @param masterkey - ключ
*/
export const encrypt = encryptSync;
/**
 * Сихронное дешифрование по методу Кузнечик
 * @param data - дешифруемые данные
 * @param masterkey - ключ
 * @param trimStart - убрать нули вначале (по умолчанию true)
*/
export const decrypt = decryptSync;
/**
 * Сихронное дешифрование по методу Кузнечик
 */
export default {
    encrypt: encryptSync,
    decrypt: decryptSync
};
