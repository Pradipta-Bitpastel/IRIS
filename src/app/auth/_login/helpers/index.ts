import CryptoJS from "crypto-js";
const secretKey ="defaultSecretKey123!";
// Function to encrypt the password
export const encryptPassword = (password) => {
    return CryptoJS.AES.encrypt(password, secretKey).toString();
};

// Function to decrypt the password
export const decryptPassword = (encryptedPassword) => {
    const bytes = CryptoJS.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
};