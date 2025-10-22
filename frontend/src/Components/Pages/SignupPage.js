import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignupPage.css";
import aiLogo from "/Users/cavins/Desktop/project/ai-interview-system/frontend/src/assests/ai-logo.png";
import apiService from "../../utils/apiService";

const SignupPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    try {
      await apiService.signup({ name, email, password });
      alert("Account created successfully! Please login.");
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <video autoPlay loop muted playsInline className="bg-video">
        <source src="/assets/signup.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="auth-card">
        <div className="auth-logo">
          <img src={aiLogo} alt="AI Logo" />
        </div>
        <h2>Create Your Account</h2>
        <p className="auth-subtitle">Join the AI Interview Coach community</p>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <button
            className="auth-button signup"
            type="button"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "🔄 Creating Account..." : "✨ Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <a href="/">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;