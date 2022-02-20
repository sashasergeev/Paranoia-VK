import React from "react";

const Status = ({ toggle, status }) => {
  return (
    <div className={`switchBtn ${status ? "on" : "off"}`} onClick={toggle}>
      <span className={`dot circle ${status ? "on" : "off"}`}></span>
      <span className="statusText">{status ? "Отключить" : "Включить"}</span>
      <span className={`dot circle ${status ? "on" : "off"}`}></span>
    </div>
  );
};

export default Status;
