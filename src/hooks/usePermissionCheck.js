import { useAuthContext } from "../context/auth-context";

const usePermissionCheck = () => {
  const { role, permissions } = useAuthContext();

  const checkSubPermissions = (permissions, identifier) => {
    if (role === "owner") {
      return { status: true };
    }
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (permission.identifier === identifier && permission.isGranted) {
          return { status: true, permission };
        }
      }
    }

    return { status: false };
  };

  const checkPermission = (identifier) => {
    if (role === "owner") {
      return { status: true };
    }
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (permission.identifier === identifier && permission.isGranted) {
          return { status: true, permission };
        }

        if (
          permission.isGranted &&
          permission.sub &&
          permission.sub.length > 0
        ) {
          const subPermission = checkSubPermissions(permission.sub, identifier);
          if (subPermission.status) {
            return subPermission;
          }
        }
      }
    }

    return { status: false };
  };

  const getFirstGrantedPermission = () => {
    for (const permission of permissions) {
      if (permission.isGranted) {
        return { status: true, permission };
      }
    }
    return {
      status: true,
      permission: {
        identifier: "dashboard",
      },
    };
  };

  return { checkPermission, getFirstGrantedPermission };
};

export default usePermissionCheck;
