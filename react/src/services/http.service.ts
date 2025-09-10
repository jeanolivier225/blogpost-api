import axios, {AxiosError, type AxiosResponse} from "axios";
import type {Auth} from "../models/FormData/Auth.tsx";
import type {AuthResponse} from "../models/HttpResponse/AuthResponse.ts";
import type {UpdateProfile} from "../models/FormData/UpdateProfile.ts";

// Base URL
const API_BASE_URL = "http://127.0.0.1:8080/api";

// Instance Axios
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/auth"; // à remplacer par useNavigate côté composant
        }
        return Promise.reject(error);
    }
);


export const authService = {
    async login(credentials: Auth) {
        try {
            const response: AxiosResponse = await api.post("/auth", credentials);

            const authResponse: AuthResponse = response?.data?.data;

            if (authResponse?.access_token) {
                localStorage.setItem("access_token", authResponse?.access_token);
                localStorage.setItem("user", JSON.stringify(authResponse));
            }

            setTimeout(() => {
                window.location.replace('/');
            }, 1500);

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            throw err.response?.data || { message: "Unkown error" };
        }
    },

    async register(credentials: Auth) {
        try {
            const response: AxiosResponse = await api.post("/auth/register", credentials);

            const authResponse: AuthResponse = response?.data?.data;

            if (authResponse?.access_token) {
                localStorage.setItem("access_token", authResponse?.access_token);
                localStorage.setItem("user", JSON.stringify(authResponse));
            }

            setTimeout(() => {
                window.location.replace('/');
            }, 1500);

        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            throw err.response?.data || { message: "Unkown error" };
        }
    },

    async logout() {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error("Log:", error);
        } finally {
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            window.location.href = "/auth";
        }
    },

    getCurrentUser() {
        const userStr = localStorage.getItem("user");
        return userStr ? JSON.parse(userStr) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem("access_token");
    },
};

// -------- Protected API --------
export const protectedApi = {
    async getProfile() {
        const response = await api.get("/account");
        return response.data;
    },

    async updateProfile(data: UpdateProfile) {
        const response = await api.post("/account", data);
        return response.data;
    },

    async getPosts(search?: string, author_id?: string, source_id?: string, category_id?: string) {
        const response = await api.get("/articles/all", {
            params: {
                search: search || '',
                author_id: author_id || '',
                source_id: source_id || '',
                category_id: category_id || ''
            }
        });
        return response.data;
    },

    async getPostsFeed() {
        const response = await api.get("/articles/feed");
        return response.data;
    },

    async getPost(slug: string|undefined) {
        const response = await api.get(`/article/${slug}`);
        return response.data;
    },

    async getSources() {
        const response = await api.get("/sources");
        return response.data;
    },

    async getCategories() {
        const response = await api.get("/categories");
        return response.data;
    },

    async getAuthors() {
        const response = await api.get("/authors");
        return response.data;
    },
};

export default api;
