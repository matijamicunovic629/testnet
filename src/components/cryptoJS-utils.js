import CryptoJS from "crypto-js"

export const encData = (msg, key) => {
    return CryptoJS.AES.encrypt(msg, key).toString();
}

export const decData = (msg, key) => {
    return CryptoJS.AES.decrypt(msg, key).toString(CryptoJS.enc.Utf8);
}
