"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sync = exports.multithreading = exports.async = void 0;
const functions_cjs_1 = require("./functions.cjs");
exports.async = {
    encrypt: functions_cjs_1.encryptAsync,
    decrypt: functions_cjs_1.decryptAsync,
};
exports.multithreading = {
    encrypt: functions_cjs_1.encryptChilds,
    decrypt: functions_cjs_1.decryptChilds,
};
exports.sync = {
    encrypt: functions_cjs_1.encryptSync,
    decrypt: functions_cjs_1.decryptSync,
};
exports.default = {
    async: exports.async,
    sync: exports.sync,
    multithreading: exports.multithreading
};
