import { useSelector } from "react-redux";

import { Navigate, Outlet } from "react-router-dom";
import type { RootState } from "../store/store";
import { BeatLoader } from "react-spinners";

interface PrivatRouteProps {
  allowedRoles: string[];
}
const PrivateRoute = ({ allowedRoles }: PrivatRouteProps) => {
  const { user, loading } = useSelector((state: RootState) => state.auth);
  if (loading && !user) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <BeatLoader size={15} color="#2563EB" />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
