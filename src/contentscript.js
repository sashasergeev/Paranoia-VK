import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";

// on / off extension toggler
// when app is off - app no longer decrypts messages and no longer
let isAppOn;
(function () {
  chrome.storage.local.get("on", (res) => {
    if (res.hasOwnProperty("on")) {
      isAppOn = res.on;
    } else {
      isAppOn = true;
    }
    sendUpdateIcon(isAppOn ? "on" : "off");
  });
})();
// also need to track value change
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (changes.hasOwnProperty("on")) {
    isAppOn = changes.on.newValue;
    sendUpdateIcon(isAppOn ? "on" : "off");
  }
});
// icon change
function sendUpdateIcon(value) {
  chrome.runtime.sendMessage({
    action: "updateIcon",
    value,
  });
}
// ---

// main part
let SELECTED_DIALOG_ID;
let key;
const ENCRYPTED_PREFIX = "Paranoia@EmulatedFreedom__";
let numOfViewedMessages = 0;

const getDialogInfo = () => {
  if (SELECTED_DIALOG_ID) {
    const name = document
      .querySelector("._im_page_peer_name")
      .textContent.trim();
    const profileImg = document.querySelector(".nim-peer_smaller  img").src;
    return { name, profileImg, SELECTED_DIALOG_ID };
  }
};

const decryptMessages = () => {
  const messages = [...document.querySelectorAll("._im_log_body")].reverse();
  if (messages.length > 0) {
    numOfViewedMessages += messages.length - numOfViewedMessages;
    // find encrypted messages
    const encryptedMessages = messages.filter((e) =>
      e.innerText.startsWith(ENCRYPTED_PREFIX)
    );

    // inject extension mark
    const trademark = document.createElement("span");
    trademark.setAttribute("class", "trademarkOnMessage");

    // decrypt messages
    encryptedMessages.map((message) => {
      message.innerText = decrypt(message.innerText);

      // trademark
      const mark = trademark.cloneNode();
      mark.innerText = "[P@VK]";
      message.appendChild(mark);
      return message;
    });
  }
};

const decrypt = (message) => {
  const rawHash = message.replace(ENCRYPTED_PREFIX, "").split(" ")[0];
  let decryption;
  // try block beacuse of Malformed UTF-8 data Error
  try {
    decryption = AES.decrypt(rawHash, key).toString(enc);
  } catch (error) {
    decryption = "";
  }
  return decryption.length !== 0
    ? decryption
    : "Paranoia@VK: Ошибка. Возможно, это сообщение было зашифровано другим ключом. Сменить ключ вы можете с помощью удаления текущего и ввода старого в окне расширения.";
};

const observeIsDialogSelected = () => {
  const btn = document.querySelector("#paranoiaBtn");
  if (isAppOn) {
    // check if btn is present - if not - add it
    if (!btn) addSendButton();

    const urlParams = new URLSearchParams(document.location.search);
    const profileID = urlParams.get("sel") ?? "";

    if (SELECTED_DIALOG_ID !== profileID) {
      numOfViewedMessages = 0;
      SELECTED_DIALOG_ID = profileID;

      if (profileID !== "") {
        chrome.storage.local.get("keys", (values) => {
          if (values?.keys?.[profileID]) {
            // fire function to decrypt/encrypt messages
            key = values.keys[profileID];
            decryptMessages();
          }
        });
      } else {
        key = null;
      }
    }
    if (profileID !== "") {
      // make sure messages are being decrypted
      const messages = document.querySelectorAll("._im_log_body");
      if (messages.length > numOfViewedMessages && key) {
        decryptMessages();
      }
    } else {
      numOfViewedMessages = 0;
    }
  } else {
    if (btn) btn.remove();
  }
};

setInterval(observeIsDialogSelected, 2000);

chrome.runtime.onMessage.addListener((reques, sender, callback) => {
  const isChosen = SELECTED_DIALOG_ID !== "";
  if (reques.action === "POPUP_GET_DATA" && isChosen) {
    // provide data to popup
    callback(getDialogInfo());
  } else if (reques.action === "DECRYPT_MESSAGES" && isChosen) {
    // when key is assigned, decrypt messages (only when custom key was inputted).
    key = reques.value;
    numOfViewedMessages = 0;
    decryptMessages();
  }
});

const encryptMessage = (message) => {
  if (key) {
    return AES.encrypt(message, key).toString();
  } else {
    return "";
  }
};

// inject send encrypted message button
function addSendButton() {
  const btn = document.createElement("input");
  btn.value = "Paranoia@Send";
  btn.id = "paranoiaBtn";
  btn.type = "submit";
  btn.setAttribute("class", "ParanoiaSendBtn");
  const messengerMenuBox = document.querySelector("._im_chat_input_parent");
  if (messengerMenuBox) {
    messengerMenuBox.appendChild(btn);
    sendBtnAction();
  }
}
function sendBtnAction() {
  document.querySelector("#paranoiaBtn").addEventListener("click", (e) => {
    const input = document.querySelector("._im_text");
    if (input.innerHTML.length === 0) {
      alert("Введите сообщение...");
      return;
    }
    // get all content from input into 1 string
    const inputContent = input.innerHTML
      .replace(/<[^>]*>/g, " ")
      .replace(/  +/g, " ");
    const encryptedMessage = encryptMessage(inputContent);

    if (encryptMessage !== "") {
      input.innerHTML = `${ENCRYPTED_PREFIX}${encryptedMessage}`;
      document.querySelector(".im-send-btn_send").click();
    } else {
      alert("Перезагрузите страницу.");
    }
  });
}
