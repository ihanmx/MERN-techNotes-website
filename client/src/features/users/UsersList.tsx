import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";
import { Alert, Badge, DataTable, PageHeader, Spinner } from "../../ui";

const isFetchBaseQueryError = (err: unknown): err is FetchBaseQueryError =>
  typeof err === "object" && err !== null && "status" in err;

const getErrorMessage = (err: unknown): string => {
  if (
    isFetchBaseQueryError(err) &&
    typeof err.data === "object" &&
    err.data !== null &&
    "message" in err.data
  ) {
    return String((err.data as { message: unknown }).message);
  }
  return "Failed to load users";
};

const UsersList = () => {
  const {
    data: users,
    isLoading,
    isError,
    isSuccess,
    error,
  } = useGetUsersQuery(undefined, {
    pollingInterval: 60000,
    refetchOnFocus: true,
    refetchOnMountOrArgChange: true,
  });

  if (isLoading)
    return (
      <div className="py-10 flex justify-center">
        <Spinner size={32} label="Loading users..." />
      </div>
    );
  if (isError) return <Alert tone="danger">{getErrorMessage(error)}</Alert>;
  if (!isSuccess) return null;

  const { ids } = users;
  const tableContent = ids.length
    ? ids.map((userId) => <User key={userId} userId={String(userId)} />)
    : (
      <tr>
        <td colSpan={3} className="px-4 py-10 text-center text-ink-400 italic">
          No users yet.
        </td>
      </tr>
    );

  return (
    <section>
      <PageHeader
        title="Users"
        subtitle="Manage staff accounts and roles"
        actions={
          <Badge tone="secondary" dot>
            {ids.length} total
          </Badge>
        }
      />

      <DataTable
        head={
          <tr>
            <th scope="col" className="px-4 py-3">Username</th>
            <th scope="col" className="px-4 py-3">Roles</th>
            <th scope="col" className="px-4 py-3 text-right">Edit</th>
          </tr>
        }
      >
        {tableContent}
      </DataTable>
    </section>
  );
};

export default UsersList;