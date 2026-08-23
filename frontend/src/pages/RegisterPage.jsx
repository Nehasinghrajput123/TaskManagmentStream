import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Layers,
  ArrowRight,
  Lock,
  Mail,
  User,
  Shield,
  ShieldAlert,
} from "lucide-react";

import { registerUser, clearAuthError } from "../store/authSlice";
import { useToast } from "../hooks/useToast";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");

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

    if (!name || !email || !password) {
      return;
    }

    const result = await dispatch(
      registerUser({
        name,
        email,
        password,
        role,
      })
    );

    if (registerUser.fulfilled.match(result)) {
      showSuccess("Account created successfully!");
      navigate("/dashboard");
      return;
    }

    showError(result.payload || "Registration failed");
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
          maxWidth: 460,
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
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              marginBottom: "0.75rem",
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
            Create TaskStream Account
          </h2>

          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "0.9rem",
            }}
          >
            Join your team workspace
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.75rem 1rem",
              marginBottom: "1.25rem",
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid var(--danger)",
              borderRadius: "var(--radius-md)",
              color: "#f87171",
              fontSize: "0.85rem",
            }}
          >
            <ShieldAlert size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label className="form-label">Full Name</label>

            <div style={{ position: "relative" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                style={{ paddingLeft: "2.5rem" }}
              />

              <User
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                minLength={6}
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

          {/* Role */}
          <div className="form-group">
            <label className="form-label">Account Role</label>

            <div style={{ position: "relative" }}>
              <select
                className="form-select"
                value={role}
                onChange={(event) => setRole(event.target.value)}
                style={{ paddingLeft: "2.5rem" }}
              >
                <option value="member">Member</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>

              <Shield
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
            {loading ? "Creating Account..." : "Get Started"}
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Login link */}
        <div
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#818cf8",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;