import axios from 'axios';

// Function to refresh the access token (you need to implement this)
const refreshAccessToken = async () => {
  // Make a request to your server to refresh the access token
};

// Axios interceptor to add the access token to every outgoing request
axios.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      // Set the Authorization header with the access token
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Axios interceptor to handle token expiration
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt to refresh the access token
        await refreshAccessToken();
        // Retry the original request with the new access token
        return axios(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login or handle it as needed
        console.error('Failed to refresh access token:', refreshError);
        // Redirect to login page or handle authentication failure
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
