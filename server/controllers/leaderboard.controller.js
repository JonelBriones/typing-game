import Leaderboard from "../models/Leaderboard.js";
const getLeaderboardRefreshTimer = async (req, res) => {
  try {
    const leaderboard = await Leaderboard.find();

    if (!leaderboard) {
      leaderboard.status(400).json({ message: "Failed to fetch leaderboard" });
    }
    console.log("leaderboard", leaderboard);
    return res.json(leaderboard);
  } catch (err) {
    return;
  }
};
export { getLeaderboardRefreshTimer };
