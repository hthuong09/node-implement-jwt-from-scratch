# Implement JWT from scratch for learning purpose

## What is JWT
JWT or Json Web Token, is a token string that was encoded from JSON string. It stores some user data for authorize a user.

## why JWT
- JWT is stateless, suitable for API authorization
- Unlike session-based authorization, JWT are stored in user's browser, therefore, it's not depend on server. Meaning that one token can be used for as many server as you want as long as those server shared a same key

## Implement JWT
### Creating JWT 
JWT is constructed with three parts:
- Header, which contains information about algorithm for encode and decoding
- Payload, which contains user data or whatever you want to save
- Signature, which are generated from Header, Payload and a secret key. Therefore, as long as the secret key are not leaked. User can not change the header and payload data

JWT construction
```js
// Warning, below are just pesudo-code

// https://jwt.io/introduction/
const base64UrlHeader = base64UrlEncode(header);
const base64UrlPayload = base64UrlEncode(payload);
const base64UrlSignature = base64UrlEncode(ENCRYPTMETHOD(`${base64UrlHeader}.${base64UrlPayload}.`), secretKey); 
const jwt = `${base64UrlHeader}.${base64UrlPayload}.${base64UrlSignature}`;
```

### Verify JWT
```js
# Warning, below are just pesudo-code

const [ base64UrlHeader, base64UrlPayload, base64UrlSignature ] = jwt.split('.');

// Getting algorithm info from header
const header = JSON.parse(base64UrlDecode(base64UrlHeader));
const verifySignature = base64UrlEncode(ENCRYPTMETHOD(`${base64UrlHeader}.${base64UrlPayload}.`), secretKey); 

// Compare with exist signature
```
