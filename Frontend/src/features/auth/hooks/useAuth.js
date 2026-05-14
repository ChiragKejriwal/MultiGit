import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.context";
import { login, register, logout, getMe, updateProfile, deleteAccount } from "../service/auth.api";

export function useAuth() {
  const context = useContext(AuthContext);
  const { user, setUser, loading, setLoading, authError, setAuthError } = context;

  const getErrorMessage = (error, fallback) => {
    return error?.response?.data?.message || error?.message || fallback;
  };

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    setAuthError("");
    try {
      const data = await login({ email, password });
      if (!data?.user) {
        throw new Error("Login failed. No user data returned.");
      }
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Invalid credentials. Please try again.",
      );
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError("");
    try {
      const data = await register({ username, email, password });
      if (!data?.user) {
        throw new Error("Registration failed. No user data returned.");
      }
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Registration failed. Please try again.",
      );
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setAuthError("");
    try {
      await logout();
      setUser(null);
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Logout failed. Please try again.",
      );
      setAuthError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setLoading(true);
    setAuthError("");
    try {
      const data = await deleteAccount();
      setUser(null);
      return { success: true, data };
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Account deletion failed. Please try again.",
      );
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async ({ username, email, password }) => {
    setLoading(true);
    setAuthError("");
    try {
      const data = await updateProfile({ username, email, password });
      if (!data?.user) {
        throw new Error("Profile update failed. No user data returned.");
      }
      setUser(data.user);
      return { success: true, data };
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "Profile update failed. Please try again.",
      );
      setAuthError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data?.user ?? null);
      } catch (error) {
        setUser(null);
        if (error?.response?.status !== 401) {
          console.error("Error fetching user:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return {
    user,
    loading,
    authError,
    setAuthError,
    handleLogin,
    handleRegister,
    handleLogout,
    handleDeleteAccount,
    handleUpdateProfile,
  };
}
