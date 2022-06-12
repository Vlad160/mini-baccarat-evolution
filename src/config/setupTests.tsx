import nodeCrypto from 'crypto';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
window.crypto = nodeCrypto;
