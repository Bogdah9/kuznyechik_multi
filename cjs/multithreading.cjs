"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const functions_cjs_1 = require("./functions.cjs");
/**
 * Многопоточное шифрование методом Кузнечик
 * @param data  - шифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 */
exports.encrypt = functions_cjs_1.encryptChilds;
/**
 * Многопоточное дешифрование методом Кузнечик
 * @param data  - дешифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 * @param trimStart - убрать нули вначале (по умолчанию true)
 */
exports.decrypt = functions_cjs_1.decryptChilds;
/**
 * Многопоточное дешифрование методом Кузнечик
 */
exports.default = {
    encrypt: functions_cjs_1.encryptChilds,
    decrypt: functions_cjs_1.decryptChilds
};
