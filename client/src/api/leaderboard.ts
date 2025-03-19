const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

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
export { getLeaderboard };
