"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptSync = exports.encryptSync = exports.decryptChilds = exports.encryptChilds = exports.FN_TRIM_START = exports.EXPAND_KEYS = exports.FEISTEL_NETWORK = exports.REV_L_TRANSFORM = exports.L_TRANSFORM = exports.REV_S_TRANSFORM = exports.REV_R_TRANSFORM = exports.R_TRANFORM = exports.S_TRANSFORM = exports.GALOIS_MULT = exports.XOR = void 0;
exports.toBuffer = toBuffer;
exports.ROUNDS_10 = ROUNDS_10;
exports.REV_ROUNDS_10 = REV_ROUNDS_10;
exports.countChild = countChild;
exports.encryptAsync = encryptAsync;
exports.decryptAsync = decryptAsync;
const os_1 = require("os");
const constants_cjs_1 = require("./constants.cjs");
const child_process_1 = require("child_process");
const path_1 = require("path");
/**
 * Сложение/вычетание в поле Галуа эквивалент XOR
 *
 * XOR (исключающее или) для буферов, возвращает сам буфер
 */
const XOR = (a, b) => {
    if (a.length !== b.length)
        throw "XOR a.length !== b.length";
    return Buffer.from(a.map((x, i) => b[i] ^ x));
};
exports.XOR = XOR;
/**
 * Умножение в поле Галуа по модулю неприводимого многочлена x^{8}+x^{7}+x^{6}+x+1}
 */
const GALOIS_MULT = (a, b) => {
    let ret = 0;
    let hiBbit = 0;
    for (let i = 0; i < 8; i++) {
        let _tmp = b & 1;
        if (_tmp === 1)
            ret ^= a;
        hiBbit = a & 0x80;
        a <<= 1;
        if (hiBbit === 0x80)
            a ^= 0x1c3; //0x1c3 = x^{8}+x^{7}+x^{6}+x+1} || 0xc3 =  x^{7}+x^{6}+x+1
        b >>= 1;
    }
    return ret;
};
exports.GALOIS_MULT = GALOIS_MULT;
/**
 * S преобразование
 *
 * Операция замены байтов путем применения нелинейной биективного преобразования
 */
const S_TRANSFORM = (buf) => {
    let ret = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
    buf.forEach((x, i) => ret[i] = constants_cjs_1.PI[x]);
    return ret;
};
exports.S_TRANSFORM = S_TRANSFORM;
/**
 * R преобразование
 *
 * Умножение + сдвиг
 */
const R_TRANFORM = (buf) => {
    let ret = Buffer.from(buf);
    let a15 = 0;
    for (let i = 0; i < 16; i++)
        a15 ^= (0, exports.GALOIS_MULT)(buf[i], constants_cjs_1.L_CONSTANT[i]);
    for (let i = 15; i >= 1; i--)
        ret[i] = buf[i - 1];
    ret[0] = a15;
    return ret;
};
exports.R_TRANFORM = R_TRANFORM;
/**
 * Обратное R преобразование
 */
const REV_R_TRANSFORM = (buf) => {
    let a0 = buf[0];
    let ret = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
    for (let i = 0; i < 15; i++) {
        ret[i] = buf[i + 1];
        a0 ^= (0, exports.GALOIS_MULT)(buf[i + 1], constants_cjs_1.L_CONSTANT[i]);
    }
    ret[15] = a0;
    return ret;
};
exports.REV_R_TRANSFORM = REV_R_TRANSFORM;
/**
 * Обратное S преобразование
 *
 * Обратная операция замены байтов путем применения нелинейной биективного преобразования
 */
const REV_S_TRANSFORM = (buf) => {
    let ret = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
    buf.forEach((x, i) => ret[i] = constants_cjs_1.PI.indexOf(x));
    return ret;
};
exports.REV_S_TRANSFORM = REV_S_TRANSFORM;
/**L (линейное) преобразование  */
const L_TRANSFORM = (buf) => {
    let ret = Buffer.from(buf);
    for (let i = 0; i < 16; i++)
        ret = (0, exports.R_TRANFORM)(ret);
    return ret;
};
exports.L_TRANSFORM = L_TRANSFORM;
/**Обратное L (линейное) преобразование  */
const REV_L_TRANSFORM = (buf) => {
    let ret = Buffer.from(buf);
    for (let i = 0; i < 16; i++)
        ret = (0, exports.REV_R_TRANSFORM)(ret);
    return ret;
};
exports.REV_L_TRANSFORM = REV_L_TRANSFORM;
/** Преобразования ячейки Фейстеля */
const FEISTEL_NETWORK = (key1, key2, iterC) => {
    let internal = (0, exports.XOR)(key1, iterC);
    internal = (0, exports.S_TRANSFORM)(internal);
    internal = (0, exports.L_TRANSFORM)(internal);
    return [(0, exports.XOR)(internal, key2), key1];
};
exports.FEISTEL_NETWORK = FEISTEL_NETWORK;
/** Расчет раундовых ключей */
const EXPAND_KEYS = (masterkey) => {
    if (masterkey.length !== 32)
        throw "Ключ должен быть 32 байта или 256 бит\n" + "Получил " + masterkey.length + " байт";
    let iterC = [];
    let keyL = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
    let keyR = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
    for (let i = 0; i < masterkey.length; i++) {
        let j = i % 16;
        let m = Buffer.from(constants_cjs_1.ARR_16_ZEROS.slice());
        m[15] = i;
        iterC.push((0, exports.L_TRANSFORM)(m));
        if (i < 16)
            keyL[j] = masterkey[j];
        else
            keyR[j] = masterkey[j];
    }
    let ret = [Buffer.from(keyR), Buffer.from(keyL)];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            let temp = (0, exports.FEISTEL_NETWORK)(keyL, keyR, iterC[j + 8 * i]);
            keyR = Buffer.from(temp[0]);
            keyL = Buffer.from(temp[1]);
        }
        ret[2 * i + 2] = Buffer.from(keyL);
        ret[2 * i + 3] = Buffer.from(keyR);
    }
    return ret;
};
exports.EXPAND_KEYS = EXPAND_KEYS;
function toBuffer(data) {
    if (typeof data === 'string') {
        if (/[^0123456789abcdef]/gi.test(data))
            throw "Строка не HEX";
        let arr = data.match(/.?./g);
        if (!arr)
            throw "match errore FN toBuffer";
        return Buffer.from(arr.map(x => parseInt(x, 16)));
    }
    else
        return data;
}
function ROUNDS_10(block, keys) {
    let temp = Buffer.from(block);
    for (let i = 0; i < 9; i++) {
        temp = (0, exports.XOR)(temp, keys[i]);
        temp = (0, exports.S_TRANSFORM)(temp);
        temp = (0, exports.L_TRANSFORM)(temp);
    }
    return (0, exports.XOR)(temp, keys[9]);
}
function REV_ROUNDS_10(block, keys) {
    let temp = (0, exports.XOR)(block, keys[9]);
    for (let i = 8; i >= 0; i--) {
        temp = (0, exports.REV_L_TRANSFORM)(temp);
        temp = (0, exports.REV_S_TRANSFORM)(temp);
        temp = (0, exports.XOR)(temp, keys[i]);
    }
    return temp;
}
const FN_TRIM_START = (b) => {
    let index = b.findIndex((v) => v !== 0);
    if (~index)
        return b.subarray(index, b.length);
    return b;
};
exports.FN_TRIM_START = FN_TRIM_START;
function countChild(data, MAX_BLOCK) {
    let max = (0, os_1.cpus)().length;
    if (MAX_BLOCK < max)
        max = MAX_BLOCK;
    let r = 0;
    if (data === 'all')
        r = max;
    else
        r = data;
    return r > max ? max : r;
}
async function CHILD_E_D_METHOD(i, child) {
    let sizeOf = i * this.BLOCKS_FOR_CHILD * this.BITES_FROM_CHILD;
    let MAX_SIZE = this.BLOCKS_FOR_CHILD * this.BITES_FROM_CHILD + sizeOf;
    if (MAX_SIZE > this.data.length)
        MAX_SIZE = this.data.length;
    let END_OF_DATA = this.BITES_FROM_CHILD + 0;
    for (let j = 0; j < this.BLOCKS_FOR_CHILD; j++) {
        if ((END_OF_DATA + sizeOf) > MAX_SIZE)
            END_OF_DATA = MAX_SIZE - sizeOf;
        await new Promise((res, rej) => {
            child.send({
                type: this.method,
                data: this.data.subarray(sizeOf, sizeOf + END_OF_DATA),
                masterkey: this.MASTER_KEY_BUFF
            });
            child.once("message", (resp) => {
                let bf = Buffer.from(resp);
                if (bf.length !== END_OF_DATA)
                    throw "Получил данных больше чем нужно";
                bf.copy(this.data, sizeOf, 0, bf.length);
                res(true);
            });
        });
        sizeOf += END_OF_DATA;
    }
    return this.data;
}
function SEARCHER_BITES_FROM_CHILD(size, BITES_FROM_CHILD) {
    if (!!BITES_FROM_CHILD && BITES_FROM_CHILD > 0) {
        let n = Math.ceil(BITES_FROM_CHILD);
        return n % 16 + n;
    }
    let i = 0;
    for (; i < 2; i++)
        if (Math.floor(size / ((1024 ** i))) === 0)
            break;
    if (!i)
        return 16;
    return 1024 * 0.5;
}
/**Многопоточное шифрование по методу Кузнечик */
const encryptChilds = async (data, masterkey, childs, BITES_FROM_CHILD = 0) => {
    if (data.length > 2147483647)
        console.warn("encryptChilds не был расчитан на данные более 2 гб");
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    const C_BITES_FROM_CHILD = SEARCHER_BITES_FROM_CHILD(data.length, BITES_FROM_CHILD);
    const CHILD_MAX = countChild(childs, Math.ceil(data.length / C_BITES_FROM_CHILD));
    const BLOCKS_FOR_CHILD = Math.ceil((data.length / C_BITES_FROM_CHILD) / CHILD_MAX);
    const MASTER_KEY_BUFF = toBuffer(masterkey);
    const CHILD_PATH = (0, path_1.join)(__dirname, 'child.cjs');
    const CHILDS = Array.from({ length: CHILD_MAX }).map(x => (0, child_process_1.fork)(CHILD_PATH));
    const MAIN_ENCRYPT_FN = CHILD_E_D_METHOD.bind({ method: "encrypt", BITES_FROM_CHILD: C_BITES_FROM_CHILD, BLOCKS_FOR_CHILD: BLOCKS_FOR_CHILD, data: data, MASTER_KEY_BUFF: MASTER_KEY_BUFF });
    let ARR_PROMISE_INIT = CHILDS.map(child => {
        return new Promise(function (res, rej) {
            let timer = setTimeout(() => {
                child.kill(0);
                res(false);
            }, 5 * 1000);
            child.once("message", (data) => {
                clearTimeout(timer);
                res(true);
            });
        });
    });
    await Promise.all(ARR_PROMISE_INIT);
    ARR_PROMISE_INIT = CHILDS.map((child, i) => MAIN_ENCRYPT_FN(i, child));
    await Promise.all(ARR_PROMISE_INIT);
    await Promise.all(CHILDS.map((child, i) => {
        return new Promise(function (res, rej) {
            child.on('exit', () => res(true));
            child.kill('SIGKILL');
        });
    }));
    return data;
};
exports.encryptChilds = encryptChilds;
/**Многопоточное дешифрование по методу Кузнечик */
const decryptChilds = async (data, masterkey, childs, BITES_FROM_CHILD = 0, trimStart = true) => {
    if (data.length > 2147483647)
        console.warn("decryptChilds не был расчитан на данные более 2 гб");
    if (!!(data.length % 16))
        throw "Не кратно 16 байтам";
    const C_BITES_FROM_CHILD = SEARCHER_BITES_FROM_CHILD(data.length, BITES_FROM_CHILD);
    const CHILD_MAX = countChild(childs, Math.ceil(data.length / C_BITES_FROM_CHILD));
    const BLOCKS_FOR_CHILD = Math.ceil((data.length / C_BITES_FROM_CHILD) / CHILD_MAX);
    const MASTER_KEY_BUFF = toBuffer(masterkey);
    const CHILD_PATH = (0, path_1.join)(__dirname, 'child.cjs');
    const CHILDS = Array.from({ length: CHILD_MAX }).map(x => (0, child_process_1.fork)(CHILD_PATH));
    const MAIN_DECRYPT_FN = CHILD_E_D_METHOD.bind({ method: "decrypt", BITES_FROM_CHILD: C_BITES_FROM_CHILD, BLOCKS_FOR_CHILD: BLOCKS_FOR_CHILD, data: data, MASTER_KEY_BUFF: MASTER_KEY_BUFF });
    let ARR_PROMISE_INIT = CHILDS.map(child => {
        return new Promise(function (res, rej) {
            let timer = setTimeout(() => {
                child.kill(0);
                res(false);
            }, 5 * 1000);
            child.once("message", (data) => {
                clearTimeout(timer);
                res(true);
            });
        });
    });
    await Promise.all(ARR_PROMISE_INIT);
    ARR_PROMISE_INIT = CHILDS.map((child, i) => {
        return MAIN_DECRYPT_FN(i, child);
    });
    await Promise.all(ARR_PROMISE_INIT);
    await Promise.all(CHILDS.map((child, i) => {
        return new Promise(function (res, rej) {
            child.on('exit', () => res(true));
            child.kill('SIGKILL');
        });
    }));
    return trimStart ? (0, exports.FN_TRIM_START)(data) : data;
};
exports.decryptChilds = decryptChilds;
/**Асинхронное шифрование по методу Кузнечик */
async function encryptAsync(data, masterkey) {
    let keys = this?.EXPAND_KEYS || (0, exports.EXPAND_KEYS)(toBuffer(masterkey));
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    let MAX_ITER = data.length / 16;
    let ArrPromise = [];
    for (let i = 0; i < MAX_ITER; i++) {
        ArrPromise.push(new Promise(function (resolve, reject) {
            resolve(ROUNDS_10(Buffer.from(data.subarray(i * 16, (i + 1) * 16)), keys));
        }));
    }
    return Buffer.concat(await Promise.all(ArrPromise));
}
/**Асинхронное дешифрование по методу Кузнечик */
async function decryptAsync(data, masterkey, trimStart = true) {
    let trs = trimStart;
    if (this?.trimStart !== undefined)
        trs = this?.trimStart;
    let keys = this?.EXPAND_KEYS || (0, exports.EXPAND_KEYS)(toBuffer(masterkey));
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    let MAX_ITER = data.length / 16;
    let ArrPromise = [];
    for (let i = 0; i < MAX_ITER; i++) {
        ArrPromise.push(new Promise(function (resolve, reject) {
            resolve(REV_ROUNDS_10(Buffer.from(data.subarray(i * 16, (i + 1) * 16)), keys));
        }));
    }
    return trs ? (0, exports.FN_TRIM_START)(Buffer.concat(await Promise.all(ArrPromise))) : Buffer.concat(await Promise.all(ArrPromise));
}
/**Синхронное шифрование по методу Кузнечик */
const encryptSync = (data, masterkey) => {
    let keys = (0, exports.EXPAND_KEYS)(toBuffer(masterkey));
    let ret = [];
    let block = [];
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    for (let i = 0; i < data.length; i++) {
        block.push(data[i]);
        if (block.length === 16) {
            ret.push(...ROUNDS_10(block, keys));
            block = [];
        }
    }
    if (block.length > 0)
        ret.push(...ROUNDS_10(block, keys));
    return Buffer.from(ret);
};
exports.encryptSync = encryptSync;
/**Синхронное дешифрование по методу Кузнечик */
const decryptSync = (data, masterkey, trimStart = true) => {
    let keys = (0, exports.EXPAND_KEYS)(toBuffer(masterkey));
    let ret = [];
    let block = [];
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    for (let i = 0; i < data.length; i++) {
        block.push(data[i]);
        if (block.length === 16) {
            ret.push(...REV_ROUNDS_10(block, keys));
            block = [];
        }
    }
    if (block.length !== 0)
        ret.push(...REV_ROUNDS_10(block, keys));
    return trimStart ? (0, exports.FN_TRIM_START)(Buffer.from(ret)) : Buffer.from(ret);
};
exports.decryptSync = decryptSync;
