const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const getRefreshToken = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/refresh`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    const data = await res.json();

    if (!res.ok) {
      console.log(data.message);
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }

    return data;
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(err);
    }
    return null;
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
      console.error(err);
    }
    return null;
  }
};

const signup = async (req: any) => {
  try {
    const res = await fetch(`${API_URL}/api/user/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req),
    });

    if (!res.ok) {
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(err);
    }
    return null;
  }
};
const logout = async () => {
  try {
    const res = await fetch(`${API_URL}/api/user/logout`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(`http status: ${res.status} ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (err instanceof TypeError) {
      console.error(err);
    }
    return null;
  }
};

export { getRefreshToken, login, signup, logout };
