import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Public from "./components/Public";
import DashLayout from "./components/DashLayout";
import Login from "./components/features/auth/Login";
import Welcome from "./components/features/auth/Welcome";
import NotesList from "./components/features/notes/NotesList";
import UsersList from "./components/features/users/UsersList";
import EditNote from "./components/features/notes/EditNote";
import EditUser from "./components/features/users/EditUser";
import NewUserForm from "./components/features/users/NewUserForm";
import NewNote from "./components/features/notes/NewNote";
import Prefetch from "./components/features/auth/Prefetch";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}></Route>
      {/* public */}
      <Route index element={<Public />}></Route>
      <Route index element={<Login />}></Route>

      {/* protected*/}
      <Route element={<Prefetch />}>
        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />}></Route>
          <Route path="notes">
            <Route index element={<NotesList />}></Route>
            <Route path=":id" element={<EditNote />}></Route>
            <Route path="new" element={<NewNote />}></Route>
          </Route>
          <Route path="users">
            <Route index element={<UsersList />}></Route>
            <Route path=":id" element={<EditUser />}></Route>
            <Route path="new" element={<NewUserForm />}></Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
