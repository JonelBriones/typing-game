const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const getRefreshToken = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.log("Error fetching username:", err.message);
      return null;
    }
  }
};

const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/user/${id}`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Error fetching user by id: ", err.message);
      return null;
    }
  }
};

const login = async (req: { email: string; password: string }) => {
  try {
    const res = await fetch(`${API_URL}/api/user/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (res.status == 401) {
      return await res.json();
    }

    if (!res.ok) {
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error("Failed to login");
      return null;
    }
  }
};

export { getRefreshToken, getUserById, login };
