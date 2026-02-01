import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../../components/auth/Auth.jsx";
import { useAuth } from "../../../features/auth/contexts/AuthContext.jsx";

function SignUpPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const goBackAfterAuth = () => {
    navigate("/", { replace: true });
  };

  return (
    <Auth
      onClose={goBackAfterAuth}
      onSignIn={() =>
        navigate("/signin", { state: { from: location.state?.from } })
      }
      onAuthSuccess={(accessToken) => {
        if (accessToken) auth.login(accessToken);
        else auth.refreshFromStorage();
      }}
      Status="SignUp"
    />
  );
}

export default SignUpPage;
