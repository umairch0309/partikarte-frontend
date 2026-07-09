import CryptoJS from "crypto-js";
import { CryptKey } from "../constants";

// Function to encrypt and store data in local storage
export const setEncryptedData = (itemName, data) => {
  const encryptedData = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    CryptKey
  ).toString();
  localStorage.setItem(itemName, encryptedData);
};

// Function to retrieve and decrypt data from local storage
export const getDecryptedData = (itemName) => {
  try {
    const storedData = localStorage.getItem(itemName);
    if (!storedData) return null;

    const bytes = CryptoJS.AES.decrypt(storedData, CryptKey);
    const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
    if (!decryptedData) return null;

    return JSON.parse(decryptedData);
  } catch {
    return null;
  }
};
