import { encryptAsync, encryptSync, encryptChilds, decryptSync, decryptAsync, decryptChilds } from "./functions.mjs";
/**
 * Асинхронное дешифрование по методу Кузнечик
 */
export const async = {
    encrypt: encryptAsync,
    decrypt: decryptAsync,
};
/**
 * Многопоточное дешифрование методом Кузнечик
 */
export const multithreading = {
    encrypt: encryptChilds,
    decrypt: decryptChilds,
};
/**
 * Сихронное шифрование по методу Кузнечик
 */
export const sync = {
    encrypt: encryptSync,
    decrypt: decryptSync,
};
/**
 * Шифрование по методу Кузнечик
 */
export default {
    async: async,
    sync: sync,
    multithreading: multithreading
};
