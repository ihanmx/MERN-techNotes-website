import { Outlet } from "react-router-dom";
import DashHeader from "./DashHeader";
import DashFooter from "./DashFooter";

const DashLayout = () => (
  <>
    <DashHeader />
    <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-6 sm:py-8">
      <Outlet />
    </main>
    <DashFooter />
  </>
);

export default DashLayout;
