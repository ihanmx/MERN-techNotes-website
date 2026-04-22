import { useParams } from "react-router-dom";
import { useGetUsersQuery } from "./usersApiSlice";
import EditUserForm from "./EditUserForm";
import { PulseLoader } from "react-spinners";

const EditUser = () => {
  const { id } = useParams();
  const { user } = useGetUsersQuery("usersList", {
    //By default, useGetUsersQuery returns the whole query result:
    selectFromResult: ({ data }) => ({
      user: data?.entities[id],
    }),
  });

  // const user = useSelector((state) => selectUserById(state, id));
  if (!user) return <PulseLoader color={"#FFF"} />;
  const content = <EditUserForm user={user} />;

  return content;
};
export default EditUser;
