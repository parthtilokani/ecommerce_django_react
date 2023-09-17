import React from "react";

import { URI } from "../../utils/API.js";

const CategoryModel = ({
  categoryView,
  categories,
  setCategoryView,
  selectedCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  const handleClose = () => setCategoryView(false);

  return (
    <div
      className='location-model'
      style={categoryView ? {} : { display: "none" }}
      onClick={handleClose}>
      <div className='card' onClick={(e) => e.stopPropagation()}>
        <div className='h5 p-1 text-center'>Select Category</div>
        <div className='px-3 category-model-body row align-items-stretch'>
          {selectedCategory?.name && (
            <div className='col-4'>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubCategory("");
                  setCategoryView(false);
                }}>
                <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                  <div className='img-wrapper'>
                    <img src={"/assets/svgs/subcategory.svg"} alt='' />
                  </div>
                  <div className='c-name'>Unselect</div>
                </div>
              </div>
            </div>
          )}
          {categories?.length > 0 &&
            categories?.map((category, idx) => (
              <div key={idx} className='col-4 mb-4'>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubCategory("");
                    setCategoryView(false);
                  }}>
                  <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                    <div className='img-wrapper'>
                      <img
                        src={category?.icon?.replace(
                          "https://classified-ads.us-west-2.elasticbeanstalk.com",
                          URI
                        )}
                        alt=''
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/assets/svgs/subcategory.svg";
                        }}
                      />
                    </div>
                    <div className='c-name text-center'>{category?.name}</div>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default CategoryModel;
