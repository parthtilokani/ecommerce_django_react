import React, { useState } from "react";

const ForgotPassword = ({ setForgotPasswordView }) => {
  const [errors, setErrors] = useState({});

  return (
    <div className='signup-otp-model'>
      <div className='card'>
        <div className='text-center h4 fw-bold'>Forgot Password</div>
        <div className='mt-3'>
          <input
            type='text'
            id='email'
            placeholder='Email address'
            className={`form-control ${errors?.email ? " is-invalid" : ""}`}
            style={{ padding: "14px 16px", fontSize: "17px" }}
            // value={data.email}
            autoComplete='off'
            // onChange={handleChange}
          />
          <div
            style={{ fontSize: "10px", color: "red", height: 10 }}
            className='mx-1'>
            {errors?.email && errors?.email}
          </div>
        </div>
        {errors?.message && (
          <div style={{ fontSize: "10px", color: "red" }}>
            {errors?.message}
          </div>
        )}
        <div className='mt-1 text-center'>
          <button
            className='btn btn-primary signup-btn fw-bold'
            style={{ padding: "12px 16px" }}
            // onClick={handleLogin}
            // disabled={loading}
          >
            Reset Password
          </button>
        </div>
        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={() => setForgotPasswordView(false)}
        />
      </div>
    </div>
  );
};

export default ForgotPassword;
