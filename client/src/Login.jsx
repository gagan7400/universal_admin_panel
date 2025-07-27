import React, { useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const Login = () => {
    let dispatch = useDispatch();
    let { token, error } = useSelector(state => state.auth)
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


        try {
            const response = await axios.post("https://universal-admin-panel.onrender.com/api/user/login", formData);
            if (response.data.status) {
                 toast.success(response.data.message, {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("refreshToken", response.data.data.refreshToken);
                // Redirect to dashboard or home
                // navigate("/dashboard"); // if you're using react-router-dom
            } else {
                toast.error(response.data.message || "Login failed.", {
                    position: "top-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Bounce,
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong.", {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container">
                <div className="title">
                    <p>Login</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="user_details_login">
                        <div className="input_box">
                            <label htmlFor="email">Email</label>
                            <input name="email" value={formData.email}
                                onChange={handleChange} type="email" id="email" placeholder="Enter your email" required />
                        </div>
                        <div className="input_box">
                            <label htmlFor="password">Password</label>
                            <input name="password" value={formData.password}
                                onChange={handleChange} type="password" id="password" placeholder="Enter your password" required />
                        </div>
                    </div>
                    <div className="reg_btn">
                        <input type="submit" disabled={loading} style={{ width: "100%", padding: "10px" }} value={loading ? "Logging in..." : "Login"} />
                    </div>
                </form>
            </div>
        </>
    );
};

export default Login;
