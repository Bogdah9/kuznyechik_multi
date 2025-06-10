import { cpus } from "os";
import { L_CONSTANT, PI, ARR_16_ZEROS } from "./constants.mjs";
import { fork } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
/**
 * Сложение/вычетание в поле Галуа эквивалент XOR
 *
 * XOR (исключающее или) для буферов, возвращает сам буфер
 */
export const XOR = (a, b) => {
    if (a.length !== b.length)
        throw "XOR a.length !== b.length";
    return Buffer.from(a.map((x, i) => b[i] ^ x));
};
/**
 * Умножение в поле Галуа по модулю неприводимого многочлена x^{8}+x^{7}+x^{6}+x+1}
 */
export const GALOIS_MULT = (a, b) => {
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
/**
 * S преобразование
 *
 * Операция замены байтов путем применения нелинейной биективного преобразования
 */
export const S_TRANSFORM = (buf) => {
    let ret = Buffer.from(ARR_16_ZEROS.slice());
    buf.forEach((x, i) => ret[i] = PI[x]);
    return ret;
};
/**
 * R преобразование
 *
 * Умножение + сдвиг
 */
export const R_TRANFORM = (buf) => {
    let ret = Buffer.from(buf);
    let a15 = 0;
    for (let i = 0; i < 16; i++)
        a15 ^= GALOIS_MULT(buf[i], L_CONSTANT[i]);
    for (let i = 15; i >= 1; i--)
        ret[i] = buf[i - 1];
    ret[0] = a15;
    return ret;
};
/**
 * Обратное R преобразование
 */
export const REV_R_TRANSFORM = (buf) => {
    let a0 = buf[0];
    let ret = Buffer.from(ARR_16_ZEROS.slice());
    for (let i = 0; i < 15; i++) {
        ret[i] = buf[i + 1];
        a0 ^= GALOIS_MULT(buf[i + 1], L_CONSTANT[i]);
    }
    ret[15] = a0;
    return ret;
};
/**
 * Обратное S преобразование
 *
 * Обратная операция замены байтов путем применения нелинейной биективного преобразования
 */
export const REV_S_TRANSFORM = (buf) => {
    let ret = Buffer.from(ARR_16_ZEROS.slice());
    buf.forEach((x, i) => ret[i] = PI.indexOf(x));
    return ret;
};
/**L (линейное) преобразование  */
export const L_TRANSFORM = (buf) => {
    let ret = Buffer.from(buf);
    for (let i = 0; i < 16; i++)
        ret = R_TRANFORM(ret);
    return ret;
};
/**Обратное L (линейное) преобразование  */
export const REV_L_TRANSFORM = (buf) => {
    let ret = Buffer.from(buf);
    for (let i = 0; i < 16; i++)
        ret = REV_R_TRANSFORM(ret);
    return ret;
};
/** Преобразования ячейки Фейстеля */
export const FEISTEL_NETWORK = (key1, key2, iterC) => {
    let internal = XOR(key1, iterC);
    internal = S_TRANSFORM(internal);
    internal = L_TRANSFORM(internal);
    return [XOR(internal, key2), key1];
};
/** Расчет раундовых ключей */
export const EXPAND_KEYS = (masterkey) => {
    if (masterkey.length !== 32)
        throw "Ключ должен быть 32 байта или 256 бит\n" + "Получил " + masterkey.length + " байт";
    let iterC = [];
    let keyL = Buffer.from(ARR_16_ZEROS.slice());
    let keyR = Buffer.from(ARR_16_ZEROS.slice());
    for (let i = 0; i < masterkey.length; i++) {
        let j = i % 16;
        let m = Buffer.from(ARR_16_ZEROS.slice());
        m[15] = i;
        iterC.push(L_TRANSFORM(m));
        if (i < 16)
            keyL[j] = masterkey[j];
        else
            keyR[j] = masterkey[j];
    }
    let ret = [Buffer.from(keyR), Buffer.from(keyL)];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 8; j++) {
            let temp = FEISTEL_NETWORK(keyL, keyR, iterC[j + 8 * i]);
            keyR = Buffer.from(temp[0]);
            keyL = Buffer.from(temp[1]);
        }
        ret[2 * i + 2] = Buffer.from(keyL);
        ret[2 * i + 3] = Buffer.from(keyR);
    }
    return ret;
};
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
export function ROUNDS_10(block, keys) {
    let temp = Buffer.from(block);
    for (let i = 0; i < 9; i++) {
        temp = XOR(temp, keys[i]);
        temp = S_TRANSFORM(temp);
        temp = L_TRANSFORM(temp);
    }
    return XOR(temp, keys[9]);
}
export function REV_ROUNDS_10(block, keys) {
    let temp = XOR(block, keys[9]);
    for (let i = 8; i >= 0; i--) {
        temp = REV_L_TRANSFORM(temp);
        temp = REV_S_TRANSFORM(temp);
        temp = XOR(temp, keys[i]);
    }
    return temp;
}
export const encryptSync = (data, masterkey) => {
    let keys = EXPAND_KEYS(toBuffer(masterkey));
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
export const encryptAsync = async (data, masterkey) => {
    let keys = EXPAND_KEYS(toBuffer(masterkey));
    let ret = [];
    let block = [];
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
};
const FN_TRIM_START = (b) => {
    let index = b.findIndex((v) => v !== 0);
    if (~index)
        return b.subarray(index, b.length);
    return b;
};
export const decryptAsync = async (data, masterkey, trimStart = true) => {
    let keys = EXPAND_KEYS(toBuffer(masterkey));
    let ret = [];
    let block = [];
    if (!!(data.length % 16))
        data = Buffer.concat([Buffer.from(Array.from({ length: 16 - data.length % 16 }).map(x => 0)), data]);
    let MAX_ITER = data.length / 16;
    let ArrPromise = [];
    for (let i = 0; i < MAX_ITER; i++) {
        ArrPromise.push(new Promise(function (resolve, reject) {
            resolve(REV_ROUNDS_10(Buffer.from(data.subarray(i * 16, (i + 1) * 16)), keys));
        }));
    }
    return trimStart ? FN_TRIM_START(Buffer.concat(await Promise.all(ArrPromise))) : Buffer.concat(await Promise.all(ArrPromise));
};
export const decryptSync = (data, masterkey, trimStart = true) => {
    let keys = EXPAND_KEYS(toBuffer(masterkey));
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
    return trimStart ? FN_TRIM_START(Buffer.from(ret)) : Buffer.from(ret);
};
function countChild(data, MAX_BLOCK) {
    let max = cpus().length;
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
    let sizeOf = i * this.BLOCKS_FOR_CHILD;
    let MAX_SIZE = this.BLOCKS_FOR_CHILD + sizeOf;
    let END_OF_DATA = this.BITES_FROM_CHILD + 0;
    let MAX_ITER = Math.ceil((MAX_SIZE - sizeOf) / this.BITES_FROM_CHILD);
    for (let j = 0; j < MAX_ITER; j++) {
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
    if (!!BITES_FROM_CHILD && BITES_FROM_CHILD > 0)
        return Math.ceil(BITES_FROM_CHILD);
    let i = 1;
    for (; i < 2; i++)
        if ((size / ((1024 ** i))) === 0)
            break;
    if (i <= 1)
        return 16;
    return 16 * (1024 ** (i - 1));
}
/**Многопоточное шифрование по методу Кузнечик */
export const encryptChilds = async (data, masterkey, childs, BITES_FROM_CHILD = 0) => {
    if (data.length > 2147483647)
        console.warn("encryptChilds не был расчитан на данные более 2 гб");
    const MAX_BLOCK = Math.ceil(data.length / 16);
    const C_BITES_FROM_CHILD = SEARCHER_BITES_FROM_CHILD(data.length, BITES_FROM_CHILD);
    const CHILD_MAX = countChild(childs, Math.ceil(MAX_BLOCK / C_BITES_FROM_CHILD));
    const BLOCKS_FOR_CHILD = Math.ceil(MAX_BLOCK / CHILD_MAX);
    const MASTER_KEY_BUFF = toBuffer(masterkey);
    const CHILD_PATH = join(dirname(fileURLToPath(import.meta.url)), 'child.mjs');
    const CHILDS = Array.from({ length: CHILD_MAX }).map(x => fork(CHILD_PATH));
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
/**Многопоточное дешифрование по методу Кузнечик */
export const decryptChilds = async (data, masterkey, childs, BITES_FROM_CHILD = 0, trimStart = true) => {
    if (data.length > 2147483647)
        console.warn("decryptChilds не был расчитан на данные более 2 гб");
    const MAX_BLOCK = Math.ceil(data.length / 16);
    const C_BITES_FROM_CHILD = SEARCHER_BITES_FROM_CHILD(data.length, BITES_FROM_CHILD);
    const CHILD_MAX = countChild(childs, Math.ceil(MAX_BLOCK / C_BITES_FROM_CHILD));
    const BLOCKS_FOR_CHILD = Math.ceil(MAX_BLOCK / CHILD_MAX);
    const MASTER_KEY_BUFF = toBuffer(masterkey);
    const CHILD_PATH = join(dirname(fileURLToPath(import.meta.url)), 'child.mjs');
    const CHILDS = Array.from({ length: CHILD_MAX }).map(x => fork(CHILD_PATH));
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
    return trimStart ? FN_TRIM_START(data) : data;
};
