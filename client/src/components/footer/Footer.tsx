import styles from "./Footer.module.scss";
const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.guide}>How to play</div>
      <ul>
        <li>
          <button>contact</button>
        </li>
        <li>
          <button>support</button>
        </li>
        <li>
          <a href="https://github.com/JonelBriones">github</a>
        </li>
      </ul>
    </div>
  );
};

export default Footer;
