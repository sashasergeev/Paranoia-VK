import React, { useEffect, useState } from "react";
import { render } from "react-dom";

import Status from "./components/Status";

import ChosenContainer from "./components/ChosenContainer";
import TurnedOff from "./components/TurnedOff";

const styles = {
  container: {
    background: "rgb(23 20 32)",
    textAlign: "center",
    width: "275px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    color: "white",
  },
  pickDialog: { color: "white", margin: "5px 0" },
  chosenContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#171420",
    boxShadow: "-1px 0px 14px 0px #00000085",
    padding: "5px",
    marginBottom: "5px",
  },
  chosenTitle: { color: "white", fontWeight: "700", fontSize: "15px" },
  chosenImg: {
    width: "35px",
    height: "35px",
    borderRadius: "100%",
  },
  tradeMark: { color: "#787878", fontWeight: "600", paddingBottom: "5px" },
  ActionBtn: {
    padding: "7px 14px",
    border: "none",
    borderRadius: "20px",
    width: "fit-content",
    cursor: "pointer",
    textAlign: "center",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  Key: {
    fontWeight: "700",
    fontSize: "20px",
  },
  deleteBtn: {
    color: "white",
    background: "rgba(233, 30, 99, 0.42)",
    cursor: "pointer",
    fontSize: "13px",
    padding: "5px 9px",
    borderRadius: "9999px",
  },
  KeyInput: {
    border: "none",
    padding: "5px 9px",
    borderRadius: "99px",
  },
};

const Popup = () => {
  // dialog data (name, profile Pic, user ID)
  const [chosen, setChosen] = useState(false);
  // key to encrypt/decrypt messages
  const [key, setKey] = useState();
  // state to make sure storage is checked whether there is a key or not
  const [loaded, setLoaded] = useState(false);
  // state of app
  const [status, setStatus] = useState(false);

  // managing key in storage
  const saveKey = () => {
    const value = { [chosen.SELECTED_DIALOG_ID]: key };
    chrome.storage.local.get("keys", (vals) => {
      let keys = { ...vals.keys, ...value };
      chrome.storage.local.set({ keys });
    });
  };
  const clearKey = () => {
    chrome.storage.local.get("keys", ({ keys }) => {
      delete keys[chosen.SELECTED_DIALOG_ID];
      chrome.storage.local.set({ keys });
    });
    setKey(false);
  };

  const handleKeyGeneration = (e) => setKey(crypto.randomUUID());

  const sendMsg = (data, callback = null) => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id;
      chrome.tabs.sendMessage(currentTabID, data, (res) => callback(res));
    });
  };

  const handleCustomKeyClick = (value) => {
    setKey(value);
    sendMsg({ action: "DECRYPT_MESSAGES", value });
  };

  const getCurrentDialog = () => {
    function callback(response) {
      setChosen(response);
      if (response) {
        chrome.storage.local.get(["keys"], (values) => {
          // need to implement loading screen until the moment storage is checked
          if (values?.keys?.[response.SELECTED_DIALOG_ID]) {
            setKey(values.keys[response.SELECTED_DIALOG_ID]);
          }
          setLoaded(true);
        });
      }
    }
    sendMsg({ action: "POPUP_GET_DATA" }, callback);
  };
  // app status
  const toggleApp = () => {
    chrome.storage.local.set({ on: !status });
    setStatus(!status);
    if (!status === true) {
      getCurrentDialog();
    }
  };

  useEffect(() => {
    getCurrentDialog();
    // get status of app
    chrome.storage.local.get("on", (res) => {
      setStatus(res.on);
    });
  }, []);
  useEffect(() => {
    if (key) {
      saveKey();
    }
  }, [key]);

  return (
    <>
      <Status toggle={toggleApp} status={status} />
      <div
        style={{
          ...styles.container,
          justifyContent: !chosen ? "space-evenly" : "space-between",
        }}
      >
        {status ? (
          <>
            {chosen ? (
              <ChosenContainer
                styles={styles}
                chosen={chosen}
                loaded={loaded}
                crypkey={key}
                handleCustomKeyClick={handleCustomKeyClick}
                handleKeyGeneration={handleKeyGeneration}
                clearKey={clearKey}
              />
            ) : (
              <h1 style={styles.pickDialog}>Выберите диалог</h1>
            )}
          </>
        ) : (
          <TurnedOff />
        )}

        <small style={styles.tradeMark}>Paranoia@VK</small>
      </div>
    </>
  );
};

export default Popup;

const Destination = document.getElementById("root");
render(<Popup />, Destination);
