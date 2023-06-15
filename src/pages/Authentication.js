import React, { useEffect, useState } from "react";

// css
import "../styles/css/signup.css";

// hooks
import useAuth from "../hooks/useAuth.js";

// components
import SignUp from "../components/auth/SignUp.js";
import SignIn from "../components/auth/SignIn.js";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const { auth } = useAuth();
  const [isSignUp, setIsSignUp] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.token) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div className='container'>
      <div className='signup-main d-flex justify-content-center align-items-center'>
        {isSignUp ? (
          <SignUp {...{ setIsSignUp }} />
        ) : (
          <SignIn {...{ setIsSignUp }} />
        )}
      </div>
    </div>
  );
};

export default Authentication;
