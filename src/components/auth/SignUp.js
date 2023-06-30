import React, { useState } from "react";

import FormInput from "../input/FormInput.js";

import { axiosPrivate } from "../../utils/axios.js";
import { isValid } from "../../utils/support.js";

const SignUp = ({ setSignUpMethod, setMessage }) => {
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [OTPView, setOTPView] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clock, setClock] = useState(50);
  const [data, setData] = useState({
    name: "",
    username: "",
    email: "",
    area_code: "",
    phone_no: "",
    password: "",
    c_password: "",
    gender: "",
    dob: undefined,
    otp: "",
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.id === "area_code" && /[^0-9]/.test(e.target.value)) return;
    if (e.target.name === "gender")
      return setData((prev) => ({ ...prev, gender: e.target.value }));
    if (e.target.id === "dob")
      return setData((prev) => ({
        ...prev,
        dob: new Date(`${e.target.value}`).toISOString().slice(0, 10),
      }));
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleGetOTP = () => {
    setOtpMessage("");
    setErrors({});
    setLoading(true);
    axiosPrivate
      .get("/otp", { params: { phone: data.phone_no } })
      .then((res) => {
        console.log(res.data);
        setOtpMessage("OTP sent successfully!");
        setOtpSent(true);
        setData((prev) => ({ ...prev, otp: res.data?.OTP }));
        setClock(50);
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
        setErrors((prev) => ({ ...prev, otp: "Couldn't send OTP." }));
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = () => {
    let obj = {
      name: isValid("Name", data.name),
      username: isValid("Username", data.username, "username"),
      email: isValid("Email", data.email, "email"),
      phone_no: isValid("Phone number", data.phone_no, "phonenumber"),
      password: isValid("Password", data.password, "password"),
      c_password: isValid("Comfirm password", data.c_password),
    };
    if (!obj?.c_password)
      obj.c_password =
        data.password !== data.c_password ? "Password doen't match" : "";
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .post("/register", { ...data, area_code: data.area_code || "91" })
      .then(() => {
        setOTPView(true);
        handleGetOTP();
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { name, username, email, phone_no, password } =
          err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          name: name && name?.length > 0 ? name[0] : "",
          phone_no: phone_no && phone_no?.length > 0 ? phone_no[0] : "",
          username: username && username?.length > 0 ? username[0] : "",
          email: email && email?.length > 0 ? email[0] : "",
          password: password && password?.length > 0 ? password[0] : "",
        }));
      })
      .finally(() => setLoading(false));
  };

  const handleOTPVerify = () => {
    setOtpMessage("");
    let obj = {
      otp: isValid("OTP", data.otp, "otp"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .post("/otp", { phone: data.phone_no, otp: data.otp })
      .then((res) => {
        console.log(res.data);
        setSignUpMethod(2);
        setMessage("Registration successful. Log in to continue");
        setTimeout(() => setMessage(""), 10000);
      })
      .catch((err) => {
        console.error(err);
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        setErrors((prev) => ({ ...prev, otp: "OTP verification failed!" }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='signup-body position-relative flex-fill'>
      <div
        className='signup-otp-model'
        style={OTPView ? {} : { display: "none" }}>
        <div className='card'>
          <div className='h5 p-1 text-center'>Enter OTP :</div>
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
                  className={`form-control ${errors?.otp ? "is-invalid" : ""}`}
                  placeholder='Enter OTP'
                  autoComplete='off'
                  id='otp'
                  value={data.otp}
                  onChange={handleChange}
                  style={{ padding: "14px 16px", fontSize: "17px" }}
                />
              </div>
              <button
                className='col-sm-3 col-4 fw-bold btn btn-sm btn-primary signup-btn'
                disabled={loading}
                onClick={() => {
                  otpSent ? handleOTPVerify() : handleGetOTP();
                }}>
                {loading
                  ? otpSent
                    ? "Verifing"
                    : "Sending"
                  : otpSent
                  ? "Verify"
                  : "Resend"}
              </button>
            </div>
            <div style={{ minHeight: 30 }}>
              {errors?.otp && (
                <div
                  style={{
                    fontSize: "12px",
                    color: "red",
                    fontWeight: "bold",
                  }}>
                  {errors?.otp}
                </div>
              )}
              <div style={{ fontSize: "14px" }} className='fw-bold mt-1'>
                {clock !== 0
                  ? `Valid till ${clock} second/s.`
                  : "OTP has expired!"}
              </div>
            </div>
          </div>

          <img
            src='./assets/svgs/close.svg'
            className='close-btn'
            alt=''
            onClick={() => setOTPView(false)}
          />
        </div>
      </div>

      <div className='text-center mb-3'>
        <h3 className='fw-bold signup-head'>Get Started For Free Today</h3>
      </div>
      <div>
        <FormInput
          labelName={"Name"}
          type='text'
          id='name'
          value={data.name}
          onChange={handleChange}
          errors={errors}
          mandatory={true}
          placeholder='name'
        />
      </div>
      <div>
        <FormInput
          labelName={"Username"}
          type='text'
          id='username'
          value={data.username}
          onChange={handleChange}
          errors={errors}
          mandatory={true}
          placeholder='username'
        />
      </div>
      <div>
        <FormInput
          labelName={"Email"}
          type='email'
          id='email'
          value={data.email}
          onChange={handleChange}
          errors={errors}
          mandatory={true}
          placeholder='email'
        />
      </div>
      <div>
        <label className='form-label' htmlFor='phone_no'>
          Phone Number<span className='text-danger'>*</span> :
          <div className='row'>
            <div className='col-3'>
              <input
                type='tel'
                className='form-control form-control-sm'
                id='area_code'
                value={data.area_code}
                onChange={handleChange}
                placeholder='91'
                maxLength='3'
              />
            </div>
            <div className='col-9'>
              <input
                type='tel'
                className={`form-control form-control-sm${
                  errors?.phone_no && " is-invalid"
                }`}
                id='phone_no'
                value={data.phone_no}
                onChange={handleChange}
                placeholder='phone number'
                maxLength='10'
              />
            </div>
          </div>
          <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
            {errors?.phone_no && errors?.phone_no}
          </div>
        </label>
      </div>
      <div>
        <div>
          Gender <span style={{ color: "grey", fontSize: 10 }}>(optional)</span>{" "}
          :
        </div>
        <div>
          <div className='form-check form-check-inline'>
            <input
              className='form-check-input'
              type='radio'
              name='gender'
              id='male'
              value='male'
              onChange={handleChange}
            />
            <label className='form-check-label' htmlFor='male'>
              Male
            </label>
          </div>
          <div className='form-check form-check-inline'>
            <input
              className='form-check-input'
              type='radio'
              name='gender'
              id='female'
              value='female'
              onChange={handleChange}
            />
            <label className='form-check-label' htmlFor='female'>
              Female
            </label>
          </div>
          <div className='form-check form-check-inline'>
            <input
              className='form-check-input'
              type='radio'
              name='gender'
              id='other'
              value='other'
              onChange={handleChange}
            />
            <label className='form-check-label' htmlFor='other'>
              Other
            </label>
          </div>
        </div>
        <div style={{ height: 10 }}></div>
      </div>
      <div>
        <FormInput
          labelName={"DOB"}
          type='date'
          id='dob'
          value={data.dob}
          onChange={handleChange}
          errors={errors}
          max={new Date().toISOString().slice(0, 10)}
          optional={true}
        />
      </div>
      <div>
        <FormInput
          labelName={"Password"}
          type='password'
          id='password'
          value={data.password}
          onChange={handleChange}
          errors={errors}
          mandatory={true}
        />
      </div>
      <div>
        <FormInput
          labelName={"Confirm Password"}
          type='password'
          id='c_password'
          value={data.c_password}
          onChange={handleChange}
          errors={errors}
          mandatory={true}
        />
      </div>
      <div className='form-check mt-2'>
        <input
          className='form-check-input'
          type='checkbox'
          id='terms'
          checked={termsChecked}
          onChange={() => setTermsChecked((prev) => !prev)}
        />
        <label className='form-check-label' htmlFor='terms'>
          By clicking, I agree the Terms and Conditions.
        </label>
      </div>
      <div style={{ fontSize: "10px", color: "red", minHeight: "12px" }}>
        {errors?.message}
      </div>
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn fw-bold'
          disabled={!termsChecked || loading}
          onClick={handleSubmit}>
          {!loading ? "Sign Up For Free" : "Signing Up"}
        </button>
      </div>
      <div
        className='mt-2 already-user'
        onClick={() => setSignUpMethod(2)}
        disabled={loading}>
        Already a user? Log In
      </div>
    </div>
  );
};

export default SignUp;
