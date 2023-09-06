import React, { useState } from "react";

import ForgotPassword from "./ForgotPassword.js";

// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";
import { axiosOpen } from "../../utils/axios.js";

export const LogIn = ({ setSignUpMethod, message }) => {
  const { setAuth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [forgotPasswordView, setForgotPasswordView] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = () => {
    let obj = {
      email: isValid("Email", data.email),
      password: isValid("Password", data.password),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosOpen
      .post("/user/token", { ...data, email: data.email.toLowerCase() })
      .then((res) => {
        setAuth({
          accessToken: res?.data?.access,
          refreshToken: res?.data?.refresh,
          email: data?.email,
          lastLogin: new Date(),
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: res?.data?.access,
            refreshToken: res?.data?.refresh,
            email: data?.email,
            lastLogin: new Date(),
          })
        );
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { email, password, detail, message } = err?.response?.data;
        if (message) return setErrors({ message });
        if (!email && !password && !detail)
          return setErrors({ message: "Something went wrong! Retry" });
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
        <h3 className='fw-bold signup-head mb-2'>Log in to Classified Ads</h3>
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
        <input
          type='text'
          id='email'
          placeholder='Email address'
          className={`form-control ${errors?.email ? " is-invalid" : ""}`}
          style={{ padding: "14px 16px", fontSize: "17px" }}
          value={data.email}
          autoComplete='off'
          onChange={handleChange}
          maxLength={100}
        />
        <div
          style={{ fontSize: "10px", color: "red", height: 10 }}
          className='mx-1'>
          {errors?.email && errors?.email}
        </div>
      </div>
      <div className='mt-3 position-relative'>
        <input
          type={showPassword ? "text" : "password"}
          id='password'
          placeholder='Password'
          className={`form-control ${errors?.password ? " is-invalid" : ""}`}
          style={{ padding: "14px 50px 14px 16px", fontSize: "17px" }}
          value={data.password}
          onChange={handleChange}
          maxLength={100}
          autoComplete='off'
        />
        <div
          className='icon-div'
          onClick={() => setShowPassword((prev) => !prev)}>
          <img
            src={
              showPassword
                ? "/assets/svgs/eye-close.png"
                : "/assets/svgs/eye-open.png"
            }
            alt='passsword'
          />
        </div>
        <div
          style={{ fontSize: "10px", color: "red", height: 10 }}
          className='mx-1'>
          {errors?.password && errors?.password}
        </div>
      </div>
      <div className='mt-1 text-end'>
        <span
          className='already-user'
          onClick={() => setForgotPasswordView(true)}>
          Forgot Password?
        </span>
      </div>
      {errors?.message && (
        <div style={{ fontSize: "12px", color: "red" }}>{errors?.message}</div>
      )}
      <div className='mt-1 text-center'>
        <button
          className='btn btn-primary signup-btn fw-bold'
          style={{ padding: "12px 16px" }}
          onClick={handleLogin}
          disabled={loading}>
          {loading ? "Logging In" : "Log In"}
        </button>
      </div>
      <div className='mt-3 text-center'>
        <span className='already-user' onClick={() => setSignUpMethod(3)}>
          Log In with OTP
        </span>
      </div>
      <div className='mt-1 text-center'>
        <span className='already-user' onClick={() => setSignUpMethod(1)}>
          Create a new Account
        </span>
      </div>
      {forgotPasswordView && (
        <ForgotPassword setForgotPasswordView={setForgotPasswordView} />
      )}
    </div>
  );
};

export default LogIn;
