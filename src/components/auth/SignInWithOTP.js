import React, { useState } from "react";
// hooks
import useAuth from "../../hooks/useAuth.js";
import { isValid } from "../../utils/support.js";
import { axiosPrivate } from "../../utils/axios.js";

export const SignInWithOTP = ({ setSignUpMethod }) => {
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const { setAuth } = useAuth();
  const [data, setData] = useState({
    phonenumber: "",
    otp: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleLogin = () => {
    let obj = {
      phonenumber: isValid("Phone Number", data.phonenumber, "phonenumber"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    // setLoading(true);
    // axiosPrivate
    //   .post("/tokenwithotp", { ...data })
    //   .then((res) => {
    //     setSignUpMethod(2);
    //   })
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
        <h3 className='fw-bold signup-head'>Welcome Back</h3>
      </div>
      <div className='mt-3'>
        <label className='form-label mb-0' htmlFor='phonenumber'>
          Phone Number :
        </label>
        <div className='row pe-2'>
          <div className='col-sm-9 col-8'>
            <input
              type={"text"}
              className={`form-control form-control-sm ${
                errors?.phonenumber ? " is-invalid" : ""
              }`}
              autoComplete='off'
              id='phonenumber'
              value={data.phonenumber}
              onChange={handleChange}
            />
          </div>
          <button
            className='col-sm-3 col-4 btn btn-sm btn-primary signup-btn'
            onClick={handleLogin}>
            Get OTP
          </button>
        </div>
        {errors?.phonenumber && (
          <div style={{ fontSize: "10px", color: "red" }}>
            {errors?.phonenumber}
          </div>
        )}
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
      {errors?.message && (
        <div style={{ fontSize: "10px", color: "red" }}>{errors?.message}</div>
      )}
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn'
          onClick={handleLogin}
          disabled={loading || !otpSent}>
          Sign In
        </button>
      </div>
      <div className='mt-1 already-user' onClick={() => setSignUpMethod(2)}>
        Sign In with password!
      </div>
      <div className='mt-1 already-user' onClick={() => setSignUpMethod(1)}>
        Create a new Account!
      </div>
    </div>
  );
};

export default SignInWithOTP;
