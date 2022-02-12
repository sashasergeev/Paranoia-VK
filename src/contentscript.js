const getNumOfDialogs = () => {
  const dialogs = document.querySelectorAll("._im_dialog");
  return dialogs.length;
};

// document
// .querySelectorAll(".im-mess--text")
// .forEach((e) => (e.innerHTML = "Working"));

// chrome.runtime.onMessage.addListener((reques, sender, callback) => {
// console.log("Message received from sender", sender.id, reques);
// callback(getNumOfDialogs());
// });

let SELECTED_DIALOG_ID;
// let DIALOG_INFO;

const getDialogInfo = () => {
  const name = document.querySelector("._im_page_peer_name").textContent.trim();
  const profileImg = document.querySelector(".nim-peer_smaller  img").src;
  return { name, profileImg };
};

const observeIsDialogSelected = () => {
  const profileID = document.location.search;
  if (profileID !== "" && SELECTED_DIALOG_ID !== profileID) {
    SELECTED_DIALOG_ID = profileID;
  } else {
    SELECTED_DIALOG_ID = profileID;
  }
};

setInterval(observeIsDialogSelected, 2000);

chrome.runtime.onMessage.addListener((reques, sender, callback) => {
  console.log("Message received from sender", sender.id, reques);
  if (SELECTED_DIALOG_ID !== "") {
    callback(getDialogInfo());
  }
});
