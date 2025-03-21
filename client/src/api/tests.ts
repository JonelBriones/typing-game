const API_URL = import.meta.env.VITE_BACKEND_BASEURL;
const saveTest = async (testData: any) => {
  try {
    const res = await fetch(`${API_URL}/api/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });

    if (!res.ok) {
      throw new Error(`http status:${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Error saving test result:", err.message);
    }
    return null;
  }
};

const getTestResults = async (userId: string) => {
  try {
    const res = await fetch(`${API_URL}/api/tests/${userId}`);
    if (!res.ok) {
      throw new Error(`http status:${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Error fetching test results:", err);
    }
    return null;
  }
};

const updateLeaderboard = async () => {
  try {
    const res = await fetch(`${API_URL}/api/leaderboard/update`);
    if (!res.ok) {
      throw new Error(`http status:${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Error fetching leaderboard update timer:", err);
    }
    return null;
  }
};

export { saveTest, getTestResults, updateLeaderboard };
