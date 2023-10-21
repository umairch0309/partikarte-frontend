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
  const storedData = localStorage.getItem(itemName);
  if (storedData) {
    const bytes = CryptoJS.AES.decrypt(storedData, CryptKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
  return null;
};
