import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.scss";
const Leaderboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleTime, setToggleTime] = useState(15);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:2222/api/tests");
        if (!res.ok) {
          throw new Error("Response state:");
        }
        const json = await res.json();

        setTests(json);
        setLoading(false);
      } catch (err) {
        if (err instanceof TypeError) {
          console.error(err.message);
        }
      }
    };
    fetchData();
  }, []);
  if (loading) return <div>Loading...</div>;

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  function formatDate(date: Date) {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("en-us", options as any);
  }

  return (
    <div className={styles.container}>
      <div className={styles.buttonContainer}>
        <div>
          <button
            className={`${styles.button} ${
              toggleTime == 15 ? styles.toggle : ""
            }`}
            onClick={() => setToggleTime(15)}
          >
            time 15
          </button>
          <button
            className={`${styles.button} ${
              toggleTime == 60 ? styles.toggle : ""
            }`}
            onClick={() => setToggleTime(60)}
          >
            time 60
          </button>
        </div>
      </div>

      <h1 className={styles.h1}>
        All-time English | Time {toggleTime} Leaderboard
      </h1>
      {/*  convert into tables */}
      {loading ? (
        <div>loading</div>
      ) : (
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <div className={styles.row}>
              <div>#</div>
              <div className={styles.userInfo}>
                <span>name</span>
              </div>
              <div className={styles.userTestStats}>
                <span>wpm</span>
                <span>raw</span>
                <span>date</span>
              </div>
            </div>
          </div>
          <div className={styles.tableBody}>
            {tests.map(({ date, user, raw, wpm, _id }, idx) => (
              <div key={_id} className={styles.row}>
                <div>{idx + 1}</div>
                <div className={styles.userInfo}>
                  <span className={styles.userImg} />
                  <span className={styles.userName}>{user}</span>
                </div>
                <div className={styles.userTestStats}>
                  <span>{wpm}</span>
                  <span>{raw}</span>
                  <span>{formatDate(date)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
