import React from "react";

const SubCategoryModel = ({
  subCategoryView,
  subcategories,
  selectedCategory,
  setSelectedSubCategory,
  setSubCategoryView,
  selectedSubCategory,
}) => {
  const handleClose = () => setSubCategoryView(false);

  return (
    <div
      className='location-model'
      style={subCategoryView ? {} : { display: "none" }}
      onClick={handleClose}>
      <div className='card' onClick={(e) => e.stopPropagation()}>
        <div className='h5 p-1 text-center'>Select Sub-Category</div>
        <div className='px-3 category-model-body row align-items-stretch'>
          {selectedSubCategory?.name && (
            <div className='col-4'>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedSubCategory("");
                  setSubCategoryView(false);
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
          {!selectedCategory?.name && (
            <div className='col-4'>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedSubCategory("");
                  setSubCategoryView(false);
                }}>
                <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                  <div className='img-wrapper'>
                    <img src={"/assets/svgs/subcategory.svg"} alt='' />
                  </div>
                  <div className='c-name'>Select Category</div>
                </div>
              </div>
            </div>
          )}
          {subcategories?.length > 0 &&
            subcategories
              ?.filter((subc) =>
                selectedCategory?.id
                  ? Number(subc?.category) === Number(selectedCategory?.id || 0)
                  : false
              )
              ?.map((subcategory, idx) => (
                <div key={idx} className='col-4'>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedSubCategory(subcategory);
                      setSubCategoryView(false);
                    }}>
                    <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                      <div className='img-wrapper'>
                        <img src={"/assets/svgs/subcategory.svg"} alt='' />
                      </div>
                      <div className='c-name'>{subcategory?.name}</div>
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

export default SubCategoryModel;
