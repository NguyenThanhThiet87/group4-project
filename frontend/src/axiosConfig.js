import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:3000",
});

// add token to every request (kept exactly as you requested)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = token; // preserved format
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// refresh queue
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error);
    else {
      // set the header for queued requests in the same format
      p.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const skipRefresh = ['/auth/login', '/auth/register', '/auth/forgot-password', '/auth/reset-password'].some((path) =>
      originalRequest?.url?.includes(path)
    );
    const refreshToken = localStorage.getItem("refreshToken");

    // handle 401 / 403 once per request
    if ((error.response?.status === 401 || error.response?.status === 403) && !originalRequest._retry &&
      !skipRefresh &&
      refreshToken) {
      if (isRefreshing) {
        // queue request until refresh finishes
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token) => {
              originalRequest.headers.Authorization = token;
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("refresh được gọi");
        const refreshToken = localStorage.getItem("refreshToken");
        const resp = await axios.post("http://localhost:3000/auth/refresh-token", { refreshToken });

        const newAccessToken = resp.data?.accessToken;
        if (!newAccessToken) throw new Error("No accessToken returned from refresh");
        else
          console.log("newAccessToken", newAccessToken)

        // store token in same key you use
        localStorage.setItem("accessToken", newAccessToken);

        // set header on original request using your format
        originalRequest.headers.Authorization = newAccessToken;

        // resolve queued requests
        processQueue(null, newAccessToken);

        return api(originalRequest);
      } catch (err) {
        processQueue(err, null);
        // cleanup and force relogin
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/"; // or navigate to login
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
