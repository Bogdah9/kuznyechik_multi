export declare const encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
export declare const decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
declare const _default: {
    encrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number) => Promise<Buffer>;
    decrypt: (data: Buffer, masterkey: string | Buffer, childs: number | "all", BITES_FROM_CHILD?: number, trimStart?: boolean) => Promise<Buffer>;
};
export default _default;
