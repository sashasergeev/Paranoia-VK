import React from "react";

const ChosenContainer = ({
  styles,
  loaded,
  crypkey,
  handleCustomKeyClick,
  clearKey,
  handleKeyGeneration,
  chosen,
  keyInputRef,
}) => {
  return (
    <>
      <div style={styles.chosenContainer}>
        <span style={styles.chosenTitle}>{chosen.name}</span>{" "}
        <img style={styles.chosenImg} src={chosen.profileImg} />
      </div>
      {loaded ? (
        <div style={styles.contentContainer}>
          <div style={styles.Key}>Ключ</div>

          {crypkey ? (
            <div style={styles.contentContainer}>
              <div style={styles.deleteBtn} onClick={clearKey}>
                Удалить
              </div>
              <input
                readOnly
                style={styles.ActionBtn}
                value={crypkey}
                type="text"
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
              <button onClick={handleCustomKeyClick} style={styles.ActionBtn}>
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
