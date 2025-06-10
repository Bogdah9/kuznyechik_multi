"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = exports.multithreading = exports.async = void 0;
const functions_cjs_1 = require("./functions.cjs");
/**
 * Асинхронное дешифрование по методу Кузнечик
 */
exports.async = {
    encrypt: functions_cjs_1.encryptAsync,
    decrypt: functions_cjs_1.decryptAsync,
};
/**
 * Многопоточное дешифрование методом Кузнечик
 */
exports.multithreading = {
    encrypt: functions_cjs_1.encryptChilds,
    decrypt: functions_cjs_1.decryptChilds,
};
/**
 * Сихронное шифрование по методу Кузнечик
 */
exports.sync = {
    encrypt: functions_cjs_1.encryptSync,
    decrypt: functions_cjs_1.decryptSync,
};
/**
 * Шифрование по методу Кузнечик
 */
exports.default = {
    async: exports.async,
    sync: exports.sync,
    multithreading: exports.multithreading
};
