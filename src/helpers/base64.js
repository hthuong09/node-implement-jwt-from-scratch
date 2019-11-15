const escape = string => {
    return string
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '');
};

const unescape = string => {
    const padding = string.length % 4;
    return `${string}${padding === 2 ? '==' : ''}${padding === 3 ? '=' : ''}`
        .replace('-', '+')
        .replace('_', '/');
};

const base64url_encode = string => {
    return escape(Buffer.from(string, 'utf8').toString('base64'));
};

const base64url_decode = string => {
    return Buffer.from(unescape(string), 'base64').toString('utf8');
};

module.exports = {
    base64url_decode,
    base64url_encode,
    escape,
    unescape,
};
