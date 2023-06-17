import React from "react";

const SignUp = ({ setIsSignUp }) => {
  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Get Started For Free Today</h3>
      </div>
      <div className='row mt-3'>
        <div className='col-lg-6'>
          <label className='form-label' htmlFor='firstname'>
            Firstname :
          </label>
          <input
            type='text'
            className='form-control form-control-sm'
            id='firstname'
            autoComplete='false'
          />
        </div>
        <div className='col-lg-6'>
          <label className='form-label' htmlFor='lastname'>
            Lastname :
          </label>
          <input
            type='text'
            className='form-control form-control-sm'
            id='lastname'
            autoComplete='false'
          />
        </div>
      </div>
      <div>
        <label className='form-label' htmlFor='username'>
          Username :
        </label>
        <input
          type='text'
          className='form-control form-control-sm'
          id='username'
          autoComplete='false'
        />
      </div>
      <div>
        <label className='form-label' htmlFor='email'>
          Email :
        </label>
        <input
          type='text'
          className='form-control form-control-sm'
          id='email'
          autoComplete='false'
        />
      </div>
      <div>
        <label className='form-label' htmlFor='phonenumber'>
          Phone Number :
        </label>
        <input
          type='text'
          className='form-control form-control-sm'
          id='phonenumber'
          autoComplete='false'
        />
      </div>
      <div>
        <label className='form-label' htmlFor='password'>
          Password :
        </label>
        <input
          type='text'
          className='form-control form-control-sm'
          id='password'
          autoComplete='false'
        />
      </div>
      <div>
        <label className='form-label' htmlFor='otp'>
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
      <div className='form-check mt-2'>
        <input className='form-check-input' type='checkbox' id='terms' />
        <label className='form-check-label' htmlFor='terms'>
          By clicking, I agree...
        </label>
      </div>
      <div className='mt-3 text-center'>
        <button className='btn btn-primary signup-btn'>Sign Up For Free</button>
      </div>
      <div className='mt-1 already-user' onClick={() => setIsSignUp(false)}>
        Already a user? Sign In
      </div>
    </div>
  );
};

export default SignUp;
