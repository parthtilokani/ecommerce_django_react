import React from "react";

const SubCategoryModel = ({
  subCategoryView,
  subcategories,
  selectedCategory,
  setSelectedSubCategory,
  setSubCategoryView,
  selectedSubCategory,
}) => {
  return (
    <div
      className='location-model'
      style={subCategoryView ? {} : { display: "none" }}>
      <div className='card'>
        <div className='h5 p-1 text-center'>Select Sub-Category</div>
        <div className='px-3' style={{ maxHeight: 200, overflowY: "scroll" }}>
          <ul
            style={{
              listStyle: "none",
            }}>
            <hr className='m-1' />
            {selectedSubCategory?.name && (
              <li
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedSubCategory("");
                  setSubCategoryView(false);
                }}>
                <p className='mx-2 fw-bold text-center'>Remove SubCategory</p>
                <hr className='m-1' />
              </li>
            )}
            {!selectedCategory?.name && (
              <li>
                <p className='mx-2 fw-bold text-center'>Select Category</p>
                <hr className='m-1' />
              </li>
            )}
            {subcategories?.length > 0 &&
              subcategories
                ?.filter((subc) =>
                  selectedCategory?.id
                    ? Number(subc?.category) ===
                      Number(selectedCategory?.id || 0)
                    : false
                )
                ?.map((subcategory, idx) => (
                  <li
                    key={idx}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setSelectedSubCategory(subcategory);
                      setSubCategoryView(false);
                    }}>
                    <p
                      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                      className='mx-2'>
                      {subcategory.name}
                    </p>
                    <hr className='m-1' />
                  </li>
                ))}
          </ul>
        </div>
        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={() => setSubCategoryView(false)}
        />
      </div>
    </div>
  );
};

export default SubCategoryModel;
