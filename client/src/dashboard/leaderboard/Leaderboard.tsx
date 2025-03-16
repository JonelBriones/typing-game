import { useEffect, useState } from "react";
import styles from "./Leaderboard.module.scss";

import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { getLeaderboard } from "../../api/leaderboard";

const Leaderboard = () => {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggleTime, setToggleTime] = useState(15);

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };

  function formatDate(date: Date) {
    const formatDate = new Date(date);
    return formatDate.toLocaleDateString("en-us", options as any);
  }

  useEffect(() => {
    const fetchData = async () => {
      const leaderboard = await getLeaderboard();
      console.log(leaderboard.data);
      if (leaderboard) {
        setTests(leaderboard.data);
        setLoading(false);
      } else {
        console.error("Failed to fetch leaderboard data.");
      }
    };
    fetchData();
  }, []);

  const [hours, setHours] = useState(new Date(Date.now()).getHours());
  const [minutes, setMinutes] = useState(new Date(Date.now()).getMinutes());
  const [seconds, setSeconds] = useState(new Date(Date.now()).getSeconds());

  useEffect(() => {
    const intervalId = setInterval(() => {
      let hours = new Date(Date.now()).getHours();
      let seconds = new Date(Date.now()).getSeconds();
      let minutes = new Date(Date.now()).getMinutes();
      setHours(hours);
      setMinutes(minutes);
      setSeconds(seconds);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

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
      {!loading && (
        <>
          <p>
            updates in{" "}
            {`${String(24 - hours).padStart(2, "0")}:${String(
              59 - minutes
            ).padStart(2, "0")}:${String(59 - seconds).padStart(2, "0")}`}
          </p>
          {/*  convert into tables */}
          {loading ? (
            <div className={styles.loading}>
              <LoadingSpinner size={"5rem"} />
            </div>
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
        </>
      )}
    </div>
  );
};

export default Leaderboard;
