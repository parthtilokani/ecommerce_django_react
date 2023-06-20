import React, { useState } from "react";

// css
import "../styles/css/home.css";

const Home = () => {
  const [locationView, setLocationView] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [subCategoryView, setSubCategoryView] = useState(false);

  return (
    <div className='position-relative'>
      {/*HERO*/}
      <div id='home-hero'>
        <div className='overlay'>
          <div id='home-search'>
            <div className='row justify-content-center'>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setLocationView(true)}>
                  <div>
                    <img src='/assets/svgs/location.svg' alt='location' />
                  </div>
                  <div className='p-hldr'>Location</div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setCategoryView(true)}>
                  <div>
                    <img src='/assets/svgs/category.svg' alt='category' />
                  </div>
                  <div className='p-hldr'>Category</div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setSubCategoryView(true)}>
                  <div>
                    <img
                      src='/assets/svgs/subcategory.svg'
                      alt='sub-category'
                    />
                  </div>
                  <div className='p-hldr'>Sub-Category</div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-4 cols'>
                <div className='input-wrapper'>
                  <div>
                    <img src='/assets/svgs/text.svg' alt='text' />
                  </div>
                  <input className='' placeholder='Search Keywords' />
                </div>
              </div>
              <div className='col-lg-12 col-xl-2 cols'>
                <div className='input-wrapper search-btn justify-content-center'>
                  <div>
                    <img src='/assets/svgs/search.svg' alt='search' />
                  </div>
                  <div className='p-hldr'>Search</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Models*/}
      <div
        className='location-model'
        style={locationView ? {} : { display: "none" }}>
        <div className='card'>
          <div className='h5 p-1 text-center'>Select Location</div>
          <img
            src='./assets/svgs/close.svg'
            className='close-btn'
            alt=''
            onClick={() => setLocationView(false)}
          />
        </div>
      </div>
      <div
        className='location-model'
        style={categoryView ? {} : { display: "none" }}>
        <div className='card'>
          <div className='h5 p-1 text-center'>Select Category</div>
          <img
            src='./assets/svgs/close.svg'
            className='close-btn'
            alt=''
            onClick={() => setCategoryView(false)}
          />
        </div>
      </div>
      <div
        className='location-model'
        style={subCategoryView ? {} : { display: "none" }}>
        <div className='card'>
          <div className='h5 p-1 text-center'>Select Sub-Category</div>
          <img
            src='./assets/svgs/close.svg'
            className='close-btn'
            alt=''
            onClick={() => setSubCategoryView(false)}
          />
        </div>
      </div>

      {/*POPULAR Categories*/}
      <div id='home-pp-categories'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Popular Categories</div>
        </div>
        <div className='categories-main row mx-auto'>
          {new Array(8).fill(null).map((_, i) => (
            <div key={i} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3'>
              <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                <div className='img-wrapper'>
                  <img src='/assets/svgs/subcategory.svg' alt='' />
                </div>
                <div className='h5'>Bussiness & Industry</div>
                <div className='h6'>17 Ads</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Featured Ads*/}
      <div id='home-featured-ads'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Featured Ads</div>
        </div>
        <div className='featured-ads-main row mx-auto'>
          {new Array(8).fill(null).map((_, i) => (
            <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3' key={i}>
              <div className='fa-card'>
                <div className='fa-img-main position-relative'>
                  <img
                    src='https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/themes/classima/assets/img/noimage-listing-thumb.jpg'
                    alt=''
                  />
                  <div className='fa-img-overlay'></div>
                </div>
                <div className='fa-card-body'>
                  <div className='h6 fw-bold'>Vertillas By MultiBHK</div>
                  <div className='d-flex align-items-center'>
                    <img src='/assets/svgs/time.svg' alt='' />
                    <span>3 days ago</span>
                  </div>
                  <div className='d-flex align-items-center'>
                    <img src='/assets/svgs/profile.svg' alt='' />
                    <span>Yakuza</span>
                  </div>
                  <div className='d-flex align-items-center'>
                    <img src='/assets/svgs/location.svg' alt='' />
                    <span>Denmark</span>
                  </div>
                  <div className='h4 fw-bold'>₹ 40,000</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Our Top Locations*/}
      <div id='home-top-locations'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Our Top Locations</div>
        </div>
        <div className='top-locations-main row mx-auto'>
          {new Array(4).fill(null).map((_, i) => (
            <div className='col-lg-6 p-3' key={i}>
              <div className='tl-card position-relative'>
                <img
                  src='https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/uploads/2019/09/New-Jersey.jpg'
                  alt=''
                />
                <div className='caption-overlay'>
                  <div className='cap-location d-flex justify-content-center align-items-center'>
                    <div className='h5'>Amsterdam</div>
                  </div>
                  <div className='h6'>17 Ads</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Info Panel*/}
      <div id='home-info-panel'>
        <div className='info-panel-main'>
          <div className='info-overlay'>
            <div className='row mx-auto'>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/ads.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>5000+</div>
                      <p className='h5 text-white'>Published Ads</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/users.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>3242+</div>
                      <p className='h5 text-white'>Registered Users</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/verified.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>2000+</div>
                      <p className='h5 text-white'>Verified Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Our Pricing and Packages*/}
      <div id='home-our-pricing'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Our Pricing and Packages</div>
        </div>
        <div className='row mx-auto our-pricing-main'>
          {new Array(4).fill(null).map((_, i) => (
            <div className='col-xl-3 col-lg-4 col-md-6' key={i}>
              <div className='our-pricing-card mx-auto'>
                <div className='h4'>Free</div>
                <div className='h1 pricing'>
                  ₹ 0<span>/Per month</span>
                </div>
                <div className='op-features'>3 Regular Ads</div>
                <div className='op-features'>No Featured Ads</div>
                <div className='op-features'>No Top Ads</div>
                <div className='op-features'>No Ads will be bumped up</div>
                <div className='op-features'>Limited Support</div>
                <div>
                  <button>Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
