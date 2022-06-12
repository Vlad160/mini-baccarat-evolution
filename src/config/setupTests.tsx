import nodeCrypto from 'crypto';
window.crypto = nodeCrypto as unknown as Crypto;
