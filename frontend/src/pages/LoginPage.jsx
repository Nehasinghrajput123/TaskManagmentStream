import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  ShieldAlert,
} from "lucide-react";

import { loginUser, clearAuthError } from "../store/authSlice";
import { useToast } from "../hooks/useToast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { showError, showSuccess } = useToast();

  const { isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearAuthError());

    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [dispatch, isAuthenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      return;
    }

    const response = await dispatch(
      loginUser({
        email,
        password,
      })
    );

    if (loginUser.fulfilled.match(response)) {
      showSuccess("Welcome back!");
      navigate("/dashboard");
      return;
    }

    showError(response.payload || "Login failed");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem",
        background:
          "radial-gradient(circle at top right, #1e1b4b 0%, #0f172a 60%)",
      }}
    >
      <div
        className="card"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "2.5rem",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "0.75rem",
              color: "#fff",
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
            }}
          >
            <Layers size={26} />
          </div>

          <h2
            style={{
              fontSize: "1.5rem",
              marginBottom: "0.25rem",
            }}
          >
            Sign in to TaskStream
          </h2>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Enterprise Project & Task Management
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              borderRadius: "var(--radius-md)",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--danger)",
              color: "#f87171",
              fontSize: "0.85rem",
            }}
          >
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email Address</label>

            <div style={{ position: "relative" }}>
              <input
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                style={{ paddingLeft: "2.5rem" }}
              />

              <Mail
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 11,
                  color: "var(--text-muted)",
                }}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>

            <div style={{ position: "relative" }}>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                style={{ paddingLeft: "2.5rem" }}
              />

              <Lock
                size={18}
                style={{
                  position: "absolute",
                  left: 12,
                  top: 11,
                  color: "var(--text-muted)",
                }}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.75rem",
              marginTop: "0.5rem",
            }}
          >
            {loading ? "Authenticating..." : "Sign In"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Register link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#818cf8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;