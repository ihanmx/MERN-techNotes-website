import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import { Badge, IconButton } from "../../ui";

interface UserProps {
  userId: string;
}

const roleTone = (role: string) => {
  if (role === "Admin") return "danger" as const;
  if (role === "Manager") return "warning" as const;
  return "secondary" as const;
};

const User = ({ userId }: UserProps) => {
  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: data?.entities[userId],
    }),
  });

  const navigate = useNavigate();

  if (!user) return null;

  const handleEdit = () => navigate(`/dash/users/${userId}`);
  const inactiveClass = user.active ? "" : "opacity-50";

  return (
    <tr className={`hover:bg-white/5 transition-colors ${inactiveClass}`}>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500/15 text-primary-300 text-sm">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <div>
            <div className="font-semibold text-ink-100">{user.username}</div>
            {!user.active && (
              <div className="text-xs text-ink-500">Inactive</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap gap-1.5">
          {user.roles.map((role) => (
            <Badge key={role} tone={roleTone(role)}>
              {role}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-4 py-3 text-right">
        <IconButton tone="primary" label="Edit user" onClick={handleEdit}>
          <FontAwesomeIcon icon={faPenToSquare} />
        </IconButton>
      </td>
    </tr>
  );
};

export default memo(User);