import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { isValid } from "../../utils/support.js";
import FormInput from "../input/FormInput.js";

const ChangePassword = ({ setChangePasswordModel }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    old_password: "",
    new_password: "",
    confirm_new_password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState({
    old_password: false,
    new_password: false,
    confirm_new_password: false,
  });

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = () => {
    let obj = {
      old_password: isValid("Old Password", data.old_password),
      new_password: isValid("New Password", data.new_password, "password"),
      confirm_new_password: isValid(
        "Confirm New Password",
        data.confirm_new_password
      ),
    };
    if (
      !obj?.confirm_new_password &&
      data.new_password !== data.confirm_new_password
    )
      obj.confirm_new_password = "Password doen't match";
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .post("/user/user/change_password", {
        ...data,
        password: data.new_password,
        password_1: data.confirm_new_password,
      })
      .then(() => {
        setChangePasswordModel(false);
        toast.success("Password updated");
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { non_field_errors } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          old_password:
            non_field_errors && non_field_errors?.length > 0
              ? non_field_errors[0]
              : "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div id='edit-profile'>
      <div className='card'>
        <div className='text-center h4 fw-bold'>Change Password</div>

        <div className='position-relative'>
          <FormInput
            labelName='Old Password'
            type={showPassword.old_password ? "text" : "password"}
            id='old_password'
            value={data.old_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='old password'
          />
          <div
            className='icon-div'
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                old_password: !prev.old_password,
              }))
            }>
            <img
              src={
                showPassword.old_password
                  ? "/assets/svgs/eye-close.png"
                  : "/assets/svgs/eye-open.png"
              }
              alt='passsword'
            />
          </div>
        </div>
        <div className='position-relative'>
          <FormInput
            labelName='New Password'
            type={showPassword.new_password ? "text" : "password"}
            id='new_password'
            value={data.new_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='new password'
          />
          <div
            className='icon-div'
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                new_password: !prev.new_password,
              }))
            }>
            <img
              src={
                showPassword.new_password
                  ? "/assets/svgs/eye-close.png"
                  : "/assets/svgs/eye-open.png"
              }
              alt='passsword'
            />
          </div>
        </div>
        <div className='position-relative'>
          <FormInput
            labelName='Confirm New Password'
            type={showPassword.confirm_new_password ? "text" : "password"}
            id='confirm_new_password'
            value={data.confirm_new_password}
            onChange={handleChange}
            errors={errors}
            mandatory={true}
            placeholder='confirm new password'
          />
          <div
            className='icon-div'
            onClick={() =>
              setShowPassword((prev) => ({
                ...prev,
                confirm_new_password: !prev.confirm_new_password,
              }))
            }>
            <img
              src={
                showPassword.confirm_new_password
                  ? "/assets/svgs/eye-close.png"
                  : "/assets/svgs/eye-open.png"
              }
              alt='passsword'
            />
          </div>
        </div>
        <div className='mt-1 text-end'>
          <button
            className='btn btn-success'
            disabled={loading}
            onClick={handleSubmit}>
            {loading ? "Saving" : "Save"}
          </button>
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
