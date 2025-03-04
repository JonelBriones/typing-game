import React, { useEffect } from "react";
import styles from "./Cloudy.module.scss";
import Cloud from "./Cloud.jsx";

const Cloudy = () => {
  return (
    <div className={`${styles.container}`}>
      <Cloud />
      {/* <div id="cloudy" className={styles.cloudy}></div> */}
      {/* <div>top word</div>
      <div>bottom word</div> */}
    </div>
  );
};

export default Cloudy;
