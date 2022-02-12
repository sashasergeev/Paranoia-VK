const getNumOfDialogs = () => {
  const dialogs = document.querySelectorAll("._im_dialog");
  return dialogs.length;
};

// document
// .querySelectorAll(".im-mess--text")
// .forEach((e) => (e.innerHTML = "Working"));

// chrome.runtime.onMessage.addListener((msg, sender, callback) => {
// console.log("Message received from sender", sender.id, msg);
// callback(getNumOfDialogs());
// });
