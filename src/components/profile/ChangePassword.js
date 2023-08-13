import React from "react";
import FormInput from "../input/FormInput.js";

const ChangePassword = ({ setChangePasswordModel }) => {
  const data = {};
  const errors = {};
  const handleChange = () => {};

  return (
    <div id='edit-profile'>
      <div className='card'>
        <div className='text-center h4 fw-bold'>Change Password</div>

        <div>
          <FormInput
            labelName={"Old Password"}
            type='text'
            id='old_password'
            value={data.old_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='old password'
          />
        </div>
        <div>
          <FormInput
            labelName={"New Password"}
            type='text'
            id='new_password'
            value={data.new_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='new password'
          />
        </div>
        <div>
          <FormInput
            labelName={"Confirm New Password"}
            type='text'
            id='confirm_password'
            value={data.confirm_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='confirm new password'
          />
        </div>
        <div className='mt-1 text-end'>
          <button className='btn btn-success'>Save</button>
        </div>

        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={() => setChangePasswordModel(false)}
        />
      </div>
    </div>
  );
};

export default ChangePassword;
