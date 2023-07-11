import React from "react";

//css
import "../styles/css/contact.css";

const Contact = () => {
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
              <div className='mb-2'>
                <input
                  type='text'
                  placeholder='Name*'
                  className='form-control'
                />
              </div>
              <div className='mb-2'>
                <input
                  type='email'
                  placeholder='Email*'
                  className='form-control'
                />
              </div>
              <div className='mb-2'>
                <input
                  type='text'
                  placeholder='Subject*'
                  className='form-control'
                />
              </div>
              <div className='mb-2'>
                <textarea
                  className='form-control'
                  placeholder='Message*'></textarea>
              </div>
              <div>
                <button className='btn btn-primary'>Submit</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
