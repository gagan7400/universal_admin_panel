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
        <>
            <div class="container">
                <div class="title">
                    <p>Login</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div class="user_details_login">
                        <div class="input_box">
                            <label for="email">Email</label>
                            <input name="email" value={formData.email}
                                onChange={handleChange} type="email" id="email" placeholder="Enter your email" required />
                        </div>
                        <div class="input_box">
                            <label for="password">Password</label>
                            <input name="password" value={formData.password}
                                onChange={handleChange} type="password" id="password" placeholder="Enter your password" required />
                        </div>
                    </div>
                    <div class="reg_btn">
                        <input type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }} value={loading ? "Logging in..." : "Login"} />
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
