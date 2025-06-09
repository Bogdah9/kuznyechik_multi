"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EQ = exports.BUFF_TO_TEXT = void 0;
const node_crypto_1 = require("node:crypto");
const functions_cjs_1 = require("../functions.cjs");
const RANDOM_BLOCK = () => Buffer.from(Array.from({ length: 16 }).map((x, i) => (0, node_crypto_1.randomInt)(0, 255)));
const NUM_TO_HEX = (a) => a < 16 ? "0" + a.toString(16) : a.toString(16);
const BUFF_TO_TEXT = (a) => "[ " + Array.from(a).map(NUM_TO_HEX).join(' ') + " ]";
exports.BUFF_TO_TEXT = BUFF_TO_TEXT;
const EQ = (a, b) => {
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
};
exports.EQ = EQ;
/** Функция проверки работоспособности R преобразования и ему обратного */
function CHECKER_R() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности R преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + (0, exports.BUFF_TO_TEXT)(data));
    let R = (0, functions_cjs_1.R_TRANFORM)(data);
    console.log('\t ' + "R_TRANFORM      данные " + (0, exports.BUFF_TO_TEXT)(R));
    let RR = (0, functions_cjs_1.REV_R_TRANSFORM)(R);
    console.log('\t ' + "REV_R_TRANSFORM данные " + (0, exports.BUFF_TO_TEXT)(RR));
    console.log(((0, exports.EQ)(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности L преобразования и ему обратного */
function CHECKER_L() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности L преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + (0, exports.BUFF_TO_TEXT)(data));
    let R = (0, functions_cjs_1.L_TRANSFORM)(data);
    console.log('\t ' + "L_TRANSFORM     данные " + (0, exports.BUFF_TO_TEXT)(R));
    let RR = (0, functions_cjs_1.REV_L_TRANSFORM)(R);
    console.log('\t ' + "REV_L_TRANSFORM данные " + (0, exports.BUFF_TO_TEXT)(RR));
    console.log(((0, exports.EQ)(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности S преобразования и ему обратного */
function CHECKER_S() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности S преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + (0, exports.BUFF_TO_TEXT)(data));
    let R = (0, functions_cjs_1.S_TRANSFORM)(data);
    console.log('\t ' + "S_TRANSFORM     данные " + (0, exports.BUFF_TO_TEXT)(R));
    let RR = (0, functions_cjs_1.REV_S_TRANSFORM)(R);
    console.log('\t ' + "REV_S_TRANSFORM данные " + (0, exports.BUFF_TO_TEXT)(RR));
    console.log(((0, exports.EQ)(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности создания хеша */
function CHECKER_10HASH() {
    let data = RANDOM_BLOCK();
    let key = Buffer.concat([RANDOM_BLOCK(), RANDOM_BLOCK()]);
    let keys = (0, functions_cjs_1.EXPAND_KEYS)(key);
    keys.map(exports.BUFF_TO_TEXT).map((x) => console.log(x));
    console.log("\tФункция проверки работоспособности создания хеша");
    console.log('\t ' + "Ключ " + (0, exports.BUFF_TO_TEXT)(key) + "\n");
    console.log('\t ' + "Изначальные     данные " + (0, exports.BUFF_TO_TEXT)(data));
    let R = (0, functions_cjs_1.ROUNDS_10)(data, keys);
    console.log('\t ' + "ROUNDS_10       данные " + (0, exports.BUFF_TO_TEXT)(R));
    let RR = (0, functions_cjs_1.REV_ROUNDS_10)(R, keys);
    console.log('\t ' + "REV_ROUNDS_10   данные " + (0, exports.BUFF_TO_TEXT)(RR));
    // keys.keys.map(BUFF_TO_TEXT).map((x)=>console.log(x))
    console.log(((0, exports.EQ)(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
exports.default = () => {
    CHECKER_R();
    CHECKER_L();
    CHECKER_S();
    CHECKER_10HASH;
};
