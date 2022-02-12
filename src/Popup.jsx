import React, { useEffect, useState } from "react";
import { render } from "react-dom";

const Popup = () => {
  const [chosen, setChosen] = useState(false);

  useEffect(() => {
    chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
      const currentTabID = tabs.length === 0 ? 0 : tabs[0].id;
      chrome.tabs.sendMessage(currentTabID, "", (response) => {});
    });
  }, []);

  return (
    <div
      style={{
        // width: "250px",
        background: "#573fb5c7",
        textAlign: "center",
        width: "275px",
        height: "400px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
      }}
    >
      <h1 style={{ color: "white", margin: "5px 0" }}>Выберите диалог</h1>

      {/* <p style={{ color: "white" }}>Dialogs count: {count}</p> */}
      <small style={{ color: "#b5b5b575", fontWeight: "600" }}>
        Paranoia@VK
      </small>
    </div>
  );
};

export default Popup;

const Destination = document.getElementById("root");
render(<Popup />, Destination);
