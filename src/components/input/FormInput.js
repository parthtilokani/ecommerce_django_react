import React from "react";

const FormInput = ({ labelName, type, id, value, onChange, errors }) => {
  return (
    <>
      <label className='form-label mb-0' htmlFor={id}>
        {labelName} :
      </label>
      <input
        type={type || "text"}
        className={`form-control form-control-sm ${
          errors[id] ? " is-invalid" : ""
        }`}
        autoComplete='off'
        id={id}
        value={value}
        onChange={onChange}
      />
      {errors[id] && (
        <div style={{ fontSize: "10px", color: "red" }}>{errors[id]}</div>
      )}
    </>
  );
};

export default FormInput;
