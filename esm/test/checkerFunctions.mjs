import { randomInt } from "node:crypto";
import { EXPAND_KEYS, L_TRANSFORM, R_TRANFORM, REV_L_TRANSFORM, REV_R_TRANSFORM, REV_ROUNDS_10, REV_S_TRANSFORM, ROUNDS_10, S_TRANSFORM } from "../functions.mjs";
const RANDOM_BLOCK = () => Buffer.from(Array.from({ length: 16 }).map((x, i) => randomInt(0, 255)));
const NUM_TO_HEX = (a) => a < 16 ? "0" + a.toString(16) : a.toString(16);
export const BUFF_TO_TEXT = (a) => "[ " + Array.from(a).map(NUM_TO_HEX).join(' ') + " ]";
export const EQ = (a, b) => {
    for (let i = 0; i < a.length; i++)
        if (a[i] !== b[i])
            return false;
    return true;
};
/** Функция проверки работоспособности R преобразования и ему обратного */
function CHECKER_R() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности R преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + BUFF_TO_TEXT(data));
    let R = R_TRANFORM(data);
    console.log('\t ' + "R_TRANFORM      данные " + BUFF_TO_TEXT(R));
    let RR = REV_R_TRANSFORM(R);
    console.log('\t ' + "REV_R_TRANSFORM данные " + BUFF_TO_TEXT(RR));
    console.log((EQ(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности L преобразования и ему обратного */
function CHECKER_L() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности L преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + BUFF_TO_TEXT(data));
    let R = L_TRANSFORM(data);
    console.log('\t ' + "L_TRANSFORM     данные " + BUFF_TO_TEXT(R));
    let RR = REV_L_TRANSFORM(R);
    console.log('\t ' + "REV_L_TRANSFORM данные " + BUFF_TO_TEXT(RR));
    console.log((EQ(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности S преобразования и ему обратного */
function CHECKER_S() {
    let data = RANDOM_BLOCK();
    console.log("\tФункция проверки работоспособности S преобразования и ему обратного");
    console.log('\t ' + "Изначальные     данные " + BUFF_TO_TEXT(data));
    let R = S_TRANSFORM(data);
    console.log('\t ' + "S_TRANSFORM     данные " + BUFF_TO_TEXT(R));
    let RR = REV_S_TRANSFORM(R);
    console.log('\t ' + "REV_S_TRANSFORM данные " + BUFF_TO_TEXT(RR));
    console.log((EQ(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
/** Функция проверки работоспособности создания хеша */
function CHECKER_10HASH() {
    let data = RANDOM_BLOCK();
    let key = Buffer.concat([RANDOM_BLOCK(), RANDOM_BLOCK()]);
    let keys = EXPAND_KEYS(key);
    keys.map(BUFF_TO_TEXT).map((x) => console.log(x));
    console.log("\tФункция проверки работоспособности создания хеша");
    console.log('\t ' + "Ключ " + BUFF_TO_TEXT(key) + "\n");
    console.log('\t ' + "Изначальные     данные " + BUFF_TO_TEXT(data));
    let R = ROUNDS_10(data, keys);
    console.log('\t ' + "ROUNDS_10       данные " + BUFF_TO_TEXT(R));
    let RR = REV_ROUNDS_10(R, keys);
    console.log('\t ' + "REV_ROUNDS_10   данные " + BUFF_TO_TEXT(RR));
    // keys.keys.map(BUFF_TO_TEXT).map((x)=>console.log(x))
    console.log((EQ(data, RR) ? "Сошлось" : "Не сошлось") + "\n");
}
export default () => {
    CHECKER_R();
    CHECKER_L();
    CHECKER_S();
    CHECKER_10HASH;
};
