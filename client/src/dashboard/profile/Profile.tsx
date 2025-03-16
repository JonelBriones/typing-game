import React, { useEffect, useState } from "react";
import styles from "./Profile.module.scss";
import { useAuthContext } from "../../AuthProvider";
import { getProfileStats } from "../../api/tests";
const Profile = () => {
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchData() {
      const profileStats = await getProfileStats(user.username);
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) return <div>loading...</div>;

  return (
    <div className={styles.profile}>
      <div className={styles.profile_info}>
        <div className={styles.profile_details}>
          <p>Username:{user.username}</p>
          <p>Email:{user.email}</p>
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
    </div>
  );
};

export default Profile;
