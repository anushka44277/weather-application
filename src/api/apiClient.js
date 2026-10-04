const BASE_URL = "https://dummyjson.com";

const apiClient = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  let response;
  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
  } catch (networkError) {
    throw new Error("Network error: Please check your internet connection.");
  }

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    throw new Error("Session expired. Please login again.");
  }

  if (response.status === 404) throw new Error("Resource not found.");
  if (response.status === 500) throw new Error("Server error. Please try again later.");

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed: ${response.status}`);
  }

  return response.json();
};

export default apiClient;
