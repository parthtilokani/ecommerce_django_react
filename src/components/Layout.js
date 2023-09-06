import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../sections/Navbar.js";
// import Footer from "../sections/Footer.js";

const Layout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Suspense
          fallback={
            <div className='full-body-spinner'>
              <div className='spinner'></div>
            </div>
          }>
          <Outlet />
        </Suspense>
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default Layout;
