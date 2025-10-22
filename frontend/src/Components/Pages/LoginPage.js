import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import "./LoginPage.css";
import aiLogo from "/Users/cavins/Desktop/project/ai-interview-system/frontend/src/assests/ai-logo.png";
import apiService from "../../utils/apiService";

const LoginPage = () => {
  const navigate = useNavigate();

  // ✅ Track input state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Handle email/password login
  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.login({ email, password });
      
      // Get user info after successful login
      const userInfo = await apiService.getCurrentUser();
      localStorage.setItem("user", JSON.stringify(userInfo));
      
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      alert(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };


  // ✅ Handle Google login
  const handleGoogleLogin = async (credentialResponse) => {
    const token = credentialResponse.credential;

    if (!token) {
      console.error("No credential found in tokenResponse");
      return;
    }

    try {
      const userInfo = jwtDecode(token);
      console.log("Google User Info:", userInfo);

      // Send Google user info to backend
      const response = await apiService.googleLogin(userInfo);
      
      // Get user info from backend after successful login
      const backendUser = await apiService.getCurrentUser();
      
      // Save backend user info in localStorage
      localStorage.setItem("user", JSON.stringify(backendUser));
      localStorage.setItem("authToken", response.access_token);
      
      alert(`✅ Google login successful!\nWelcome ${backendUser.name}`);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error with Google login:", error);
      alert("Google login failed. Please try again.");
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-In failed");
    alert("Google login failed. Please try again.");
  };

  return (
    <div className="auth-container">
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/assets/videoooo.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="auth-card">
        <div className="auth-logo">
          <img src={aiLogo} alt="AI Logo" />
        </div>
        <h2>Welcome to AI Interview System</h2>
        <p className="auth-subtitle">Login or Signup to start</p>

        {/* ✅ Email + Password form */}
        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            className="auth-button login"
            type="button"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "🔄 Logging in..." : "🚀 Login"}
          </button>
        </form>

        <hr style={{ margin: "20px 0", width: "100%" }} />

        {/* ✅ Google login */}
        <div className="google-login-wrapper">
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={handleGoogleError}
            theme="filled_blue"
            size="large"
            shape="pill"
          />
        </div>

        <p className="auth-footer">
          New here? <a href="/signup">Create Account</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
