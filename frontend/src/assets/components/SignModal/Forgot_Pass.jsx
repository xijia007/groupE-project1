import { useState } from "react";
import "./SignIn.css";

function Forgot({ onClose, onSignIn, onAuthSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
  const emailTypoError = emailTouched && !isValidEmail(email);

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

      if (onAuthSuccess) onAuthSuccess(data?.accessToken);

      if (onClose) onClose();
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
        <h2 className="signin-title">Update Your Password</h2>

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
              className={emailTypoError ? "input-error" : ""}
            />
            {emailTypoError && (
              <span className="error-message">Invalid Email input!</span>
            )}
          </div>

          <div className="signin-form-group">
            <label htmlFor="password">New Password</label>
            <div className="password-input-wrapper">
              <input
                type="password"
                id="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={handlePasswordBlur}
                className={passwordError ? "input-error" : ""}
              />
            </div>
            {passwordError && (
              <span className="error-message">Invalid password input!</span>
            )}
          </div>

          <button type="submit" className="signin-button">
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
          {submitError && (
            <div className="signin-submit-error">{submitError}</div>
          )}
        </form>

        <div className="signin-footer">
          <span>
            Already have an account?
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (onSignIn) onSignIn();
              }}
            >
              Sign in
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}

export default Forgot;
