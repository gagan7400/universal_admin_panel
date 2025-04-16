import React, { useState } from "react";
import axios from "axios";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        applicationId: "myApp", // You can change this dynamically if needed
        deviceType: "web",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const response = await axios.post("http://localhost:4000/api/user/login", formData);

            if (response.data.status) {
                console.log(response.data)
                setMessage("Login successful!");
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                // Redirect to dashboard or home
                // navigate("/dashboard"); // if you're using react-router-dom
            } else {
                setMessage(response.data.message || "Login failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            setMessage(error.response?.data?.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "50px auto" }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "10px" }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <div style={{ marginBottom: "10px" }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password"
                        required
                        value={formData.password}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px" }}
                    />
                </div>

                <button type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>

            {message && (
                <p style={{ marginTop: "15px", color: message.includes("success") ? "green" : "red" }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Login;
