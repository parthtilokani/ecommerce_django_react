import React, { useEffect, useState } from "react";

// css
import "../styles/css/signup.css";

// hooks
import useAuth from "../hooks/useAuth.js";

// components
import SignUp from "../components/auth/SignUp.js";
import SignIn from "../components/auth/SignIn.js";
import SignInWithOTP from "../components/auth/SignInWithOTP.js";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const { auth } = useAuth();
  const [signUpMethod, setSignUpMethod] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/");
    }
  }, [auth, navigate]);

  return (
    <div id='signup-bg'>
      <div className='signup-overlay'>
        <div className='signup-main d-flex justify-content-center align-items-center'>
          {signUpMethod === 1 ? (
            <SignUp {...{ setSignUpMethod, message, setMessage }} />
          ) : signUpMethod === 2 ? (
            <SignIn {...{ setSignUpMethod, message, setMessage }} />
          ) : (
            <SignInWithOTP {...{ setSignUpMethod, message, setMessage }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
