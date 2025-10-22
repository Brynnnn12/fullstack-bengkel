import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
    withCredentials: true, // Important for cookies
});

// Request interceptor - remove token from localStorage, rely on httpOnly cookies
apiClient.interceptors.request.use(
    (config) => {
        // Token is now handled by httpOnly cookies automatically
        // No need to manually add Authorization header
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Don't redirect if we're already on the login page
            if (!window.location.pathname.includes('/auth/login')) {
                // Clear local auth state and redirect to login
                localStorage.removeItem('auth-storage');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
