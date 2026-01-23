import { useLocation, useNavigate } from "react-router-dom";
import SignIn from "../assets/components/SignModal/SignIn.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function SignInPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || "/";

  const goBackAfterAuth = () => {
    navigate(fromPath, { replace: true });
  };

  return (
    <SignIn
      onClose={goBackAfterAuth}
      onSignUp={() =>
        navigate("/signup", { state: { from: location.state?.from } })
      }
      onAuthSuccess={(accessToken) => {
        if (accessToken) auth.login(accessToken);
        else auth.refreshFromStorage();
      }}
    />
  );
}

export default SignInPage;
