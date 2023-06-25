import React, { useState } from "react";

import FormInput from "../input/FormInput.js";

import { axiosPrivate } from "../../utils/axios.js";
import { isValid } from "../../utils/support.js";

const SignUp = ({ setSignUpMethod, setMessage }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    username: "",
    phonenumber: "",
  });
  const [termsChecked, setTermsChecked] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = () => {
    let obj = {
      name: isValid("Name", data.name),
      // firstname: isValid("Firstname", data.firstname),
      // lastname: isValid("Lastname", data.lastname),
      // username: isValid("Username", data.username, "username"),
      email: isValid("Email", data.email, "email"),
      password: isValid("Password", data.password, "password"),
      // phonenumber: isValid("Phone number", data.phonenumber, "phonenumber"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .post("/register", { ...data })
      .then((res) => {
        setSignUpMethod(2);
        setMessage("Registration successful. Sign in to continue");
      })
      .catch((err) => {
        const { name, email, password } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          name: name && name?.length > 0 ? name[0] : "",
          email: email && email?.length > 0 ? email[0] : "",
          password: password && password?.length > 0 ? password[0] : "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center mb-3'>
        <h3 className='fw-bold signup-head'>Get Started For Free Today</h3>
      </div>
      {/* <div className='row mt-3'>
        <div className='col-lg-6'>
          <FormInput
            labelName={"Firstname"}
            type='text'
            id='firstname'
            value={data.firstname}
            onChange={handleChange}
            errors={errors}
          />
        </div>
        <div className='col-lg-6'>
          <FormInput
            labelName={"Lastname"}
            type='text'
            id='lastname'
            value={data.lastname}
            onChange={handleChange}
            errors={errors}
          />
        </div>
      </div> */}
      {/* <div>
        <FormInput
          labelName={"Username"}
          type='text'
          id='username'
          value={data.username}
          onChange={handleChange}
          errors={errors}
        />
      </div> */}
      <div>
        <FormInput
          labelName={"Name"}
          type='text'
          id='name'
          value={data.name}
          onChange={handleChange}
          errors={errors}
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
        />
      </div>
      <div>
        <FormInput
          labelName={"Phone Number"}
          type='text'
          id='phonenumber'
          value={data.phonenumber}
          onChange={handleChange}
          errors={errors}
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
        />
      </div>
      <div>
        <FormInput
          labelName={"OTP"}
          type='text'
          id='otp'
          value={data.otp}
          onChange={handleChange}
          errors={errors}
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
      {errors?.message && (
        <div style={{ fontSize: "10px", color: "red" }}>{errors?.message}</div>
      )}
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn'
          disabled={!termsChecked || loading}
          onClick={handleSubmit}>
          {!loading ? "Sign Up For Free" : "Signing Up"}
        </button>
      </div>
      <div
        className='mt-1 already-user'
        onClick={() => setSignUpMethod(2)}
        disabled={loading}>
        Already a user? Sign In
      </div>
    </div>
  );
};

export default SignUp;
