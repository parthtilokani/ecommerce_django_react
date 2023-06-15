import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../sections/Navbar.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </>
  );
};

export default Layout;
