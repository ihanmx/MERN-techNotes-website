import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Login from "./features/auth/Login";
import Welcome from "./components/Welcome";
import NotesList from "./features/notes/NotesList";
import UsersList from "./features/users/UsersList";
import EditNote from "./features/notes/EditNote";
import EditUser from "./features/users/EditUser";
import NewUserForm from "./features/users/NewUserForm";
import NewNote from "./features/notes/NewNote";
import Prefetch from "./components/Prefetch";
import PersistLogin from "./features/auth/PersistLogin";
import RequireAuth from "./features/auth/RequireAuth";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";
function App() {
  useTitle("E-notes");
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        {/* protected */}
        <Route element={<PersistLogin />}>
          {/* all the app roles */}
          <Route element={<RequireAuth allowedRoles={Object.values(ROLES)} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":id" element={<EditNote />} />
                  <Route path="new" element={<NewNote />} />
                </Route>

                {/* Manager/Admin only */}
                <Route
                  element={
                    <RequireAuth allowedRoles={[ROLES.Manager, ROLES.Admin]} />
                  }
                >
                  <Route path="users">
                    <Route index element={<UsersList />} />
                    <Route path=":id" element={<EditUser />} />
                    <Route path="new" element={<NewUserForm />} />
                  </Route>
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
