import { useLocation, useNavigate } from "react-router-dom";
import Forgot from "../../../components/auth/SignInModal/Forgot_Pass.jsx";
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
    <Forgot
      onClose={goBackAfterAuth}
      onSignIn={() =>
        navigate("/signin", { state: { from: location.state?.from } })
      }
      onAuthSuccess={(accessToken) => {
        if (accessToken) auth.login(accessToken);
        else auth.refreshFromStorage();
      }}
    />
  );
}

export default ForgotPasswordPage;
