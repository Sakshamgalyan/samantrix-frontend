import ApiClient from "@/lib/apiClient";
import { toast } from "sonner";
import {
  LoginPayload,
  LoginResponse,
  ProfileResponse,
  RegisterPayload,
  RegisterResponse,
} from "@/utils/Apis/type";

export const loginApi = async (data: LoginPayload) => {
  try {
    const response: LoginResponse = await ApiClient.post("/auth/login", data);
    toast.success("Login Successful", {
      description: "Welcome back! 👋",
      duration: 3000,
    });
    return response;
  } catch (error: any) {
    toast.error("Login Failed", {
      description:
        error?.response?.data?.message ||
        "Invalid credentials. Please try again.",
      duration: 4000,
    });
    throw error;
  }
};

export const registerApi = async (data: RegisterPayload) => {
  try {
    const response: RegisterResponse = await ApiClient.post(
      "/auth/register",
      data,
    );
    toast.success("Registration Successful", {
      description: "Your account has been created! 🎉",
      duration: 3000,
    });
    return response;
  } catch (error: any) {
    toast.error("Registration Failed", {
      description:
        error?.response?.data?.message ||
        "Unable to create account. Please try again.",
      duration: 4000,
    });
    throw error;
  }
};

export const logoutApi = async () => {
  try {
    const response = await ApiClient.post("/auth/logout");
    toast.info("Logged Out", {
      description: "You have been successfully logged out.",
      duration: 3000,
    });
    return response;
  } catch (error: any) {
    toast.error("Logout Failed", {
      description:
        error?.response?.data?.message || "An error occurred during logout.",
      duration: 4000,
    });
    throw error;
  }
};

export const profileApi = async () => {
  const response: ProfileResponse = await ApiClient.get("/auth/profile");
  return response.user;
};