import React from "react";

// hooks
import useAuth from "../../hooks/useAuth.js";

export const SignIn = ({ setIsSignUp }) => {
  const { setAuth } = useAuth();

  const handleLogin = () => {
    setAuth({ token: "yes" });
  };

  return (
    <div className='signup-body flex-fill'>
      <div className='text-center'>
        <h3 className='fw-bold signup-head'>Welcome Back</h3>
      </div>
      <div className='mt-3'>
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
        <input className='form-check-input' type='checkbox' id='rememberme' />
        <label className='form-check-label' htmlFor='rememberme'>
          Remember me
        </label>
      </div>
      <div className='mt-3 text-center'>
        <button className='btn btn-primary signup-btn' onClick={handleLogin}>
          Sign In
        </button>
      </div>
      <div className='mt-1 already-user' onClick={() => setIsSignUp(true)}>
        Create a new Account!
      </div>
      <div className='mt-1 already-user'>Forgot Password?</div>
    </div>
  );
};

export default SignIn;
