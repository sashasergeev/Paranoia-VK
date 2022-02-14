import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";

import Status from "./components/Status";

import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";
import ChosenContainer from "./components/ChosenContainer";
import TurnedOff from "./components/TurnedOff";

const styles = {
  container: {
    background: "#c1b7eb",
    textAlign: "center",
    width: "275px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
    background: "#d95996",
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

  // ref to input with users key
  const keyInputRef = useRef();

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
  const handleCustomKeyClick = () => setKey(keyInputRef.current.value);

  const checkAES = (genKey) => {
    // checking how to encrypt/decrypt things
    console.log("key", genKey);
    const message = "Hi, i am sasha! i've beeen here before....";

    const encrypt = AES.encrypt(message, genKey);
    console.log("encrypt", encrypt);
    console.log("encrypt-string", encrypt.toString());

    console.log("decrypt", AES.decrypt(encrypt, genKey));
    console.log("decrypt-toString", AES.decrypt(encrypt, genKey).toString(enc));
  };

  const getCurrentDialog = () =>
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id;
      chrome.tabs.sendMessage(currentTabID, "", (response) => {
        setChosen(response);
        if (response) {
          chrome.storage.local.get(["keys"], (values) => {
            // need to implement loading screen until the moment storage is checked
            if (values.keys) {
              if (values.keys.hasOwnProperty(response.SELECTED_DIALOG_ID)) {
                setKey(values.keys[response.SELECTED_DIALOG_ID]);
              }
            }
            setLoaded(true);
          });
        }
      });
    });

  // app status
  const toggleApp = () => {
    chrome.storage.local.set({ on: !status });
    setStatus(!status);
    if (!status === true) {
      getCurrentDialog();
    }
  };

  // useEffect(() => {
  //   if (status) {
  //     setTimeout(getCurrentDialog, 1500);
  //   }
  // }, [status]);

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
      checkAES(key);
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
                clearKey={clearKey}
                handleKeyGeneration={handleKeyGeneration}
                keyInputRef={keyInputRef}
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
