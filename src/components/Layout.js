import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../sections/Navbar.js";
import Footer from "../sections/Footer.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Suspense fallback={<div>Loading...</div>}>
        <Outlet />
      </Suspense>
      <Footer />
    </>
  );
};

export default Layout;
