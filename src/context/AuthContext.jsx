import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

const STORAGE_KEY = "scoutme_admin_auth";

const AuthContext = createContext(null);

const demoAdmin = {
  id: "admin-1",
  name: "ScoutMe Admin",
  email: "admin@scoutme.io",
  role: "Super Admin",
  avatar: "",
  phone: "+1 (555) 014-8899",
  department: "Operations",
  timezone: "America/Chicago",
  permissions: ["*"],
};

const getStoredSession = () => {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    if (!rawValue) return null;
    return JSON.parse(rawValue);
  } catch (error) {
    console.error("Unable to read auth session from storage.", error);
    return null;
  }
};

const saveStoredSession = (session) => {
  try {
    if (!session) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.error("Unable to persist auth session.", error);
  }
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = getStoredSession();

    if (session?.token && session?.adminUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setToken(session.token);
      setAdminUser(session.adminUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (credentials = {}) => {
    const email = credentials.email?.trim() || demoAdmin.email;
    const password = credentials.password || "";

    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    const session = {
      token: `scoutme-demo-token-${Date.now()}`,
      adminUser: {
        ...demoAdmin,
        email,
        name: credentials.name || demoAdmin.name,
        role: credentials.role || demoAdmin.role,
      },
      issuedAt: new Date().toISOString(),
    };

    saveStoredSession(session);
    setToken(session.token);
    setAdminUser(session.adminUser);
    setIsAuthenticated(true);

    return session.adminUser;
  }, []);

  const logout = useCallback(() => {
    saveStoredSession(null);
    setToken("");
    setAdminUser(null);
    setIsAuthenticated(false);
    navigate("/auth/login", { replace: true });
  }, [navigate]);

  const updateAdminUser = useCallback(
    (nextPayload) => {
      setAdminUser((current) => {
        const nextUser =
          typeof nextPayload === "function"
            ? nextPayload(current)
            : {
                ...current,
                ...nextPayload,
              };

        const session = getStoredSession();
        saveStoredSession({
          ...(session || {}),
          token: session?.token || token,
          adminUser: nextUser,
        });

        return nextUser;
      });
    },
    [token],
  );

  const forgotPassword = useCallback(async ({ email }) => {
    if (!email) {
      throw new Error("Email is required.");
    }

    return {
      success: true,
      message: `Reset instructions sent to ${email}.`,
    };
  }, []);

  const verifyCode = useCallback(async ({ code }) => {
    if (!code || String(code).trim().length < 4) {
      throw new Error("Enter a valid verification code.");
    }

    return {
      success: true,
      message: "Verification code accepted.",
    };
  }, []);

  const resetPassword = useCallback(async ({ password, confirmPassword }) => {
    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    return {
      success: true,
      message: "Password has been updated.",
    };
  }, []);

  const changePassword = useCallback(async ({ currentPassword, password, confirmPassword }) => {
    if (!currentPassword) {
      throw new Error("Current password is required.");
    }

    if (!password || password.length < 6) {
      throw new Error("New password must be at least 6 characters long.");
    }

    if (password === currentPassword) {
      throw new Error("Choose a new password that is different from the current one.");
    }

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match.");
    }

    return {
      success: true,
      message: "Password changed successfully.",
    };
  }, []);

  const hasPermission = useCallback(
    (permission) => {
      if (!adminUser?.permissions?.length) return false;
      if (adminUser.permissions.includes("*")) return true;
      return adminUser.permissions.includes(permission);
    },
    [adminUser],
  );

  const value = useMemo(
    () => ({
      adminUser,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      updateAdminUser,
      forgotPassword,
      verifyCode,
      resetPassword,
      changePassword,
      hasPermission,
    }),
    [
      adminUser,
      token,
      loading,
      isAuthenticated,
      login,
      logout,
      updateAdminUser,
      forgotPassword,
      verifyCode,
      resetPassword,
      changePassword,
      hasPermission,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

export default AuthContext;
