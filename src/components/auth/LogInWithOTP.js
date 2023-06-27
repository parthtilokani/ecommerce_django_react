import React, { useState } from "react";
// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";
import { axiosPrivate } from "../../utils/axios.js";

export const LogInWithOTP = ({ setSignUpMethod }) => {
  const [otpCount, setOtpCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [clock, setClock] = useState(120);
  const { setAuth } = useAuth();
  const [data, setData] = useState({
    phonenumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGetOTP = () => {
    let obj = {
      phonenumber: isValid("Phone Number", data.phonenumber, "phonenumber"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setOtpSent(true);
    setOtpCount(1);
    const newInterval = setInterval(() => {
      setClock((prev) => {
        if (prev === 0) return prev;
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => {
      clearInterval(newInterval);
      setOtpSent(false);
      setClock(120);
    }, 12000);
  };

  const handleLogin = () => {
    // setLoading(true);
    // axiosPrivate.get().then((res) => {
    //   setSignUpMethod(2);
    // });
    //   .catch((err) => {
    //     const { name, email, password } = err?.response?.data;
    //     setErrors((prev) => ({
    //       ...prev,
    //       name: name && name?.length > 0 && name[0],
    //       email: email && email?.length > 0 && email[0],
    //       password: password && password?.length > 0 && password[0],
    //     }));
    //   })
    //   .finally(() => setLoading(false));
    // setAuth({ token: "yes" });
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Log in to Classified Ads</h3>
      </div>
      <div className='mt-3'>
        <div className='row pe-2'>
          <div className='col-sm-9 col-8'>
            <input
              type='tel'
              className={`form-control form-control-sm ${
                errors?.phonenumber ? " is-invalid" : ""
              }`}
              placeholder='Phone Number'
              autoComplete='off'
              id='phonenumber'
              value={data.phonenumber}
              onChange={handleChange}
              style={{ padding: "14px 16px", fontSize: "17px" }}
            />
          </div>
          <button
            className='col-sm-3 col-4 fw-bold btn btn-sm btn-primary signup-btn'
            onClick={handleGetOTP}
            disabled={loading || otpSent}>
            {otpCount === 0 ? "Get OTP" : "Resend"}
          </button>
        </div>
        <div style={{ minHeight: 20 }}>
          {errors?.phonenumber && (
            <div style={{ fontSize: "10px", color: "red" }}>
              {errors?.phonenumber}
            </div>
          )}
          {otpSent && (
            <div style={{ fontSize: "12px" }} className='fw-bold'>
              Resend otp in {clock} second/s.
            </div>
          )}
        </div>
      </div>
      <div className='mt-1'>
        <input
          type='text'
          placeholder='Enter OTP here'
          className='form-control form-control-sm'
          id='otp'
          autoComplete='off'
          style={{ padding: "14px 16px", fontSize: "17px" }}
          disabled
        />
      </div>
      {errors?.message && (
        <div style={{ fontSize: "10px", color: "red" }}>{errors?.message}</div>
      )}
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn fw-bold'
          style={{ padding: "12px 16px" }}
          onClick={handleLogin}
          disabled={loading || !otpSent}>
          Log In
        </button>
      </div>
      <div className='mt-3 already-user' onClick={() => setSignUpMethod(2)}>
        Log In with password
      </div>
      <div className='mt-1 already-user' onClick={() => setSignUpMethod(1)}>
        Create a new Account
      </div>
    </div>
  );
};

export default LogInWithOTP;
