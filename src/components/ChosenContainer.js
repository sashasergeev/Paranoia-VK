import React, { useRef, useState } from "react";
import QRCode from "react-qr-code";

const ChosenContainer = ({
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
      <div className="chosenContainer">
        <span className="chosenTitle">{chosen.name}</span>{" "}
        <img className="chosenImg" src={chosen.profileImg} />
      </div>
      {loaded ? (
        <div className="contentContainer">
          {crypkey && <QRCode value={crypkey} size={125} />}
          <div className="Key">Ключ</div>

          {crypkey ? (
            <div className="contentContainer">
              <div className="deleteBtn" onClick={clearKey}>
                Удалить
              </div>
              <input
                readOnly
                className="ActionBtn"
                value={isCopied ? "Скопировано!" : crypkey}
                type="text"
                onClick={saveToClipboard}
              />
              Поделитесь этим ключом с собеседником.
            </div>
          ) : (
            <div className="contentContainer">
              <button onClick={handleKeyGeneration} className="ActionBtn">
                Генерировать
              </button>
              В случае, если с вами уже поделились ключом:
              <input
                ref={keyInputRef}
                type="text"
                placeholder="Введите ключ..."
                className="KeyInput"
              />
              <button
                onClick={() => handleCustomKeyClick(keyInputRef.current.value)}
                className="ActionBtn"
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
