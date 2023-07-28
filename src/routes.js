import { lazy } from "react";
import { Navigate, Outlet, Routes, Route } from "react-router-dom";

import useAuth from "./hooks/useAuth.js";

import Layout from "./components/Layout.js";

// pages - preloaded
import Authentication from "./pages/Authentication.js";
import Home from "./pages/Home.js";
// pages - lazyloaded
const Search = lazy(() => import("./pages/Search.js"));
const ViewAd = lazy(() => import("./pages/ViewAd.js"));
const PostNewAd = lazy(() => import("./pages/PostNewAdd.js"));
const EditAd = lazy(() => import("./pages/EditAd.js"));
const Profile = lazy(() => import("./pages/Profile.js"));
const Contact = lazy(() => import("./pages/Contact.js"));

export default function Router() {
  const { auth } = useAuth();

  const PrivateRoute = ({ ...rest }) =>
    auth?.accessToken ? (
      <Outlet />
    ) : (
      <Navigate to='/login' state={{ from: rest.location }} replace />
    );

  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Home />} />
        <Route path='home' element={<Home />} />
        <Route path='login' element={<Authentication />} />
        <Route path='search' element={<Search />} />
        <Route path='contact' element={<Contact />} />
        <Route path='ads/view/:id' element={<ViewAd />} />
        <Route element={<PrivateRoute />}>
          <Route path='post-new-ad' element={<PostNewAd />} />
          <Route path='profile' element={<Profile />} />
          <Route path='ads/edit/:id' element={<EditAd />} />
        </Route>
      </Route>
      <Route path='*' element={<Navigate to='/' replace={true} />} />
    </Routes>
  );
}
