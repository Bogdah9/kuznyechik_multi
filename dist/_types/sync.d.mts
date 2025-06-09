export declare const encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
export declare const decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
declare const _default: {
    encrypt: (data: Buffer, masterkey: string | Buffer) => Buffer;
    decrypt: (data: Buffer, masterkey: string | Buffer, trimStart?: boolean) => Buffer;
};
export default _default;
