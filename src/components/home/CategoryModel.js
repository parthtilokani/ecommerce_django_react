import React from "react";

const CategoryModel = ({
  categoryView,
  categories,
  setCategoryView,
  selectedCategory,
  setSelectedCategory,
  setSelectedSubCategory,
}) => {
  return (
    <div
      className='location-model'
      style={categoryView ? {} : { display: "none" }}>
      <div className='card'>
        <div className='h5 p-1 text-center'>Select Category</div>
        <div className='px-3 m-card-body'>
          <ul
            style={{
              listStyle: "none",
            }}>
            <hr className='m-1' />
            {selectedCategory?.name && (
              <li
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setSelectedCategory("");
                  setSelectedSubCategory("");
                  setCategoryView(false);
                }}>
                <p className='mx-2 fw-bold'>Remove Category</p>
                <hr className='m-1' />
              </li>
            )}
            {categories?.length > 0 &&
              categories?.map((category, idx) => (
                <li
                  key={idx}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedSubCategory("");
                    setCategoryView(false);
                  }}>
                  <p
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                    className='mx-2'>
                    {category.name}
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
          onClick={() => setCategoryView(false)}
        />
      </div>
    </div>
  );
};

export default CategoryModel;
