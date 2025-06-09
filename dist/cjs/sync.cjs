"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const functions_cjs_1 = require("./functions.cjs");
exports.encrypt = functions_cjs_1.encryptSync;
exports.decrypt = functions_cjs_1.decryptSync;
exports.default = {
    encrypt: functions_cjs_1.encryptSync,
    decrypt: functions_cjs_1.decryptSync
};
