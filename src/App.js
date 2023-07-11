import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

// main
import Layout from "./components/Layout.js";
import RequireAuth from "./components/auth/RequiredAuth.js";

// pages - preloaded
import Authentication from "./pages/Authentication.js";
import Home from "./pages/Home.js";
//pages - lazyloaded
const Search = lazy(() => import("./pages/Search.js"));
const PostNewAdd = lazy(() => import("./pages/PostNewAdd.js"));
const Profile = lazy(() => import("./pages/Profile.js"));
const Contact = lazy(() => import("./pages/Contact.js"));

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route path='/login' element={<Authentication />} />
        <Route path='/' element={<Home />} />
        <Route path='/home' element={<Home />} />
        <Route path='/search' element={<Search />} />
        <Route element={<RequireAuth />}>
          <Route path='/post-new-ad' element={<PostNewAdd />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/contact' element={<Contact />} />
        </Route>
        <Route path='*' element={<Home />} />
      </Route>
    </Routes>
  );
};

export default App;
