import { ReactElement } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Props {
  children?: ReactElement;
  isAuthenticated: boolean;
  adminOlny?: boolean;
  admin?: boolean;
  redirect?: string;
}

const ProtectedRoute = ({
  isAuthenticated,
  children,
  adminOlny,
  admin,
  redirect = "/",
}: Props) => {
  if (!isAuthenticated) return <Navigate to={redirect}/>;
  if(adminOlny && !admin) return <Navigate to={redirect}/>;
  return children?children:<Outlet />;
};

export default ProtectedRoute;
