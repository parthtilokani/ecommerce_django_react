import React from "react";

// css
import "../styles/css/footer.css";

const Footer = () => {
  return (
    <footer>
      <div className='footer-main row'>
        <div className='col-xl-3 col-lg-6'>
          <div className='p-3'>
            <div className='h2 fw-bold'> Classified Ads</div>
            <div className='my-2'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat
              eius quidem illo velit ea quam quae. Iste aliquam repellat veniam.
            </div>
            <div className='f-icons-group d-flex mt-3'>
              {[
                "./assets/svgs/facebook.svg",
                "./assets/svgs/twitter.svg",
                "./assets/svgs/mail.svg",
                "./assets/svgs/linkedin.svg",
                "./assets/svgs/pinterest.svg",
              ].map((e, i) => (
                <div key={i} className='f-icon-div mt-1 me-1'>
                  <img src={e} alt='' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
