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

export { getUsername };
