import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../sections/Navbar.js";
import Footer from "../sections/Footer.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<div>Loading...</div>}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
};

export default Layout;
