chrome.runtime.onInstalled.addListener(function () {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains a 'g' ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { urlContains: "vk.com/im" },
          }),
        ],
        // And shows the extension's page action.
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

// make icon depend on the status of an extension
const icons = {
  on: {
    32: "icons/on-favicon-32x32.png",
    16: "icons/on-favicon-16x16.png",
  },
  off: {
    32: "icons/off-favicon-32x32.png",
    16: "icons/off-favicon-16x16.png",
  },
};

chrome.runtime.onMessage.addListener(function (msg, sender) {
  if (msg.action === "updateIcon" && sender?.tab?.id) {
    chrome.pageAction.setIcon({
      tabId: sender.tab.id,
      path: icons[msg.value],
    });
  }
});
