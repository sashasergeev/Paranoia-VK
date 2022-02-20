import React, { useState } from "react";

const TurnedOff = () => {
  const [hasDeleted, setHasDeleted] = useState(false);

  const handleKeysDelete = () => {
    setHasDeleted(true);
    chrome.storage.local.set({ keys: {} });
  };

  return (
    <>
      <div className="containerOff">Приложение выключено.</div>
      <div>
        {!hasDeleted ? (
          <button onClick={handleKeysDelete} className="deleteBtn">
            Удалить все ключи.
          </button>
        ) : (
          <div>Ключи были успешно удалены.</div>
        )}
        <div className="info">
          Внимание, если вы не сохранили ключи, то вы не сможете получить доступ
          к зашифрованным сообщениям.
        </div>
      </div>
    </>
  );
};

export default TurnedOff;
