import apiClient from "./apiClient";

export const loginUser = (username, password) =>
  apiClient("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password, expiresInMins: 30 }),
    credentials: "include",
  });
