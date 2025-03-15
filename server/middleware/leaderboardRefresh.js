export async function refreshLeaderboard() {
  try {
    const res = await fetch(
      `${process.env.VITE_BACKEND_BASEURL}/api/tests/leaderboard/update`
    );
    if (!res.ok) {
      throw new Error(`http status:${res.status} ${res.statusText}`);
    }
    console.log("Leaderboard was updated");
  } catch (err) {
    console.error("Error fetching udpated leaderboard:", err.message);
  }
}
