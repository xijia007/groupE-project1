import { useLocation, useNavigate } from "react-router-dom";
import Auth from "../../../components/auth/Auth.jsx";
import { useAuth } from "../../../features/auth/contexts/AuthContext.jsx";
import { ForgotPassword } from "../../../components/auth/ForgotPassword.jsx";

function ForgotPasswordPage() {
  return <ForgotPassword />;
}

export default ForgotPasswordPage;
