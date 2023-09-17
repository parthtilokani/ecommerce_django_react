import React, { useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { isValid } from "../../utils/support.js";
import { axiosOpen } from "../../utils/axios.js";
import { useState } from "react";

const ForgotPassword = ({ setForgotPasswordView }) => {
  const [message, setMessage] = useState("");

  const emailRef = useRef();

  const { mutate, isLoading, error } = useMutation({
    mutationFn: async (email) => {
      try {
        const emailInValid = isValid("Email", email, "email");
        if (emailInValid) {
          const obj = { email: emailInValid };
          throw obj;
        }
        await axiosOpen.post("/user/password_reset/", { email });
      } catch (err) {
        setMessage("");
        let obj = {};
        if (err?.email) obj = { email: err.email };
        else if (err?.response?.data?.email?.length > 0)
          obj = { email: err?.response?.data?.email[0] };
        else obj = { message: "Something went wrong! Retry" };
        throw obj;
      }
    },
    onSuccess: () => {
      setMessage("Email sent successfully!");
    },
  });

  return (
    <div
      className='signup-otp-model'
      onClick={() => setForgotPasswordView(false)}>
      <div className='card' onClick={(e) => e.stopPropagation()}>
        <div className='text-center h4 fw-bold mb-0'>Forgot Password</div>
        <div className='text-success'>{message}</div>
        <div className='mt-2'>
          <input
            type='text'
            id='email'
            placeholder='Email address'
            className={`form-control ${error?.email ? " is-invalid" : ""}`}
            style={{ padding: "14px 16px", fontSize: "17px" }}
            ref={emailRef}
            autoComplete='off'
          />
          <div
            style={{ fontSize: "10px", color: "red", minHeight: 10 }}
            className='mx-1'>
            {error?.email && error?.email}
          </div>
        </div>
        {error?.message && (
          <div style={{ fontSize: "10px", color: "red" }}>{error?.message}</div>
        )}
        <div className='mt-1 text-center'>
          <button
            className='btn btn-primary signup-btn fw-bold'
            style={{ padding: "12px 16px" }}
            onClick={() => mutate(emailRef.current?.value)}
            disabled={isLoading}>
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
