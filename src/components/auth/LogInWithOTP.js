import React, { useState } from "react";
// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";
import { axiosOpen } from "../../utils/axios.js";

export const LogInWithOTP = ({ setSignUpMethod }) => {
  const [otpMessage, setOtpMessage] = useState("");
  const [otpCount, setOtpCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [clock, setClock] = useState(10 * 60);
  const { setAuth } = useAuth();
  const [data, setData] = useState({
    phonenumber: "",
    phone_no: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGetOTP = () => {
    setData((prev) => ({ ...prev, phone_no: prev.phonenumber }));
    let obj = {
      phonenumber: isValid("Phone Number", data.phonenumber, "phonenumber"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setOtpMessage("");
    setLoading(true);
    axiosOpen
      .get("/user/otp", { params: { phone: data.phonenumber } })
      .then((res) => {
        setOtpMessage("OTP sent. You will receive SMS or Call.");
        setOtpSent(true);
        setOtpCount(1);
        setClock(10 * 60);
        const newInterval = setInterval(() => {
          setClock((prev) => {
            if (prev === 0) {
              setErrors({});
              setOtpSent(false);
              clearInterval(newInterval);
              return prev;
            }
            return prev - 1;
          });
        }, 1000);
      })
      .catch((err) => {
        setOtpMessage("");
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        console.log(err.response);
        if (typeof err.response?.data?.error === "string")
          setErrors({
            phonenumber: err?.response?.data?.error,
          });
        else
          setErrors({
            message: "Something went wrong!",
          });
      })
      .finally(() => setLoading(false));
  };

  const handleLogin = () => {
    if (!data.otp?.trim()) return setErrors({ otp: "Please enter OTP." });
    setErrors({});
    setLoading(true);
    axiosOpen
      .post("/user/token/withotp", { ...data, phone_no: data.phone_no })
      .then((res) => {
        setAuth({
          accessToken: res?.data?.access,
          refreshToken: res?.data?.refresh,
        });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            accessToken: res?.data?.access,
            refreshToken: res?.data?.refresh,
          })
        );
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { phone_no, detail, Details } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          phone_no: phone_no && phone_no?.length > 0 ? phone_no[0] : "",
          message: Details || detail || "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Log in to Classified Ads</h3>
      </div>
      <div
        style={{ minHeight: 15, fontSize: 14 }}
        className='text-success text-center'>
        {otpMessage}
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
            {otpCount === 0 || data.phone_no !== data.phonenumber
              ? "Get OTP"
              : "Resend"}
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
          className={`form-control form-control-sm ${
            errors?.otp ? " is-invalid" : ""
          }`}
          id='otp'
          autoComplete='off'
          style={{ padding: "14px 16px", fontSize: "17px" }}
          value={data.otp}
          onChange={handleChange}
          disabled={!otpSent}
        />
      </div>
      <div style={{ minHeight: 20 }}>
        {errors?.otp && (
          <div style={{ fontSize: "10px", color: "red" }}>{errors?.otp}</div>
        )}
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
      <div className='mt-3 text-center'>
        <span className='already-user' onClick={() => setSignUpMethod(2)}>
          Log In with password
        </span>
      </div>
      <div className='mt-1 text-center'>
        <span className='already-user' onClick={() => setSignUpMethod(1)}>
          Create a new Account
        </span>
      </div>
    </div>
  );
};

export default LogInWithOTP;
