const API_BASE_URL = "http://localhost:2222/api";

export const saveTestResult = async (testData) => {
  try {
    console.log("saved results", testData);
    const res = await fetch(`${API_BASE_URL}/tests/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testData),
    });
    if (!res.ok) {
      throw new Error("Failed to save test result");
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error saving test result:", error);
    throw error;
  }
};

export const getTestResults = async (userId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tests/${userId}`);
    if (!res.ok) {
      throw new Error("Failed to fetch test results");
    }
    const data = await res.JSON();
    return data;
  } catch (error) {
    console.error("Error fetching test results:", error);
    throw error;
  }
};
