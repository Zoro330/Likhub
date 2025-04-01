import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (!storedUser || storedUser === "undefined") return null;
            const parsedUser = JSON.parse(storedUser);
            if (!parsedUser._id || !parsedUser.email) {
                localStorage.removeItem("user");
                return null;
            }
            return parsedUser;
        } catch (error) {
            localStorage.removeItem("user");
            return null;
        }
    });

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            if (storedUser && storedUser !== "undefined") {
                const parsedUser = JSON.parse(storedUser);
                if (!parsedUser._id || !parsedUser.email) {
                    localStorage.removeItem("user");
                    return;
                }
                setUser(parsedUser);
            }
        } catch (error) {
            localStorage.removeItem("user");
            setUser(null);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (!data.user || !data.user._id || !data.user.email) {
                    console.error("❌ Backend did not return a valid user object:", data);
                    return false;
                }

                setUser(data.user);
                localStorage.setItem("user", JSON.stringify(data.user));
                localStorage.setItem("token", data.token);
                return true;
            } else {
                console.error("❌ Login failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("❌ Error logging in:", error);
            return false;
        }
    };

    const signup = async (userName, email, password) => {
        try {
            const response = await fetch("http://localhost:5000/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (!data.user || !data.user._id || !data.user.email) {
                    console.error("❌ Backend did not return a valid user object:", data);
                    return false;
                }
                return true;
            } else {
                console.error("❌ Signup failed:", data.message);
                return false;
            }
        } catch (error) {
            console.error("❌ Error signing up:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
