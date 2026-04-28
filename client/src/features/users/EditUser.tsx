import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import { Spinner } from "../../ui";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : undefined,
    }),
  });

  if (!user)
    return (
      <div className="py-10 flex justify-center">
        <Spinner size={32} label="Loading user..." />
      </div>
    );

  return <EditUserForm user={user} />;
};

export default EditUser;