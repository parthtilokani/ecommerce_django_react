import React, { useState, useRef } from "react";

//css
import "../styles/css/postnewadd.css";

const PostNewAdd = () => {
  const [active, setActive] = useState();
  const [stage, setStage] = useState(1);
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [images, setImages] = useState([]);
  const imageRef = useRef();

  const handleCategoryClick = (idx) => {
    setActive((prev) => (prev === idx ? null : idx));
    setCategory((prev) => (prev === idx ? null : idx));
    setSubCategory("");
  };

  const handleSubCategoryClick = (idx) => {
    setSubCategory(idx);
    setStage(2);
    window.scrollTo(0, 0);
  };

  const deleteImage = (idx) => {
    setImages((prev) => [...prev.filter((_, i) => i !== idx)]);
  };

  const handleFileChange = (e) => {
    const files = e.target?.files || [];
    if (files.length === 0) return;
    const newImgs = [];
    for (let file of files) {
      if (file.type.split("/")[0] !== "image") continue;
      newImgs.push({ name: file.name, src: URL.createObjectURL(file) });
    }
    setImages((prev) => [...prev, ...newImgs]);
  };

  return (
    <div id='post-new-ad'>
      <div className='text-center h3 fw-bold'>POST YOUR AD</div>
      <div className='pya-main'>
        {stage === 1 ? (
          <>
            <div className='h5 fw-bold'>Choose category and sub-category :</div>
            <ul className='categories'>
              {new Array(10).fill(null).map((_, i) => (
                <li key={i}>
                  <div
                    onClick={() => handleCategoryClick(i)}
                    className='c-name'>
                    Bussiness & Technology
                    <div className='c-toggle'>{active === i ? "x" : "+"}</div>
                  </div>
                  <ul
                    className={`sub-categories ${
                      active === i ? "active" : ""
                    }`}>
                    {new Array(5).fill(null).map((_, i) => (
                      <li key={i} onClick={() => handleSubCategoryClick(i)}>
                        Sub Category
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <div className='my-2'>
              <div>
                <label className='form-label m-0' htmlFor='title'>
                  Ad title :
                </label>
                <input type='text' className='form-control' id='title' />
              </div>
              <div className='mt-2'>
                <label className='form-label m-0' htmlFor='description'>
                  Ad description :
                </label>
                <textarea className='form-control' id='description' />
              </div>
              <div className='mt-2'>
                <label className='form-label m-0' htmlFor='price'>
                  Price :
                </label>
                <input type='number' className='form-control' id='price' />
              </div>
              <div className='mt-2'>
                <label className='form-label m-0'>
                  Upload upto 12 images :
                </label>
                <input
                  type='file'
                  accept='image/*'
                  style={{ display: "none" }}
                  ref={imageRef}
                  multiple={true}
                  onChange={handleFileChange}
                />
                <div className='mt-1 img-input'>
                  {new Array(12).fill(null).map((_, i) => (
                    <div key={i} className='img-input-col'>
                      {images[i] ? (
                        <div className='img-wrapper'>
                          <img src={images[i].src} alt='' />
                          <span onClick={() => deleteImage(i)}>&times;</span>
                        </div>
                      ) : (
                        <div
                          onClick={() => imageRef.current.click()}
                          className='img-placeholder'>
                          <img src='/assets/svgs/img-ph.svg' alt='' />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='text-end'>
              <button
                className='btn btn-info text-white me-2'
                onClick={() => setStage(1)}>
                Back
              </button>
              <button className='btn btn-primary'>Post Ad</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostNewAdd;
