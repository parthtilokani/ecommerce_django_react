import React, { useState } from "react";
// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";
import { axiosPrivate } from "../../utils/axios.js";

import FormInput from "../input/FormInput.js";

export const SignIn = ({ setSignUpMethod, message, setMessage }) => {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = () => {
    let obj = {
      email: isValid("Email", data.email, "email"),
      password: isValid("Password", data.password),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .post("/token", { ...data })
      .then((res) => {
        setSignUpMethod(2);
        setAuth({
          accessToken: res?.data?.access,
          refreshToken: res?.data?.refresh,
          email: data?.email,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: res?.data?.access,
            refreshToken: res?.data?.refresh,
            email: data?.email,
          })
        );
      })
      .catch((err) => {
        const { email, password, detail } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          email: email && email?.length > 0 ? email[0] : "",
          password: password && password?.length > 0 ? password[0] : "",
          message: detail || "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Welcome Back</h3>
      </div>
      <svg xmlns='http://www.w3.org/2000/svg' style={{ display: "none" }}>
        <symbol id='check-circle-fill' viewBox='0 0 16 16'>
          <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z' />
        </symbol>
      </svg>
      {message && (
        <div
          className='alert alert-success d-flex align-items-center mt-3'
          role='alert'>
          <svg
            className='bi me-2'
            role='img'
            aria-label='Success:'
            style={{ height: 16, width: 16 }}>
            <use xlinkHref='#check-circle-fill' />
          </svg>
          <div>{message}</div>
        </div>
      )}
      <div className='mt-3'>
        <FormInput
          labelName={"Email"}
          type='text'
          id='email'
          value={data.email}
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
      <div className='mt-1 already-user text-end'>Forgot Password?</div>
      {errors?.message && (
        <div style={{ fontSize: "10px", color: "red" }}>{errors?.message}</div>
      )}
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn'
          onClick={handleLogin}
          disabled={loading}>
          Sign In
        </button>
      </div>
      <div className='mt-1 already-user' onClick={() => setSignUpMethod(3)}>
        Sign In with OTP!
      </div>
      <div className='mt-1 already-user' onClick={() => setSignUpMethod(1)}>
        Create a new Account!
      </div>
    </div>
  );
};

export default SignIn;
