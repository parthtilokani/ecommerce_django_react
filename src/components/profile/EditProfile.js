import React from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import useAxiosPrivate from "../../hooks/useAxiosPrivate.js";
import { isValid } from "../../utils/support.js";
import FormInput from "../input/FormInput.js";

const EditProfile = ({ setEditModel, userData, refetchUser }) => {
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    name: userData?.name,
    gender: userData?.gender,
    dob: userData?.dob,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.name === "gender")
      return setData((prev) => ({ ...prev, gender: e.target.value }));
    if (e.target.id === "dob")
      return setData((prev) => ({
        ...prev,
        dob: new Date(`${e.target.value}`).toISOString().slice(0, 10),
      }));
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = () => {
    let obj = {
      name: isValid("Name", data.name),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);
    setErrors({});
    setLoading(true);
    axiosPrivate
      .patch("/user/user/edit_user_profile", { ...data })
      .then(() => {
        refetchUser();
        setEditModel(false);
        toast.success("Profile updated");
      })
      .catch((err) => {
        if (!err?.response)
          return setErrors({ message: "No internet connection!" });
        const { name } = err?.response?.data;
        setErrors((prev) => ({
          ...prev,
          name: name && name?.length > 0 ? name[0] : "",
        }));
      })
      .finally(() => setLoading(false));
  };

  return (
    <div id='edit-profile'>
      <div className='card'>
        <div className='text-center h4 fw-bold'>Edit Profile</div>

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
          <div>
            Gender{" "}
            <span style={{ color: "grey", fontSize: 10 }}>(optional)</span> :
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
                defaultChecked={data.gender === "male"}
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
                defaultChecked={data.gender === "female"}
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
                defaultChecked={data.gender === "other"}
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
          onClick={() => setEditModel(false)}
        />
      </div>
    </div>
  );
};

export default EditProfile;
