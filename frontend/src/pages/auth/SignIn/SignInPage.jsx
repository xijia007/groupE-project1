import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../../components/auth/Auth.jsx";
import { useAuth } from "../../../features/auth/contexts/AuthContext.jsx";
import { useToast } from "../../../features/toast/contexts/ToastContext";

function SignInPage() {
  const auth = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const goBackAfterAuth = () => {
    navigate("/", { replace: true });
  };

  return (
    <Auth
      Status="SignIn"
      onClose={goBackAfterAuth}
      onSignUp={() =>
        navigate("/signup", { state: { from: location.state?.from } })
      }
      onForgotPassword={() =>
        navigate("/forgot-password", { state: { from: location.state?.from } })
      }
      onAuthSuccess={(accessToken) => {
        if (accessToken) auth.login(accessToken);
        else auth.refreshFromStorage();
        showToast("Logged in successfully. Cart merged.", "success");
      }}
    />
  );
}

export default SignInPage;
