import React, { useState, useEffect } from "react";

const styles = {
  switchBtn: {
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "10px",
    gap: "6px",
    overflow: "hidden",
    cursor: "pointer",
  },
  off: {
    backgroundColor: "#e91e63",
  },
  on: { backgroundColor: "#121838" },
  circle: {
    borderRadius: "50%",
    height: "25px",
    width: "25px",
    backgroundColor: "#bbb",
    display: "inline-block",
  },
  circleOff: {
    backgroundColor: "#171420",
    boxShadow: "-1px 1px 0px 25px #171420",
  },
  circleOn: {
    backgroundColor: "#ff0057",
    boxShadow: "-1px 1px 9px 25px #ff0057",
  },
};

const Status = () => {
  // status component with help of which user can turn on/off functionality
  const [status, setStatus] = useState(true);

  const toggleExtension = () => {
    chrome.storage.local.set({ on: !status });
    setStatus(!status);
  };

  useEffect(
    () =>
      chrome.storage.local.get("on", (res) => {
        setStatus(res.on);
      }),
    []
  );

  // styles
  const circleOn = { ...styles.circle, ...styles.circleOn };
  const circleOff = { ...styles.circle, ...styles.circleOff };
  const switchOn = { ...styles.switchBtn, ...styles.on };
  const switchOff = { ...styles.switchBtn, ...styles.off };

  return (
    <div style={status ? switchOn : switchOff} onClick={toggleExtension}>
      <span style={status ? circleOn : circleOff} className="dot"></span>
      <span style={{ flex: "1", textAlign: "center" }}>
        {status ? "Отключить" : "Включить"}
      </span>
      <span style={status ? circleOn : circleOff} className="dot"></span>
    </div>
  );
};

export default Status;
