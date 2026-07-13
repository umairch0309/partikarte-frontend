import React from "react";
import { Navigate } from "react-router-dom";
import usePermissionCheck from "../../../hooks/usePermissionCheck";

const PermissionRoute = ({ permission, children }) => {
  const { checkPermission } = usePermissionCheck();

  if (!checkPermission(permission).status) {
    return <Navigate to="/business/dashboard" replace />;
  }

  return children;
};

export default PermissionRoute;
