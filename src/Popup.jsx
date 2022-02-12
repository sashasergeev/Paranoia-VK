import React, { useEffect, useState } from "react";
import { render } from "react-dom";

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
  generateBtn: {
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
  },
};

const Popup = () => {
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id;
      chrome.tabs.sendMessage(currentTabID, "", (response) => {
        setChosen(response);
      });
    });
  }, []);

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
          <div style={styles.contentContainer}>
            <div>Ключ</div>
            <button style={styles.generateBtn}>Генерировать</button>
          </div>
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
