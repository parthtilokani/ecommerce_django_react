import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// css
import "../styles/css/signup.css";

// hooks
import useAuth from "../hooks/useAuth.js";

// components
import SignUp from "../components/auth/SignUp.js";
import LogIn from "../components/auth/LogIn.js";
import LogInWithOTP from "../components/auth/LogInWithOTP.js";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const location = useLocation();
  const { auth } = useAuth();
  const [signUpMethod, setSignUpMethod] = useState(2);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth?.accessToken) {
      navigate("/");
    }
    setSignUpMethod(location.state?.page || 2);
  }, [auth, navigate, location]);

  return (
    <div id='signup-bg'>
      <div className='signup-overlay'>
        <div className='signup-main d-flex justify-content-center align-items-center'>
          {signUpMethod === 1 ? (
            <SignUp {...{ setSignUpMethod, message, setMessage }} />
          ) : signUpMethod === 2 ? (
            <LogIn {...{ setSignUpMethod, message, setMessage }} />
          ) : (
            <LogInWithOTP {...{ setSignUpMethod, message, setMessage }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Authentication;
