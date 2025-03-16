const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const getLeaderboardRefreshTimer = async () => {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard/time`);

    if (!res.ok) {
      console.error("Failed to get leaderboard time");
    }
    return await res.json();
  } catch (err) {
    console.log(err);
    return null;
  }
};
const getLeaderboard = async () => {
  try {
    const res = await fetch(`${API_URL}/api/tests/leaderboard`);
    if (!res.ok) {
      throw new Error(`http status:${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Error fetching test leaderboard:", err.message);
    }
    return null;
  }
};
export { getLeaderboardRefreshTimer, getLeaderboard };
