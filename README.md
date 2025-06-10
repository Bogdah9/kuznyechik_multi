# kuznyechik_multi

Шифрование ГОСТ 34.12-2018 Кузнечик. </br>
Поддержка ESM/CommonJS/ChildProcess/browser</br>
Без внешних зависимостей</br>
## Тест на производительность
```typescript
import test from 'kuznyechik_multi/test'
const {default:test} = require('kuznyechik_multi/test')

await test()
```
```
    Пример работоспособности шифра: 
         Ключ 32 байта (HEX)    : 1497515a6be5b8942bfea3f963d351e3256e747b5ed1ea9fc9c804cbcbd8a8a3
         Исходный текст(HEX)    : 0a09d09020d09120d09220d09320d09420d09520d09620d097200a09d09820d09920d09a20d09b20d09c20d09d20d09e20d09f200a09d0a020d0a120d0a220d0a320d0a420d0a520d0a620d0a7200a09d0a820d0a920d0aa20d0ab20d0ac20d0ad20d0ae20d0af200a090a09d0b020d0b120d0b220d0b320d0b420d0b520d0b620d0b7200a09d0b820d0b920d0ba20d0bb20d0bc20d0bd20d0be20d0bf200a09d18020d18120d18220d18320d18420d18520d18620d187200a09d18820d18920d18a20d18b20d18c20d18d20d18e20d18f200a09
         Шифротекст(HEX)        : 51981bc7db669b24f12aa62891a6a13cde4a314382d5f8a15628d51fcbb458759cda23b05cd8feea1f75c3e4e83cd05eb553df47f6b2c811bdca381858b0881969a86e4a962cc1c8e1e6cbb1feac0e21e381f1f3003af315de521731532da3f3d105bc825ba5688a8e922f07bdc9e9c9aae544155581c1a9b79bb35e76db687c104e2df534259dbf4e5bf1278f42fe58842094b8ec04f984e932ee9db8c9c4b048881cd0289410e8f7bc26193b7ac98cae6087802815c6563fe524d6d424cb3b89e06267dbcfaf6c6573a4b2783703185b4daf343cd1de1879
        Расшифрованный(UTF-8)   : 

        А Б В Г Д Е Ж З 
        И Й К Л М Н О П 
        Р С Т У Ф Х Ц Ч 
        Ш Щ Ъ Ы Ь Э Ю Я 

        а б в г д е ж з 
        и й к л м н о п 
        р с т у ф х ц ч 
        ш щ ъ ы ь э ю я 



    Многопоточное шифрование/дешифрование (nodejs only), размер данных 8.000 Мбайта 
    Процессор                     : QEMU Virtual CPU version 4.2.0
    Колличесво дочерник процессов : 4
    Заняло времени шифрование     : 26.182c
    Скорость шифрования           : 312.89 КБайта/с
    Заняло времени дешифрование   : 32.581c
    Скорость дешифрование         : 251.43 КБайта/с


    Проверка на равенство исходных данных и шифрованных   :  false
    Проверка на равенство исходных данных и дешифрованных :  true
```
## Браузерная версия kuznyechik_multi/browser
    Взамен Buffer используется Uint8Array. ECMAScript only
    Браузерная версия находится в едином модуле по пути ./node_modules/kuznyechik_multi/browser/index.min.js
    Типы браузерной версии                              ./node_modules/kuznyechik_multi/browser/index.min.d.ts
```typescript
declare const _default: {
    async: {
        encrypt: (data: Uint8Array, masterkey: string | Uint8Array) => Promise<Uint8Array>;
        decrypt: (data: Uint8Array, masterkey: string | Uint8Array, trimStart?: boolean) => Promise<Uint8Array>;
    };
    sync: {
        encrypt: (data: Uint8Array, masterkey: string | Uint8Array) => Uint8Array;
        decrypt: (data: Uint8Array, masterkey: string | Uint8Array, trimStart?: boolean) => Uint8Array;
    };
};
export default _default;
```
## Импроты по умолчанию 
```typescript
import {async,sync,multithreading} from 'kuznyechik_multi';
import kuznyechik_multi from 'kuznyechik_multi';
const {async,sync,multithreading} = require("kuznyechik_multi");
const kuznyechik_multi = require("kuznyechik_multi");
```
## Импроты асинхронного кода и реализация 
```typescript
import { randomBytes } from "node:crypto";
const {randomBytes} = require("crypto")


import {encrypt,decryp} from 'kuznyechik_multi/async';
import kuznyechik_async from 'kuznyechik_multi/async';
const {encrypt,decrypt} = require("kuznyechik_multi/async")
const kuznyechik_async = require("kuznyechik_multi/async");
//Ключ, 32 байта - всегда
let key = randomBytes(32)
//Исходное сообщение
let message  = Buffer.from("Привет мир",'utf8')
//Шифрованное сообщение
let ebuff = await encrypt(message,key)
//Расшифрованное сообщение
let dbuff = await decrypt(ebuff,key)
//Расшифрованное сообщение, заведомо ложным ключем
let dbuffErrore = await decrypt(ebuff,randomBytes(32))
console.log("\tКлюч 32 байта (HEX)                   : "+key.toString('hex'))
console.log("\tИсходный текст                        : "+message.toString('utf8'))
console.log("\tШифротекст(HEX)                       : "+ebuff.toString('hex'))
console.log("\tРасшифрованный(UTF-8)                 : "+dbuff.toString('utf8'))
console.log("\tРасшифрованный(UTF-8) ложным ключем   : "+dbuffErrore.toString('utf8'))
```
    Ключ 32 байта (HEX)                   : f639c034354ef4b27a7a4c9c34568deebae68835194f0a5930f4c589c7ed0b39
    Исходный текст                        : Привет мир
    Шифротекст(HEX)                       : e86fc7688a0b1fd8081ca7d91a6d8be2dc676c3b9da273af82237e213fd525ee
    Расшифрованный(UTF-8)                 : Привет мир
    Расшифрованный(UTF-8) ложным ключем   : ֳ¶���   DfEs§��p-↓[9☼��s↕6�3#.J

## Импроты синхронного кода и реализация 
```typescript
import { randomBytes } from "node:crypto";
const {randomBytes} = require("crypto")


import {encrypt,decryp} from 'kuznyechik_multi/sync';
import kuznyechik_sync from 'kuznyechik_multi/sync';
const {encrypt,decrypt} = require("kuznyechik_multi/sync")
const kuznyechik_sync = require("kuznyechik_multi/sync");
//Ключ, 32 байта - всегда
let key = randomBytes(32)
//Исходное сообщение
let message  = Buffer.from("Привет мир",'utf8')
//Шифрованное сообщение
let ebuff = encrypt(message,key)
//Расшифрованное сообщение
let dbuff = decrypt(ebuff,key)
//Расшифрованное сообщение, заведомо ложным ключем
let dbuffErrore = decrypt(ebuff,randomBytes(32))
console.log("\tКлюч 32 байта (HEX)                   : "+key.toString('hex'))
console.log("\tИсходный текст                        : "+message.toString('utf8'))
console.log("\tШифротекст(HEX)                       : "+ebuff.toString('hex'))
console.log("\tРасшифрованный(UTF-8)                 : "+dbuff.toString('utf8'))
console.log("\tРасшифрованный(UTF-8) ложным ключем   : "+dbuffErrore.toString('utf8'))
```
    Ключ 32 байта (HEX)                   : 46da7d2aa54905e7b9333580a225c37838516c2d40204e49c41d6aa3eaf26dbe
    Исходный текст                        : Привет мир
    Шифротекст(HEX)                       : 7fbf1dadee917348f3c4f61ac66dac391358f9fd4b36308296526d6fdae90a3a
    Расшифрованный(UTF-8)                 : Привет мир
    Расшифрованный(UTF-8) ложным ключем   : ♀�p��f��g��♥a�$�♥�T��yQ!��g�ϧ

## Импроты многопоточного кода и реализация 
```typescript
import { randomBytes } from "node:crypto";
const {randomBytes} = require("crypto")


import {encrypt,decryp} from 'kuznyechik_multi/multithreading';
import kuznyechik_sync from 'kuznyechik_multi/multithreading';
const {encrypt,decrypt} = require("kuznyechik_multi/multithreading")
const kuznyechik_sync = require("kuznyechik_multi/multithreading");
const MSG = `
Николай Некрасов,Снежок

Снежок порхает, кружится,
На улице бело.
И превратились лужицы
В холодное стекло.

Где летом пели зяблики,
Сегодня - посмотри! -
Как розовые яблоки,
На ветках снегири.

Снежок изрезан лыжами,
Как мел, скрипуч и сух,
И ловит кошка рыжая
Веселых белых мух.
`
//Ключ, 32 байта - всегда
let key = randomBytes(32)
//Колличество байтов number опционально, которые будут переданны каждому ребенку на каждую интерацию шифрования/рфсшифрования - по умолчанию он сам высчитает оптимальное колличество
const bites_fromChild = undefined
//Колличество дочерних процессов number опционально, по умолчанию all - максимальное колличество
const childs = 'all'
//Исходное сообщение, ограничение в максимальное колличество Buffer ~ 2 гигабайта
let message  = Buffer.from(MSG,'utf8')
//Шифрованное, исходное сообщение будет перезаписанно!
let ebuff = await encrypt(Buffer.from(message),key,childs)
//Расшифрованное сообщение, исходное сообщение будет перезаписанно!
let dbuff = await decrypt(Buffer.from(ebuff),key,childs)
//Расшифрованное сообщение, заведомо ложным ключем, исходное сообщение будет перезаписанно!
let dbuffErrore = await decrypt(Buffer.from(ebuff),randomBytes(32),childs)
console.log(message.length)
console.log("\tКлюч 32 байта (HEX)                   : "+key.toString('hex'))
console.log("\tШифротекст(HEX)                       :\n\t"+ebuff.toString('hex').replaceAll("\n","\n\t\t"))
console.log("\tРасшифрованный(UTF-8) ложным ключем   :\n\t"+dbuffErrore.toString('utf8'))
console.log("\tРасшифрованный(UTF-8)                 :\n\t"+dbuff.toString('utf8').replaceAll("\n","\n\t\t"))
```
        Ключ 32 байта (HEX)                   : 2846dad805295b2e048e024b728dd3ed9bfa4f01de202cea09cda34a63ca7472
        Шифротекст(HEX)                       :
        c5a46d01b8d7ade3f2fb9dbc90ace08cad19b6fe4234cd4949336018d8e2c564ef5ba5a041a92b5a39742f8206e493e0e6593ed1d872395b6090ace98b4727917b7758b39047b6ffaac54add6136d71be0703005cca3a45b7f3ab1914dfe69409405f5359e7b1a1aa1e3924048e220dde12cc363daf1584317dfe153588c140a62cf9ee4ac295920c86b475367f84e81350a6abbaac4913f27ae69442750f7b681f623ea6784a489755fd4982114049ed24e429f0f130f8a75368f79d397bfd7b320bb959acb2fa8ab2cfc459995c21693e9fee2d10474a80b5f361fb67241a55643c660d955ef6e83e49fb992c68e3639d8683fa80ec3e31cc2bbe4eefefc07af3f3b255440d140f9a7a5d4898d0c645e8c2ff86c40cb49504ecda86b54e9a735177971921dfe99718a50b07ce32439dcdfe6012331c1036799ec547e9f7d8efc785b554649aa9fd5ac9f06183f22899147d3342aace1316fe5eee9fa936d9485929496e367e1bb85f9695058507305da3a2351df8862ef49bc714722b078beffeaa7560beb38571530eebe3e419e472cda920cc9fbeb4380ebde7b9b176e21172fde5b75e6455d297de085aadd89a848f95a6bb85cb2ce83ea3fe547187c5e6d89a27152889a720fad831cf347fafd4232737cefb4f075fd4c2676e7c3d02586c3b46dd9595d77bf1935baf81188327f41246091beb598e674b5aacf2707c3
        Расшифрованный(UTF-8) ложным ключем   :
        ��ά��(+E���<�?@[TA�86)��(�
                                  �_<�F�=�Q=E
        �A�������}�������?$�B
        �M�i�{g����'-�=Y<V&�XƇ#_zA#Ο]�B��H��t9�H�G߮ZZ��_�����3h��u�y�K�Wߪ�uֵ��ӥ^�io*&rxӺfy�JS���f�vG���a������/A$Y���T����
        dl�8�f�6�*T�@OBp;<���;��Ē�E$\�ԥ��g�
        ωx�x(3��DHo��>���F+�?K����l�F�̛P��@�#=�GNg��T��(�
                                          �..�'"�-αB?�^�{��}�|�J�)f[�   _�7��_����`����
        ��GmX�a��o�dG>4��)/�4@��>?�f<�  �����
        Расшифрованный(UTF-8)                 :

                Николай Некрасов,Снежок

                Снежок порхает, кружится,
                На улице бело.
                И превратились лужицы
                В холодное стекло.

                Где летом пели зяблики,
                Сегодня - посмотри! -
                Как розовые яблоки,
                На ветках снегири.

                Снежок изрезан лыжами,
                Как мел, скрипуч и сух,
                И ловит кошка рыжая
                Веселых белых мух.
