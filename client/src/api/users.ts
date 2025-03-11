const API_URL = import.meta.env.VITE_BACKEND_BASEURL;

const getUsername = async (search: string) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const res = await fetch(`${API_URL}/api/user/${search}`);

    if (!res.ok) {
      throw new Error(`http statis: ${res.status} ${res.statusText} `);
    }

    const { user } = await res.json();
    return user;
  } catch (err) {
    if (err instanceof TypeError) {
      console.log("Error fetching username:", err.message);
      return null;
    }
  }
};
const getUserById = async (id: string) => {
  try {
    const res = await fetch(`${API_URL}/api/user/user/${id}`, {
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

export { getUsername, getUserById };
