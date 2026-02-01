import { useState } from "react";
import "./Auth.css";

export function ForgotPassword() {
  return (
    <div className="relative bg-white rounded-lg p-[clamp(28px,5vw,56px)] flex flex-col items-center justify-center text-center gap-5">
      <img
        src="../../../Mail.png"
        alt="Mail Icon"
        className="w-[88px] h-[88px] object-contain block"
      />
      <h2 className="forgot-password__title">
        We have send the update password link to your email, please check that !
      </h2>
    </div>
  );
}

function Auth({
  Status,
  onClose,
  onSignUp,
  onAuthSuccess,
  onForgotPassword,
  onSignIn,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [roleTouched, setRoleTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [role, setRole] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Password validation function (min 6 chars)
  const isValidPassword = (pwd) => {
    return pwd && pwd.length >= 6;
  };

  // Role validation function
  const isValidRole = (r) => r === "regular" || r === "admin";

  // Check if email has error
  const emailError = emailTouched && !isValidEmail(email);

  // Check if password has error
  const passwordError = passwordTouched && !isValidPassword(password);

  // Check if role has error (only for SignUp)
  const roleError = Status === "SignUp" && roleTouched && !isValidRole(role);

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleRoleBlur = () => {
    setRoleTouched(true);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);
    setRoleTouched(true);

    // Validate before submit
    if (
      !isValidEmail(email) ||
      !isValidPassword(password) ||
      !isValidRole(role)
    ) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const derivedNameRaw = email.split("@")[0] || "user";
      const name = derivedNameRaw.length >= 2 ? derivedNameRaw : "user";
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.message || "Sign up failed",
        );
      }

      if (onAuthSuccess) onAuthSuccess(data?.accessToken);

      if (onClose) onClose();
    } catch (err) {
      setSubmitError(err.message || "Sign up failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validate before submit
    if (!isValidEmail(email) || password.trim() === "") {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Email or password is incorrect");
      }

      if (onAuthSuccess) onAuthSuccess(data?.accessToken);

      if (onClose) onClose();
    } catch (err) {
      setSubmitError(err.message || "Email or password is incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    // Mark all fields as touched
    setEmailTouched(true);
    setPasswordTouched(true);

    // Validate before submit
    if (!isValidEmail(email) || password.trim() === "") {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const derivedNameRaw = email.split("@")[0] || "user";
      const name = derivedNameRaw.length >= 2 ? derivedNameRaw : "user";
      const response = await fetch("/api/auth/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error?.message || data?.message || "Update password failed",
        );
      }

      if (onAuthSuccess) {
        onAuthSuccess(data?.accessToken);
      } else if (onClose) {
        onClose();
      }
    } catch (err) {
      setSubmitError(err.message || "Update password failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <button className="signin-close" onClick={onClose}></button>
        {Status === "SignIn" && (
          <h2 className="signin-title">Sign in to your account</h2>
        )}
        {Status === "SignUp" && (
          <h2 className="signin-title">Sign Up an account</h2>
        )}
        {Status === "SignIn" && (
          <form onSubmit={handleLogin}>
            <div className="signin-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className={emailError ? "input-error" : ""}
              />
              {emailError && (
                <span className="error-message">Invalid Email input!</span>
              )}
            </div>

            <div className="signin-form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={passwordError ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <span className="error-message">
                  {Status === "SignUp"
                    ? "Password must be at least 6 characters!"
                    : "Invalid password input!"}
                </span>
              )}
            </div>

            <button type="submit" className="signin-button">
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
            {submitError && (
              <div className="signin-submit-error">{submitError}</div>
            )}
          </form>
        )}
        {Status === "SignUp" && (
          <form onSubmit={handleRegister} noValidate>
            <div className="signin-form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={handleEmailBlur}
                className={emailError ? "input-error" : ""}
              />
              {emailError && (
                <span className="error-message">Invalid Email input!</span>
              )}
            </div>

            <div className="signin-form-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter your password (min 6 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  className={passwordError ? "input-error" : ""}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {passwordError && (
                <span className="error-message">
                  Password must be at least 6 characters!
                </span>
              )}

              <div style={{ marginTop: "15px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "5px",
                    fontSize: "14px",
                    color: "#1a1a1a",
                  }}
                >
                  Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  onFocus={() => setRoleTouched(true)}
                  onBlur={handleRoleBlur}
                  className={roleError ? "input-error" : ""}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "6px",
                    border: roleError ? "1px solid #e74c3c" : "1px solid #ccc",
                  }}
                >
                  <option value="" disabled hidden>
                    Please select a role
                  </option>
                  <option value="regular">Regular</option>
                  <option value="admin">Admin</option>
                </select>
                {roleError && (
                  <span className="error-message">Please select a role!</span>
                )}
              </div>
            </div>

            <button type="submit" className="signin-button">
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
            {submitError && (
              <div className="signin-submit-error">{submitError}</div>
            )}
          </form>
        )}
        {Status === "ForgotPassword" && <ForgotPassword />}

        <div className="signin-footer">
          <span>
            {Status === "SignIn" && "Don't have an account? "}
            {Status === "SignUp" && "Already have an account? "}

            {Status === "SignIn" && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSignUp) onSignUp();
                }}
              >
                Sign up
              </a>
            )}
            {Status === "SignUp" && (
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSignIn) onSignIn();
                }}
              >
                Sign in
              </a>
            )}
          </span>
          {Status === "SignIn" && (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onForgotPassword) onForgotPassword();
              }}
            >
              Forgot password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default Auth;
