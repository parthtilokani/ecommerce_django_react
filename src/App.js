import React, { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "./styles/css/fonts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// main
import Layout from "./components/Layout.js";
import RequireAuth from "./components/auth/RequiredAuth.js";
import { AuthProvider } from "./contexts/AuthProvider.js";

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

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Layout />}>
              <Route path='login' element={<Authentication />} />
              <Route path='/' element={<Home />} />
              <Route path='home' element={<Home />} />
              <Route path='search' element={<Search />} />
              <Route path='contact' element={<Contact />} />
              <Route path='ads/view/:id' element={<ViewAd />} />
              <Route path='ads/edit/:id' element={<EditAd />} />
              <Route element={<RequireAuth />}>
                <Route path='post-new-ad' element={<PostNewAd />} />
                <Route path='Profile' element={<Profile />} />
              </Route>
              <Route path='*' element={<Navigate to='/' />} />
            </Route>
          </Routes>
          <ToastContainer
            position='bottom-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='colored'
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
