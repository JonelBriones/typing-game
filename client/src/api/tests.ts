const API_URL = import.meta.env.VITE_BACKEND_BASEURL;
const saveTest = async (testData: any) => {
  console.log("fetching...");
  try {
    const res = await fetch(`${API_URL}/api/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });
    console.log("route");

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

const getTestLeaderboard = async () => {
  try {
    const res = await fetch(`${API_URL}/api/tests`);
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

export { saveTest, getTestResults, getTestLeaderboard };
