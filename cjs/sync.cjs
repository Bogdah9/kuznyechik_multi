"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const functions_cjs_1 = require("./functions.cjs");
/**
 * Сихронное шифрование по методу Кузнечик
 * @param data - шифруемые данные
 * @param masterkey - ключ
*/
exports.encrypt = functions_cjs_1.encryptSync;
/**
 * Сихронное дешифрование по методу Кузнечик
 * @param data - дешифруемые данные
 * @param masterkey - ключ
 * @param trimStart - убрать нули вначале (по умолчанию true)
*/
exports.decrypt = functions_cjs_1.decryptSync;
/**
 * Сихронное дешифрование по методу Кузнечик
 */
exports.default = {
    encrypt: functions_cjs_1.encryptSync,
    decrypt: functions_cjs_1.decryptSync
};
