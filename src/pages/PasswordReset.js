import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

// css
import "../styles/css/signup.css";

// hooks
import useAuth from "../hooks/useAuth.js";
import { isValid } from "../utils/support.js";
import { axiosOpen } from "../utils/axios.js";
import { toast } from "react-toastify";

const PasswordReset = () => {
  const { token } = useParams();
  const { auth } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    confirm_password: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    (() => {
      if (auth?.accessToken) return navigate("/");

      axiosOpen.post(`/user/password_reset/validate_token/`).catch(() => {
        toast.error("Link expired");
        navigate("/");
      });
    })();
  }, [auth]);

  const { isLoading, mutate } = useMutation({
    mutationFn: async (body) => {
      return await axiosOpen.post("/user/password_reset/confirm/", body);
    },
    onSuccess: (res) => {
      toast.success("Password reset successful!");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.detail || "Something went wrong! Retry");
    },
  });

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = () => {
    let obj = {
      password: isValid("New Password", data.password, "password"),
      confirm_password: isValid("Confirm New Password", data.confirm_password),
    };
    if (!obj?.confirm_password)
      obj.confirm_password =
        data.password.trim() !== data.confirm_password.trim()
          ? "Password doen't match"
          : "";
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    mutate({ token, password: data.password.trim() });
  };

  return (
    <div id='signup-bg'>
      <div className='signup-overlay'>
        <div className='signup-main d-flex justify-content-center align-items-center'>
          <div className='signup-body flex-fill'>
            <div className='text-center'>
              <h3 className='fw-bold signup-head mb-2'>Password Reset</h3>
            </div>

            <div className='mt-3'>
              <input
                type='password'
                id='password'
                placeholder='New Password'
                className={`form-control ${
                  errors?.password ? " is-invalid" : ""
                }`}
                style={{ padding: "14px 16px", fontSize: "17px" }}
                value={data.password}
                onChange={handleChange}
                autoComplete='off'
              />
              <div
                style={{ fontSize: "10px", color: "red", minHeight: 10 }}
                className='mx-1'>
                {errors?.password && errors?.password}
              </div>
            </div>

            <div className='mt-2'>
              <input
                type='password'
                id='confirm_password'
                placeholder='Confirm New Password'
                className={`form-control ${
                  errors?.confirm_password ? " is-invalid" : ""
                }`}
                style={{ padding: "14px 16px", fontSize: "17px" }}
                value={data.confirm_password}
                onChange={handleChange}
                autoComplete='off'
              />
              <div
                style={{ fontSize: "10px", color: "red", minHeight: 10 }}
                className='mx-1'>
                {errors?.confirm_password && errors?.confirm_password}
              </div>
            </div>

            {errors?.message && (
              <div style={{ fontSize: "12px", color: "red" }}>
                {errors?.message}
              </div>
            )}
            <div className='mt-2 text-center'>
              <button
                className='btn btn-primary signup-btn fw-bold'
                style={{ padding: "12px 16px" }}
                onClick={handleSubmit}
                disabled={isLoading}>
                {isLoading ? "Loading" : "Submit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
