import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { useGetUsersQuery } from "./usersApiSlice";
import User from "./User";

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p className="errmsg">{getErrorMessage(error)}</p>;
  if (!isSuccess) return null;

  const { ids } = users;
  const tableContent = ids.length
    ? ids.map((userId) => <User key={userId} userId={String(userId)} />)
    : null;

  return (
    <table className="table table--users">
      <thead className="table__thead">
        <tr>
          <th scope="col" className="table__th user__username">
            Username
          </th>
          <th scope="col" className="table__th user__roles">
            Roles
          </th>
          <th scope="col" className="table__th user__edit">
            Edit
          </th>
        </tr>
      </thead>
      <tbody>{tableContent}</tbody>
    </table>
  );
};

export default UsersList;
