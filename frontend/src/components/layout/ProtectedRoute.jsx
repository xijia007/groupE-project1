import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import { useEffect, useState } from "react";

// protect admin-only pages
function ProtectedRoute({ requiredRole, router_to }) {
  const { isLoggedIn, user, accessToken } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);


  useEffect(() => {
    // If there is no token, the check ends immediately.
    if (!accessToken) {
      setIsChecking(false);
      return;
    }

    // If a token exists and the user has already been loaded, end the check.
    if (user) {
      setIsChecking(false);
      return;
    }
  }, [accessToken, user]);

  if (!isLoggedIn) {
    return <Navigate to={router_to} state={{ from: location }} replace />;
  }

  // The token exists, but the user hasn't returned yet; displaying Loading...
  if (isLoggedIn && !user) {
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        Loading user data...
      </div>
    );
  }

  // Check user role
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={router_to} replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
