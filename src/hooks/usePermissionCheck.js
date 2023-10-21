import { useAuthContext } from "../context/auth-context";

const usePermissionCheck = () => {
  const { role, permissions } = useAuthContext();

  const checkSubPermissions = (permissions, identifier) => {
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (role === "owner" && permission.identifier === identifier) {
          return { status: true, permission };
        }
        if (permission.identifier === identifier && permission.isGranted) {
          return { status: true, permission };
        }
      }
    }

    return { status: false };
  };

  const checkPermission = (identifier) => {
    if (permissions && permissions.length > 0) {
      for (const permission of permissions) {
        if (role === "owner" && permission.identifier === identifier) {
          return { status: true, permission };
        }
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

  return { checkPermission };
};

export default usePermissionCheck;
