import React from "react";

// css
import "../styles/css/search.css";

const Search = () => {
  return (
    <div>
      <div id='search-hero'>
        <div className='overlay'>
          <div
            id='search-bar'
            className='position-absolute top-100 start-50 translate-middle'>
            <div className='row justify-content-center'>
              <div className='col-lg-6 col-xl-2 cols'>
                <div className='input-wrapper'>
                  <div>
                    <img src='/assets/svgs/location.svg' alt='location' />
                  </div>
                  <div
                    className='p-hldr'
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                    {"Location"}
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div className='input-wrapper'>
                  <div>
                    <img src='/assets/svgs/category.svg' alt='category' />
                  </div>
                  <div className='p-hldr'>Category</div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div className='input-wrapper'>
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
                  <input placeholder='Search Keywords' id='search' />
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

      <div id='search-results'>
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
    </div>
  );
};

export default Search;
