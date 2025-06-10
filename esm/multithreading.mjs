import { encryptChilds, decryptChilds } from "./functions.mjs";
/**
 * Многопоточное шифрование методом Кузнечик
 * @param data  - шифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 */
export const encrypt = encryptChilds;
/**
 * Многопоточное дешифрование методом Кузнечик
 * @param data  - дешифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 * @param trimStart - убрать нули вначале (по умолчанию true)
 */
export const decrypt = decryptChilds;
/**
 * Многопоточное дешифрование методом Кузнечик
 */
export default {
    encrypt: encryptChilds,
    decrypt: decryptChilds
};
