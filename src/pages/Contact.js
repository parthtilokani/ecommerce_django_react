import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

//css
import "../styles/css/contact.css";
import { axiosOpen } from "../utils/axios.js";
import { isValid } from "../utils/support.js";

const Contact = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      return await axiosOpen.post(`/user/contact_us`, formData);
    },
    onSuccess: (res) => {
      toast.success("Your message has been recorded");
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.detail || "Something went wrong! Retry");
    },
  });

  const handleSubmit = () => {
    const obj = {
      email: isValid("Email", data.email, "email"),
      name: isValid("Name", data.name),
      subject: isValid("Subject", data.subject),
      message: isValid("Message", data.message),
    };
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);

    mutate(data);
  };

  return (
    <div id='contact-main'>
      <div className='contact-body'>
        <div className='contact-map'></div>
        <div className='row'>
          <div className='col-md-6 mt-3'>
            <div className='h4'>Information</div>
            <div>Address Icon : Here will go the address</div>
            <div>Phone Icon : Here will go the contact number</div>
            <div>Email Icon : Here will go the email</div>
          </div>
          <div className='col-md-6 mt-3'>
            <div className='h4'>Send Us A Message</div>
            <div className='my-3'>
              <div className='mt-1'>
                <input
                  type='text'
                  id='name'
                  placeholder='Name*'
                  className={`form-control${errors?.name ? " is-invalid" : ""}`}
                  value={data.name}
                  maxLength='30'
                  onChange={handleChange}
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.name}
                </div>
              </div>
              <div className='mt-1'>
                <input
                  type='email'
                  id='email'
                  placeholder='Email*'
                  className={`form-control${
                    errors?.email ? " is-invalid" : ""
                  }`}
                  value={data.email}
                  onChange={handleChange}
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.email}
                </div>
              </div>
              <div className='mt-1'>
                <input
                  type='text'
                  id='subject'
                  placeholder='Subject*'
                  className={`form-control${
                    errors?.subject ? " is-invalid" : ""
                  }`}
                  value={data.subject}
                  onChange={handleChange}
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.subject}
                </div>
              </div>
              <div className='mt-1'>
                <textarea
                  id='message'
                  className={`form-control${
                    errors?.message ? " is-invalid" : ""
                  }`}
                  placeholder='Message*'
                  value={data.message}
                  onChange={handleChange}></textarea>
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.message}
                </div>
              </div>
              <div>
                <button
                  className='btn btn-primary'
                  disabled={isLoading}
                  onClick={handleSubmit}>
                  {isLoading ? "Submitting" : "Submit"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
