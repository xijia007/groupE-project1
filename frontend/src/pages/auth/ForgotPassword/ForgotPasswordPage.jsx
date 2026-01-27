import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../../components/auth/Auth.jsx";
import { useAuth } from "../../../features/auth/contexts/AuthContext.jsx";

function ForgotPasswordPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || "/";

  const goBackAfterAuth = () => {
    navigate(fromPath, { replace: true });
  };

  return (
    <Auth
      onClose={goBackAfterAuth}
      Status="ForgotPassword"
      onSignIn={() =>
        navigate("/signin", { state: { from: location.state?.from } })
      }
      onAuthSuccess={(accessToken) => {
        if (accessToken) {
          auth.login(accessToken);
        } else {
          // Password updated, redirect to sign in
          navigate("/signin", {
            state: {
              message: "Password updated successfully. Please sign in.",
            },
          });
        }
      }}
    />
  );
}

export default ForgotPasswordPage;
