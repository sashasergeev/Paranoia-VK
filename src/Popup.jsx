import React, { useEffect, useState, useRef } from "react";
import { render } from "react-dom";

import AES from "crypto-js/aes";
import enc from "crypto-js/enc-utf8";

const styles = {
  container: {
    background: "#573fb5c7",
    textAlign: "center",
    width: "275px",
    height: "400px",
    display: "flex",
    flexDirection: "column",
  },
  pickDialog: { color: "white", margin: "5px 0" },
  chosenContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#5d4e97",
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
  tradeMark: { color: "#b5b5b575", fontWeight: "600", paddingBottom: "5px" },
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
};

const Popup = () => {
  // dialog data (name, profile Pic, user ID)
  const [chosen, setChosen] = useState(false);
  // key to encrypt/decrypt messages
  const [key, setKey] = useState();
  // state to make sure storage is checked whether there is a key or not
  const [loaded, setLoaded] = useState(false);

  // ref to input with users key
  const keyInputRef = useRef();

  const saveKey = () => {
    const value = { [chosen.SELECTED_DIALOG_ID]: key };
    chrome.storage.local.get("keys", (vals) => {
      let keys = { ...vals.keys, ...value };
      chrome.storage.local.set({ keys });
    });
  };

  const handleKeyGeneration = (e) => {
    const genKey = crypto.randomUUID();
    setKey(genKey);
  };

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

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id;
      chrome.tabs.sendMessage(currentTabID, "", (response) => {
        setChosen(response);
        chrome.storage.local.get(["keys"], (values) => {
          // need to implement loading screen until the moment storage is checked
          if (values.keys) {
            if (values.keys.hasOwnProperty(response.SELECTED_DIALOG_ID)) {
              setKey(values.keys[response.SELECTED_DIALOG_ID]);
            }
          }
          setLoaded(true);
        });
      });
    });
  }, []);

  useEffect(() => {
    if (key) {
      saveKey();
    }
  }, [key]);

  return (
    <div
      style={{
        ...styles.container,
        justifyContent: !chosen ? "space-evenly" : "space-between",
      }}
    >
      {chosen ? (
        <>
          <div style={styles.chosenContainer}>
            <span style={styles.chosenTitle}>{chosen.name}</span>{" "}
            <img style={styles.chosenImg} src={chosen.profileImg} />
          </div>
          {loaded ? (
            <div style={styles.contentContainer}>
              <div style={styles.Key}>Ключ</div>
              {key ? (
                <div style={styles.contentContainer}>
                  <input readOnly value={key} type="text" />
                  Поделитесь этим ключом с собеседником.
                </div>
              ) : (
                <div style={styles.contentContainer}>
                  <button
                    onClick={handleKeyGeneration}
                    style={styles.ActionBtn}
                  >
                    Генерировать
                  </button>
                  В случае, если с вами уже поделились ключом:
                  <input
                    ref={keyInputRef}
                    type="text"
                    placeholder="Введите ключ..."
                  />
                  <button
                    onClick={() => setKey(keyInputRef.current.value)}
                    style={styles.ActionBtn}
                  >
                    Применить
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>Loading</>
          )}
        </>
      ) : (
        <h1 style={styles.pickDialog}>Выберите диалог</h1>
      )}

      <small style={styles.tradeMark}>Paranoia@VK</small>
    </div>
  );
};

export default Popup;

const Destination = document.getElementById("root");
render(<Popup />, Destination);
