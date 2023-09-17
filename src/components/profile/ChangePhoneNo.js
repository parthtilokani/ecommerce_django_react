import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { isValid } from "../../utils/support.js";

const ChangePhoneNo = ({ setChangePhoneNoModel, refetchUser }) => {
  const axiosPrivate = useAxiosPrivate();
  const [otpMessage, setOtpMessage] = useState("");
  const [otpCount, setOtpCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentOnce, setOtpSentOnce] = useState(false);
  const [clock, setClock] = useState(0);
  const [data, setData] = useState({
    phonenumber: "",
    phone_no: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

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
    axiosPrivate
      .get("/user/user/get_otp_to_change_contact", {
        params: { phone: data.phonenumber },
      })
      .then((res) => {
        setOtpMessage("OTP sent. You will receive SMS or Call.");
        setOtpSent(true);
        setOtpSentOnce(true);
        setOtpCount(1);
        setClock(60);
        const newInterval = setInterval(() => {
          setClock((prev) => {
            if (prev === 0) {
              setErrors({});
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
    axiosPrivate
      .post("/user/user/change_user_contact", {
        ...data,
        phone_no: data.phone_no,
      })
      .then((res) => {
        refetchUser();
        toast.success("Phone no. changed successfully.");
        setChangePhoneNoModel(false);
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { phone_no, detail, Details, error } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          phone_no: phone_no && phone_no?.length > 0 ? phone_no[0] : "",
          message: error || Details || detail || "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div id='change-phone-no' onClick={() => setChangePhoneNoModel(false)}>
      <div className='card' onClick={(e) => e.stopPropagation()}>
        <div className='text-center'>
          <h3 className='fw-bold signup-head'>Change Phone Number</h3>
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
              disabled={loading || clock > 0}>
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
            {otpSent && clock > 0 && (
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
            disabled={!otpSentOnce}
          />
        </div>
        <div style={{ minHeight: 20 }}>
          {errors?.otp && (
            <div style={{ fontSize: "10px", color: "red" }}>{errors?.otp}</div>
          )}
        </div>
        {errors?.message && (
          <div style={{ fontSize: "10px", color: "red" }}>
            {errors?.message}
          </div>
        )}
        <div className='mt-3 text-center'>
          <button
            className='btn btn-primary signup-btn fw-bold'
            style={{ padding: "12px 16px" }}
            onClick={handleLogin}
            // disabled={loading || !otpSent}
          >
            Update Phone Number
          </button>
        </div>

        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={() => setChangePhoneNoModel(false)}
        />
      </div>
    </div>
  );
};

export default ChangePhoneNo;
