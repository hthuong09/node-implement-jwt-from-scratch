const { base64url_encode, base64url_decode, escape } = require('./base64');
const crypto = require('crypto');

const supportedAlgorithms = {
    HS256: { alg: 'sha256', signMethod: 'hash' },
    HS384: { alg: 'sha384', signMethod: 'hash' },
    HS512: { alg: 'sha512', signMethod: 'hash' },
    RS256: { alg: 'RSA-SHA256', signMethod: 'sign' },
};


const verifySignature = ({
    base64UrlHeaders,
    base64UrlPayload,
    key,
    algorithm,
    signature,
}) => {
    const supportedAlgorithm = supportedAlgorithms[algorithm];
    if (!supportedAlgorithm) throw new Error('Non supported algorithm');
    if (supportedAlgorithm.signMethod === 'hash') {
        return signature === signSignature({ base64UrlHeaders, base64UrlPayload, key, algorithm, signature })
    }

    if (supportedAlgorithm.signMethod === 'sign') {
        const signData = `${base64UrlHeaders}.${base64UrlPayload}`;
        return crypto.createVerify(supportedAlgorithm.alg).update(signData).verify(key, unescape(signature), 'base64');
    }

    throw new Error('Unsupported sign method');
}

const signSignature = ({
    base64UrlHeaders,
    base64UrlPayload,
    key,
    algorithm,
}) => {
    const supportedAlgorithm = supportedAlgorithms[algorithm];
    if (!supportedAlgorithm) throw new Error('Non supported algorithm');
    const signData = `${base64UrlHeaders}.${base64UrlPayload}`;
    if (supportedAlgorithm.signMethod === 'hash') {
        return escape(
            crypto
                .createHmac(supportedAlgorithm.alg, key)
                .update(signData)
                .digest('base64')
        );
    }

    if (supportedAlgorithm.signMethod === 'sign') {
        return escape(
            crypto
                .createSign(supportedAlgorithm.alg)
                .update(signData)
                .sign(key, 'base64')
        );
    }

    throw new Error('Unsupported sign method');
};

const sign = (payload, secretOrPrivateKey, options) => {
    const { algorithm, expiresIn } = options;
    const base64UrlHeaders = base64url_encode(
        JSON.stringify({
            alg: algorithm || 'HS256',
            typ: 'JWT',
        })
    );
    const base64UrlPayload = base64url_encode(
        JSON.stringify({
            ...payload,
            exp: new Date().getTime() + expiresIn,
        })
    );

    const base64UrlSignature = signSignature({
        base64UrlHeaders,
        base64UrlPayload,
        key: secretOrPrivateKey,
        algorithm: algorithm || 'HS256',
    });
    return `${base64UrlHeaders}.${base64UrlPayload}.${base64UrlSignature}`;
};

const verify = (token, secretOrPublicKey) => {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');
    const headers = JSON.parse(base64url_decode(parts[0]));
    const payload = JSON.parse(base64url_decode(parts[1]));
    if (new Date().getTime() > payload.exp) return false; // Token expired
    const isValidSignature = verifySignature({
        base64UrlHeaders: parts[0],
        base64UrlPayload: parts[1],
        key: secretOrPublicKey,
        algorithm: headers.alg,
        signature: parts[2]
    });

    if (isValidSignature) return payload; // Valid signature

    return false;
};

module.exports = {
    sign,
    verify,
};
