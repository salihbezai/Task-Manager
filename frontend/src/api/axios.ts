import axios from "axios"
import { clearAccessToken, getAccessToken, setAccessToken } from "./tokenService";


const api = axios.create( {
    baseURL: 'http://localhost:5000/api',
    withCredentials: true,
})



/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }else if(config.headers?.Authorization){
      delete config.headers.Authorization
    }

    return config;
  },
  (error) => Promise.reject(error)
);



/* =========================
   RESPONSE INTERCEPTOR
========================= */

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token as string);
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🚨 if refresh itself failed → logout
    if (
      error.response?.status === 401 &&
      originalRequest.url === "/auth/refresh"
    ) {
      return Promise.reject(error);
    }

    // normal access-token refresh flow
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/auth/refresh");
        setAccessToken(res.data.token);

        originalRequest.headers.Authorization =
          `Bearer ${res.data.token}`;

        return api(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: (token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const res = await api.post("/auth/refresh");
      const newToken = res.data.token;

      setAccessToken(newToken);
      processQueue(null, newToken);

      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return api(originalRequest);
    } catch (err) {
      processQueue(err, null);
      clearAccessToken();
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);


export default api;