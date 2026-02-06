import { useSelector } from "react-redux";
import { ROLE_PERMISSIONS } from "../rbac/userPermissions";

function Can({requiredPermission, children}) {
    const user = useSelectio((state) => state.userDetails);
    const userPermissions = ROLE_PERMISSIONS[user?.role] || {};
    return userPermissions[requirePermission] ? children : null;
}

export defualt Can;