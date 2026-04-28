import { useAppSelector } from "../app/hooks";
import { selectCurrentToken } from "../features/auth/authSlice";
import { jwtDecode } from "jwt-decode";

interface AccessTokenPayload {
  UserInfo: {
    username: string;
    roles: string[];
  };
  iat?: number;
  exp?: number;
}

interface AuthInfo {
  username: string;
  roles: string[];
  isManager: boolean;
  isAdmin: boolean;
  status: "Employee" | "Manager" | "Admin";
}

const useAuth = (): AuthInfo => {
  const token = useAppSelector(selectCurrentToken);

  if (!token) {
    return {
      username: "",
      roles: [],
      isManager: false,
      isAdmin: false,
      status: "Employee",
    };
  }

  const { UserInfo } = jwtDecode<AccessTokenPayload>(token);
  const { username, roles } = UserInfo;

  const isManager = roles.includes("Manager");
  const isAdmin = roles.includes("Admin");
  const status: AuthInfo["status"] = isAdmin
    ? "Admin"
    : isManager
      ? "Manager"
      : "Employee";

  return { username, roles, isManager, isAdmin, status };
};

export default useAuth;
