import React, { useState } from "react";

const styles = {
  container: {
    borderRadius: "35px",
    fontSize: "16px",
    padding: "6px 12px",
    background: "rgb(255, 255, 255)",
    margin: "15px",
    flex: "1",
    display: "flex",
    justifyContent: "center",
    color: "black",
    alignItems: "center",
  },
  deleteBtn: {
    borderRadius: "35px",
    border: "none",
    margin: "0px 56px",
    background: "#e91e636b",
    padding: "5px 20px",
    color: "white",
    cursor: "pointer",
  },
  info: {
    margin: "8px",
    color: "gray",
  },
};

const TurnedOff = () => {
  const [hasDeleted, setHasDeleted] = useState(false);

  const handleKeysDelete = () => {
    setHasDeleted(true);
    chrome.storage.local.set({ keys: {} });
  };

  return (
    <>
      <div style={styles.container}>Приложение выключено.</div>
      <div>
        {!hasDeleted ? (
          <button onClick={handleKeysDelete} style={styles.deleteBtn}>
            Удалить все ключи.
          </button>
        ) : (
          <div>Ключи были успешно удалены.</div>
        )}
        <div style={styles.info}>
          Внимание, если вы не сохранили ключи, то вы не сможеет получить доступ
          к зашифрованным сообщениям.
        </div>
      </div>
    </>
  );
};

export default TurnedOff;
