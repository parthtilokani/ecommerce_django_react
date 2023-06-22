import React, { useState } from "react";

import FormInput from "../input/FormInput.js";

import { isValid } from "../../utils/support.js";

const SignUp = ({ setIsSignUp }) => {
  const [data, setData] = useState({
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
      firstname: isValid("Firstname", data.firstname),
      lastname: isValid("Lastname", data.lastname),
      username: isValid("Username", data.username, "username"),
      email: isValid("Email", data.email, "email"),
      password: isValid("Password", data.password, "password"),
      phonenumber: isValid("Phone number", data.phonenumber, "phonenumber"),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Get Started For Free Today</h3>
      </div>
      <div className='row mt-3'>
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
      </div>
      <div>
        <FormInput
          labelName={"Username"}
          type='text'
          id='username'
          value={data.username}
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
          By clicking, I agree...
        </label>
      </div>
      <div className='mt-3 text-center'>
        <button
          className='btn btn-primary signup-btn'
          disabled={!termsChecked}
          onClick={handleSubmit}>
          Sign Up For Free
        </button>
      </div>
      <div className='mt-1 already-user' onClick={() => setIsSignUp(false)}>
        Already a user? Sign In
      </div>
    </div>
  );
};

export default SignUp;
