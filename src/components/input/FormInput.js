import React from "react";

const FormInput = ({
  labelName,
  type,
  id,
  value,
  onChange,
  errors,
  min,
  max,
  maxLength,
  mandatory,
  optional,
  placeholder,
}) => {
  return (
    <>
      <label className='form-label mb-0' htmlFor={id}>
        {labelName}
        {mandatory && <span className='text-danger'>*</span>}
        {optional && (
          <span style={{ color: "grey", fontSize: 10 }}> (optional)</span>
        )}{" "}
        :
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
        min={min}
        max={max}
        maxLength={maxLength || 30}
        placeholder={placeholder}
      />
      <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
        {errors[id] && errors[id]}
      </div>
    </>
  );
};

export default FormInput;
