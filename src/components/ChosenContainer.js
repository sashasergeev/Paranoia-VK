import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";

const ChosenContainer = ({
  styles,
  loaded,
  crypkey,
  handleCustomKeyClick,
  clearKey,
  handleKeyGeneration,
  chosen,
}) => {
  const keyInputRef = useRef();
  const [isCopied, setIsCopied] = useState(false);

  const saveToClipboard = () => {
    navigator.clipboard.writeText(crypkey);
    setIsCopied(true);
    setInterval(() => setIsCopied(false), 2000);
  };

  return (
    <>
      <div style={styles.chosenContainer}>
        <span style={styles.chosenTitle}>{chosen.name}</span>{" "}
        <img style={styles.chosenImg} src={chosen.profileImg} />
      </div>
      {loaded ? (
        <div style={styles.contentContainer}>
          {crypkey && <QRCode value={crypkey} size={125} />}
          <div style={styles.Key}>Ключ</div>

          {crypkey ? (
            <div style={styles.contentContainer}>
              <div style={styles.deleteBtn} onClick={clearKey}>
                Удалить
              </div>
              <input
                readOnly
                style={styles.ActionBtn}
                value={isCopied ? "Скопировано!" : crypkey}
                type="text"
                onClick={saveToClipboard}
              />
              Поделитесь этим ключом с собеседником.
            </div>
          ) : (
            <div style={styles.contentContainer}>
              <button onClick={handleKeyGeneration} style={styles.ActionBtn}>
                Генерировать
              </button>
              В случае, если с вами уже поделились ключом:
              <input
                ref={keyInputRef}
                type="text"
                placeholder="Введите ключ..."
                style={styles.KeyInput}
              />
              <button
                onClick={() => handleCustomKeyClick(keyInputRef.current.value)}
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
  );
};

export default ChosenContainer;
