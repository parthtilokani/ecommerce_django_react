import React, { useState } from "react";
// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";

import FormInput from "../input/FormInput.js";

export const SignIn = ({ setIsSignUp }) => {
  const { setAuth } = useAuth();
  const [data, setData] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = () => {
    let obj = {
      username: isValid("Username", data.username, "username"),
      password: isValid("Password", data.password, "password"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setAuth({ token: "yes" });
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Welcome Back</h3>
      </div>
      <div className='mt-3'>
        <FormInput
          labelName={"Username"}
          type='text'
          id='username'
          value={data.username}
          onChange={handleChange}
          errors={errors}
        />
      </div>
      <div className='mt-1'>
        <FormInput
          labelName={"Password"}
          type='password'
          id='password'
          value={data.password}
          onChange={handleChange}
          errors={errors}
        />
      </div>
      <div className='mt-1'>
        <label className='form-label m-0' htmlFor='otp'>
          OTP :
        </label>
        <input
          type='text'
          className='form-control form-control-sm'
          id='otp'
          autoComplete='false'
          disabled
        />
      </div>
      <div className='form-check mt-2'>
        <input className='form-check-input' type='checkbox' id='rememberme' />
        <label className='form-check-label' htmlFor='rememberme'>
          Remember me
        </label>
      </div>
      <div className='mt-3 text-center'>
        <button className='btn btn-primary signup-btn' onClick={handleLogin}>
          Sign In
        </button>
      </div>
      <div className='mt-1 already-user' onClick={() => setIsSignUp(true)}>
        Create a new Account!
      </div>
      <div className='mt-1 already-user'>Forgot Password?</div>
    </div>
  );
};

export default SignIn;
