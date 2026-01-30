import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../../features/auth/contexts/AuthContext";
import { useEffect, useState } from "react";

function ProtectedRoute({ requiredRole }) {
  const { isLoggedIn, user, accessToken } = useAuth();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  // 这里的逻辑稍微有点复杂因为 fetchUser 是异步的
  // 如果有 token (isLoggedIn=true) 但 user 为空，说明正在加载用户信息
  // 我们给一个小小的延时或者状态判断，避免页面闪烁

  useEffect(() => {
    // 如果没有 token，直接结束检查
    if (!accessToken) {
      setIsChecking(false);
      return;
    }

    // 如果有 token 且 user 已经加载，结束检查
    if (user) {
      setIsChecking(false);
      return;
    }

    // 这里其实依赖 AuthContext 里的 useEffect 自动 fetchUser
    // 我们只是被动等待 user 变为非空
    // 但为了防止死等（比如 fetch 失败），可以设个超时或者依赖 AuthContext 暴露 loading 状态
    // 简化起见，如果 user 还是 null，我们暂时认为还在 loading
    // 实际项目中 AuthContext 最好暴露一个 `isLoadingUser` 状态
  }, [accessToken, user]);
  
  // 临时修复：为了配合现有的 AuthContext，
  // 我们简单判断：如果 isLoggedIn 为 false，那就肯定是没登录。
  // 如果 isLoggedIn 为 true，但 user 是 null，我们显示 loading。
  
  if (!isLoggedIn) {
     return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // 有 token 但 user 还没回来，显示 Loading...
  if (isLoggedIn && !user) {
      return <div style={{ padding: "50px", textAlign: "center" }}>Loading user data...</div>;
  }

  // 检查角色权限
  if (requiredRole && user.role !== requiredRole) {
    // 如果是普通用户想访问 admin 页面，踢回首页
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
