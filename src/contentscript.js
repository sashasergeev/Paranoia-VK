import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";

// const getNumOfDialogs = () => {
//   const dialogs = document.querySelectorAll("._im_dialog");
//   return dialogs.length;
// };

// chrome.runtime.onMessage.addListener((reques, sender, callback) => {
// console.log("Message received from sender", sender.id, reques);
// callback(getNumOfDialogs());
// });

let SELECTED_DIALOG_ID;
let key;
const ENCRYPTED_PREFIX = "Paranoia@EmulatedFreedom__";
let numOfViewedMessages = 0;

const getDialogInfo = () => {
  const name = document.querySelector("._im_page_peer_name").textContent.trim();
  const profileImg = document.querySelector(".nim-peer_smaller  img").src;
  return { name, profileImg, SELECTED_DIALOG_ID };
};

const decryptMessages = () => {
  const messages = document.querySelectorAll("._im_log_body");
  numOfViewedMessages += messages.length;
  // find encrypted messages
  const encryptedMessages = [...messages].filter((e) =>
    e.innerText.startsWith(ENCRYPTED_PREFIX)
  );
  // decrypt messages
  encryptedMessages.map((e) => (e.innerText = decrypt(e.innerText)));
};

const decrypt = (message) => {
  const rawHash = message.replace(ENCRYPTED_PREFIX, "").split(" ")[0];
  const decryption = AES.decrypt(rawHash, key).toString(enc);
  return decryption.length !== 0
    ? decryption
    : "Paranoia@VK: Ошибка. Возможно, это сообщение было зашифровано другим ключом. Сменить ключ вы можете с помощью удаления текущего и ввода старого в окне расширения.";
};

const observeIsDialogSelected = () => {
  const profileID = document.location.search;
  if (SELECTED_DIALOG_ID !== profileID) {
    numOfViewedMessages = 0;
    SELECTED_DIALOG_ID = profileID;

    if (profileID !== "") {
      chrome.storage.local.get("keys", (values) => {
        if (values.keys) {
          if (values.keys.hasOwnProperty(profileID)) {
            // fire function to decrypt/encrypt messages
            key = values.keys[profileID];
            decryptMessages();
          }
        }
      });
    } else {
      key = null;
    }
  }
  if (profileID !== "") {
    // make sure messages are being decrypted
    const messages = document.querySelectorAll("._im_log_body");
    if (numOfViewedMessages > 0 && messages.length > numOfViewedMessages) {
      decryptMessages();
    }
  } else {
    numOfViewedMessages = 0;
  }
};

setInterval(observeIsDialogSelected, 2000);

chrome.runtime.onMessage.addListener((reques, sender, callback) => {
  console.log("Message received from sender", sender.id, reques);
  if (SELECTED_DIALOG_ID !== "") {
    // decryptMessages();
    callback(getDialogInfo());
  }
});
