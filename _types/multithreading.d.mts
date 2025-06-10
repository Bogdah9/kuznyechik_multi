/**
 * Многопоточное шифрование методом Кузнечик
 * @param data  - шифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 */
export declare const encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
/**
 * Многопоточное дешифрование методом Кузнечик
 * @param data  - дешифруемые данные
 * @param masterkey - ключ
 * @param childs - колличество дочерних процессов по умолчанию all - все
 * @param BITES_FROM_CHILD - сколько байт будет в 1 блоке отправленном дочернему процессу до мегабайта по 16 байт если больше по 512 байт
 * @param trimStart - убрать нули вначале (по умолчанию true)
 */
export declare const decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
/**
 * Многопоточное дешифрование методом Кузнечик
 */
declare const _default: {
    encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
    decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
};
export default _default;
