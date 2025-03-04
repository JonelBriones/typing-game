import React, { useEffect } from "react";
import styles from "./Cloudy.module.scss";
import Cloud from "./Cloud.js";

const Cloudy = () => {
  return (
    <div className={`${styles.container}`}>
      <Cloud />
    </div>
  );
};

export default Cloudy;
