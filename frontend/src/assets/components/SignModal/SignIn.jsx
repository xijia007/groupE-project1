import { useState } from "react";
import "./SignIn.css";

function SignIn({ onClose, onSignUp, onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email has error
  const emailError = emailTouched && !isValidEmail(email);

  // Check if password has error
  const passwordError = passwordTouched && password.trim() === "";

  const handleEmailBlur = () => {
    setEmailTouched(true);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
  };

  const handleSubmit = async (e) => {
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

      if (data?.accessToken) {
        localStorage.setItem("accessToken", data.accessToken);
      }

      if (onAuthSuccess) onAuthSuccess();

      if (onClose) onClose();
    } catch (err) {
      setSubmitError(err.message || "Email or password is incorrect");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-container">
        <button className="signin-close" onClick={onClose}></button>
        <h2 className="signin-title">Sign in to your account</h2>

        <form onSubmit={handleSubmit}>
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
              <span className="error-message">Invalid password input!</span>
            )}
          </div>

          <button type="submit" className="signin-button">
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
          {submitError && (
            <div className="signin-submit-error">{submitError}</div>
          )}
        </form>

        <div className="signin-footer">
          <span>
            Don't have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onSignUp) onSignUp();
              }}
            >
              Sign up
            </a>
          </span>
          <a href="#" onClick={(e) => e.preventDefault()}>
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
