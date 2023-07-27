import React from "react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

import "./styles/css/fonts.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

// main
import ScrollToTop from "./sections/ScrollToTop.js";
import Router from "./routes.js";
import { AuthProvider } from "./contexts/AuthProvider.js";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ScrollToTop />
          <Router />
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
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
