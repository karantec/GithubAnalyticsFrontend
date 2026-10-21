import axios from "axios";

const USER_KEY = "gh-explorer-user-id";

// Anonymous per-browser id, sent to the backend as x-user-id
export const getUserId = () => {
  try {
    let id = localStorage.getItem(USER_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(USER_KEY, id);
    }
    return id;
  } catch {
    return "default";
  }
};

// Works whether VITE_API_URL is empty (dev proxy), the bare backend host,
// or the host with /api already on the end.
const raw = import.meta.env.VITE_API_URL || "";
const baseURL = raw
  ? raw.replace(/\/+$/, "").replace(/\/api$/, "") + "/api"
  : "/api";

const api = axios.create({
  baseURL,
  timeout: 30000, // Render free tier can take ~30s to wake up
});

api.interceptors.request.use((cfg) => {
  cfg.headers["x-user-id"] = getUserId();
  return cfg;
});

// Turn any axios error into a message safe to show the user
export const getErrorMessage = (err) => {
  if (err.response) {
    const { status, data } = err.response;
    let msg = data?.message || "Something went wrong";
    if (status === 429 && data?.retryAfter) {
      msg += ` (retry in about ${data.retryAfter}s)`;
    }
    return msg;
  }
  if (err.code === "ECONNABORTED")
    return "Request timed out. Please try again.";
  return "Cannot reach the server. Is the backend running?";
};

export const searchRepos = (params, signal) =>
  api.get("/repos/search", { params, signal }).then((r) => r.data);

export const getRepoDetails = (owner, repo, signal) =>
  api.get(`/repos/${owner}/${repo}`, { signal }).then((r) => r.data);

export const getFavorites = () => api.get("/favorites").then((r) => r.data);
export const addFavorite = (payload) =>
  api.post("/favorites", payload).then((r) => r.data);
export const removeFavorite = (repoId) =>
  api.delete(`/favorites/${repoId}`).then((r) => r.data);
