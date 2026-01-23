import { useLocation, useNavigate } from "react-router-dom";
import SignUp from "../assets/components/SignModal/SignUp.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function SignUpPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fromPath = location.state?.from?.pathname || "/";

  const goBackAfterAuth = () => {
    navigate(fromPath, { replace: true });
  };

  return (
    <SignUp
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

export default SignUpPage;
