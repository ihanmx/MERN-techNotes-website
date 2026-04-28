import { useParams } from "react-router-dom";
import { PulseLoader } from "react-spinners";
import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";

const EditUser = () => {
  const { id } = useParams<{ id: string }>();

  const { user } = useGetUsersQuery(undefined, {
    selectFromResult: ({ data }) => ({
      user: id ? data?.entities[id] : undefined,
    }),
  });

  if (!user) return <PulseLoader color="#FFF" />;

  return <EditUserForm user={user} />;
};

export default EditUser;
