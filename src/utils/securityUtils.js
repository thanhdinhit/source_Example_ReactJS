// import jsonwebtoken from 'jsonwebtoken';
import * as CryptoJS from 'crypto-js';

export function hashPassword(password, key) {
    let hashPassWord = generateSignature(password, key, null, true);
    let hashKey = generateSignature(key, hashPassWord, null, true);
    let hashPassWord1 = generateSignature(hashPassWord, hashKey, null, true);

    return hashPassWord1;
}

export function generateSignature(method, path, timestamp, nonce, body, token, secret) {
    let baseString = encodeURIComponent(method) + '&' +
                        encodeURIComponent(path) + '&' +
                        encodeURIComponent(timestamp) + '&' +
                        encodeURIComponent(nonce) + '&' +
                        encodeURIComponent(body);
    let key = token + "&" + secret;
    let signature = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(baseString, key));

    return signature;
}

export function generateNonce() {
    //Random string with 18 character
    let strRandom = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 18);
    //Get date with format YYYYMMDDHHMMSS
    let date = new Date();
    let dateString = date.toISOString().split('.')[0].replace(/[-T:]/g, '');
    //Return nonce = string + date
    return strRandom + dateString;
};

export function generateTimestamp() {
    // Output: the milliseconds elapsed since the UNIX epoch
    // Sample: 1476330949
    return Math.floor(Date.now() / 1000);
};

export function sha256(password, username) {
    return CryptoJS.SHA256(password+username).toString();
}