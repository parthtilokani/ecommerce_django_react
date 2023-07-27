import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { axiosOpen } from "../utils/axios.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { getSystemDynamicField } from "../utils/DynamicFields.js";
import { isValid } from "../utils/support.js";

//css
import "../styles/css/postnewad.css";

const PostNewAdd = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const subCategoryRef = useRef();
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    ad_title: "",
    ad_description: "",
    price: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [images, setImages] = useState([]);
  const imageRef = useRef();

  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/category");
      setFetchedQueries((prev) => {
        prev[0] = true;
        return [...prev];
      });
      return typeof data === "object" ? [...data] : [];
    },
    enabled: !fetchedQueries[0],
  });
  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/subcategory");
      setFetchedQueries((prev) => {
        prev[1] = true;
        return [...prev];
      });
      return typeof data === "object" ? [...data] : [];
    },
    enabled: !fetchedQueries[1],
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      return await axiosPrivate.post(`/ads/ads`, formData);
    },
    onSuccess: (res) => {
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: (err) => {
      console.log(err);
      toast.error("Something went wrong! Retry");
    },
  });
  const { mutateAsync: uploadImage, isLoading: isUploadingImage } = useMutation(
    {
      mutationFn: async (formData) => {
        return await axiosPrivate.post(`/ads/ads_image`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      },
    }
  );

  const handleCategoryClick = (idx) => {
    setSelectedCategory(idx);
    setSelectedSubCategory("");
    if (window.innerWidth > 756) return;
    window.scrollTo(0, subCategoryRef.current.offsetTop - 50);
  };

  const handleSubCategoryClick = (idx) => {
    setSelectedSubCategory(idx);
    const dymFields =
      subcategories?.find((c) => c.id === idx)?.dynamic_field || [];
    setDynamicFields([...dymFields?.map((df) => ({ ...df, value: "" }))]);
    setStage(2);
    window.scrollTo(0, 0);
  };

  const handleChange = (e) =>
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handlePostDFChange = (e, idx) => {
    let dynamicFieldsClone = dynamicFields;
    dynamicFieldsClone[idx] = {
      ...dynamicFieldsClone[idx],
      value: e.target.value,
    };
    setDynamicFields([...dynamicFieldsClone]);
  };

  const deleteImage = (idx) =>
    setImages((prev) => [...prev.filter((_, i) => i !== idx)]);

  const handleFileChange = (e) => {
    const files = e.target?.files || [];
    if (files.length === 0) return;
    if (files.length + images.length > 12) return;
    const newImgs = [];
    for (let file of files) {
      if (file.type.split("/")[0] !== "image") continue;
      newImgs.push({
        name: file.name,
        src: URL.createObjectURL(file),
        image: file,
      });
    }
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleSubmit = () => {
    const obj = {
      ad_title: isValid("Ad title", data.ad_title),
      ad_description: isValid("Ad description", data.ad_description),
      price: isValid("Price", data.price),
    };
    dynamicFields.forEach(
      (df) => (obj[df?.field_name] = isValid(df?.field_name, df?.value))
    );
    if (images.length === 0) obj.images = "Atleast upload one image!";
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);

    setErrors({});
    const formData = {
      ...data,
      category: selectedCategory,
      sub_category: selectedSubCategory,
      dynamic_field: dynamicFields.map((df) => ({
        field_name: df?.field_name,
        field_type: df?.field_type,
        value: df?.value,
      })),
      is_sold: false,
    };
    mutate(formData);
  };

  const handleSubmitImages = (ads_id) => {
    Promise.all([
      images.map((img) => {
        const formData = new FormData();
        formData.append("image", img?.image);
        formData.append("ads", ads_id);
        return uploadImage(formData);
      }),
    ]).finally(() => {
      toast.success("Your Ad was posted!");
      navigate(`/ads/view/${ads_id}`);
    });
  };

  return (
    <div id='post-new-ad'>
      <div className='text-center h3 fw-bold'>POST YOUR AD</div>
      <div className='pya-main'>
        {stage === 1 ? (
          <>
            <div className='row'>
              <div className='col-md-6'>
                <div className='h5 fw-bold'>Choose category :</div>
                <ul className='categories'>
                  {isLoadingCategories && (
                    <li>
                      <div className='c-name disabled'>Loading...</div>
                    </li>
                  )}
                  {categories?.map((category, i) => (
                    <li key={i}>
                      <div
                        onClick={() => handleCategoryClick(category.id)}
                        className={`c-name${
                          selectedCategory === category.id ? " active" : ""
                        }`}>
                        {category.name}
                        {selectedCategory === category.id && (
                          <div className='c-toggle'>&gt;</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='col-md-6' ref={subCategoryRef}>
                <div className='h5 fw-bold'>Choose subcategory :</div>
                <ul className='categories'>
                  {selectedCategory ? (
                    subcategories
                      ?.filter((e) => e.category === selectedCategory)
                      ?.map((subcategory, i) => (
                        <li key={i}>
                          <div
                            className={`c-name${
                              selectedSubCategory === subcategory.id
                                ? " active"
                                : ""
                            }`}
                            onClick={() =>
                              handleSubCategoryClick(subcategory.id)
                            }>
                            {subcategory.name}
                          </div>
                        </li>
                      ))
                  ) : (
                    <li>
                      <div className='c-name disabled'>Choose a Category</div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className='row'>
              <div className='col-md-6'>
                <div>
                  <label className='form-label m-0' htmlFor='ad_title'>
                    Ad title :
                  </label>
                  <input
                    type='text'
                    className={`form-control form-control-sm${
                      errors?.ad_title ? " is-invalid" : ""
                    }`}
                    id='ad_title'
                    value={data.ad_title}
                    onChange={handleChange}
                    maxLength='200'
                  />
                  <div
                    style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                    {errors?.ad_title && errors?.ad_title}
                  </div>
                </div>
                <div>
                  <label className='form-label m-0' htmlFor='ad_description'>
                    Ad description :
                  </label>
                  <textarea
                    className={`form-control form-control-sm${
                      errors?.ad_description ? " is-invalid" : ""
                    }`}
                    id='ad_description'
                    value={data.ad_description}
                    onChange={handleChange}
                  />
                  <div
                    style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                    {errors?.ad_description && errors?.ad_description}
                  </div>
                </div>
                <div>
                  <label className='form-label m-0' htmlFor='price'>
                    Price :
                  </label>
                  <input
                    type='number'
                    className={`form-control form-control-sm${
                      errors?.price ? " is-invalid" : ""
                    }`}
                    id='price'
                    value={data.price}
                    onChange={handleChange}
                    maxLength='15'
                  />
                  <div
                    style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                    {errors?.price && errors?.price}
                  </div>
                </div>
                {dynamicFields?.map((df, i) => (
                  <div className='mt-2' key={i}>
                    <label className='form-label m-0' htmlFor={df?.field_name}>
                      {df?.field_name} :
                    </label>
                    {getSystemDynamicField({
                      ...df,
                      onChange: handlePostDFChange,
                      idx: i,
                      className: `form-control form-control-sm${
                        errors[df?.field_name] ? " is-invalid" : ""
                      }`,
                    })}
                    <div
                      style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                      {errors[df?.field_name] && errors[df?.field_name]}
                    </div>
                  </div>
                ))}
              </div>
              <div className='col-md-6'>
                <div>
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
                  <div
                    style={{
                      fontSize: "10px",
                      color: "red",
                      minHeight: 10,
                      marginLeft: 5,
                    }}>
                    {errors?.images && errors?.images}
                  </div>
                </div>
              </div>
            </div>
            <div className='text-end'>
              <button
                className='btn btn-back text-white me-2'
                onClick={() => {
                  setStage(1);
                  setErrors({});
                  window.scrollTo(0, 0);
                }}
                disabled={isLoading}>
                Back
              </button>
              <button
                className='btn btn-submit text-white'
                onClick={handleSubmit}
                disabled={isLoading || isUploadingImage}>
                {isLoading || isUploadingImage ? "Posting" : "Post Ad"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PostNewAdd;
