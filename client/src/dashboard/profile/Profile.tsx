import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { useAuthContext } from "../../AuthProvider";
import { getProfileStats } from "../../api/users";

interface WordsStats {
  [key: number]: {
    wpm: number | null;
    accuracy: number | null;
  };
}
interface Test {
  date: string;
  language: string;
  raw: number;
  seconds: number;
  user: string;
  words: number;
  wpm: number;
  _id: number;
}
type TestExclude = Omit<Test, "__v">;

const Profile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const MODE_TIMED = [15, 30, 60, 120];
  const MODE_WORDS = [10, 25, 50, 100];
  const [tests, setTests] = useState<null | TestExclude[]>(null);

  const [wordsStats, setWordsStats] = useState<WordsStats>({
    10: {
      wpm: null,
      accuracy: null,
    },
    25: {
      wpm: null,
      accuracy: null,
    },
    50: {
      wpm: null,
      accuracy: null,
    },
    100: {
      wpm: null,
      accuracy: null,
    },
  });
  const [timedStats, setTimedStats] = useState({
    timed: {
      15: {
        wpm: null,
        accuracy: null,
      },
      30: {
        wpm: null,
        accuracy: null,
      },
      60: {
        wpm: null,
        accuracy: null,
      },
      120: {
        wpm: null,
        accuracy: null,
      },
    },
  });

  useEffect(() => {
    if (user) {
      setLoading(false);
      if (user) {
        async function fetchData() {
          const result = await getProfileStats(user.username);
          if (!result) {
            console.log("err");
          }
          console.log(result.tests);
          setTests(result.tests);
        }
        fetchData();
      }
    }
  }, [user]);

  function handleStats(mode: string, count: number) {
    if (!tests) return;
    if (!tests.length) return;

    let testByWords = tests.filter((test) => test.words == count);

    testByWords.sort((a, b) => b.wpm - a.wpm);

    if (!testByWords.length) return;
    const bestwpm = testByWords[0].wpm;
    (mode == "words" ? setWordsStats : setTimedStats)((prev: any) => ({
      ...prev,
      [count]: {
        ...prev[count],
        wpm: bestwpm,
      },
    }));
  }

  useEffect(() => {
    if (!tests) return;
    MODE_WORDS.forEach((count) => {
      handleStats("words", count);
    });
    MODE_TIMED.forEach((count) => {
      handleStats("timed", count);
    });
  }, [tests]);

  useEffect(() => {
    console.log(wordsStats);
  }, [wordsStats]);

  if (loading) return <div>loading...</div>;

  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  let joined = new Date(Date.now(user.createdAt)).toLocaleDateString(
    "en-us",
    options as any
  );

  return (
    <div className={styles.profile}>
      <div className={styles.profile_info}>
        <div className={styles.profile_details}>
          <span className={styles.profile_username}>{user.username}</span>
          <span className={styles.profile_joined}>Joined {joined}</span>
        </div>
        <div className={styles.profile_stats}>
          <span className={styles.profile_stat}>
            <span className={styles.stat_label}>tests started</span>
            <span className={styles.value}>data</span>
          </span>
          <span className={styles.profile_stat}>
            <span className={styles.stat_label}>tests completed</span>
            <span className={styles.value}>data</span>
          </span>
          <span className={styles.profile_stat}>
            <span className={styles.stat_label}>time typing</span>
            <span className={styles.value}>data</span>
          </span>
        </div>
      </div>
      <div className={styles.modes}>
        <div className={styles.mode_timed}>
          {MODE_TIMED.map((seconds) => (
            <div key={seconds} className={styles.mode}>
              <span className={styles.mode_label}>{seconds} seconds</span>
              <span className={styles.mode_wpm}>num</span>
              <span className={styles.mode_accuracy}>%</span>
            </div>
          ))}
        </div>
        <div className={styles.mode_words}>
          {MODE_WORDS.map((word) => (
            <div key={word} className={styles.mode}>
              <span className={styles.mode_label}>{word} words</span>
              <span className={styles.mode_wpm}>num</span>
              <span className={styles.mode_accuracy}>%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
