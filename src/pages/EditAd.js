import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { axiosOpen } from "../utils/axios.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { getSystemDynamicField } from "../utils/DynamicFields.js";
import { isValid } from "../utils/support.js";

//css
import "../styles/css/postnewad.css";
import { URI } from "../utils/API.js";

const EditAd = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id: adId } = useParams();
  const [data, setData] = useState({
    ad_title: "",
    ad_description: "",
    price: "",
    category: "",
    sub_category: "",
    enabled: true,
    district: "",
    state: "",
    country: "",
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const imageRef = useRef();

  const [fetchedQueries, setFetchedQueries] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
  const { data: categories } = useQuery({
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
  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/country", {
        page: 1,
        page_size: 1000,
      });
      setFetchedQueries((prev) => {
        prev[2] = true;
        return [...prev];
      });
      return data?.results || [];
    },
    enabled: !fetchedQueries[2],
  });
  const { data: states } = useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/state", {
        page: 1,
        page_size: 1000,
      });
      setFetchedQueries((prev) => {
        prev[3] = true;
        return [...prev];
      });
      return data?.results || [];
    },
    enabled: !fetchedQueries[3],
  });
  const { data: cities } = useQuery({
    queryKey: ["cities"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/district", {
        page: 1,
        page_size: 1000,
      });
      setFetchedQueries((prev) => {
        prev[4] = true;
        return [...prev];
      });
      return data?.results || [];
    },
    enabled: !fetchedQueries[4],
  });

  const { data: ad, isLoading: isLoadingAd } = useQuery({
    queryKey: ["single_ad"],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/ads/ads/${adId}`);
      setData({
        ad_title: data?.ad_title || "",
        ad_description: data?.ad_description || "",
        price: data?.price || "",
        category: data?.category || "",
        sub_category: data?.sub_category || "",
        district: data?.district || "",
        state: data?.state || "",
        country: data?.country || "",
        enabled: false,
      });

      //if sub category and dynamic_fields are present
      if (subcategories?.length > 0 && data?.dynamic_field?.length > 0) {
        const dymFields =
          subcategories?.find(
            (c) => Number(c.id) === Number(data?.sub_category)
          )?.dynamic_field || [];
        if (dymFields?.length > 0) {
          let obj = {};
          data?.dynamic_field?.map((e) => (obj[e?.field_name] = e?.value));
          setDynamicFields([
            ...dymFields?.map((df) => ({
              ...df,
              value: obj[df?.field_name] || "",
            })),
          ]);
        }
      }
      setImages([...(data?.images || [])]);

      return data || [];
    },
    enabled: data?.enabled,
  });
  const { mutate, isLoading } = useMutation({
    mutationFn: async (formData) => {
      return await axiosPrivate.patch(`/ads/ads/${adId}`, formData);
    },
    onSuccess: (res) => {
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: (err) => {
      console.log(err);
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
  const { mutateAsync: deleteImage } = useMutation({
    mutationFn: async (imgId) => {
      return await axiosPrivate.delete(`/ads/ads_image/${imgId}`);
    },
  });

  const handleSubCategoryClick = (idx) => {
    const dymFields =
      subcategories?.find((c) => Number(c.id) === Number(idx))?.dynamic_field ||
      [];
    setDynamicFields([...dymFields?.map((df) => ({ ...df, value: "" }))]);
  };

  const handleChange = (e) => {
    if (e.target.id === "country")
      return setData((prev) => ({
        ...prev,
        state: "",
        district: "",
        country: e.target.value,
      }));
    if (e.target.id === "state")
      return setData((prev) => ({
        ...prev,
        district: "",
        state: e.target.value,
      }));
    if (e.target.id === "sub_category") handleSubCategoryClick(e.target.value);
    setData((prev) => ({
      ...prev,
      sub_category: e.target.id === "category" ? "" : prev.sub_category,
      [e.target.id]: e.target.value,
    }));
  };

  const handlePostDFChange = (e, idx) => {
    let dynamicFieldsClone = dynamicFields;
    dynamicFieldsClone[idx] = {
      ...dynamicFieldsClone[idx],
      value: e.target.value,
    };
    setDynamicFields([...dynamicFieldsClone]);
  };

  const handleDeleteImage = (idx) => {
    const imageToDelete = images.find((e, i) => i === idx);
    if (imageToDelete?.id) {
      setImagesToDelete((prev) => [...prev, imageToDelete]);
    }
    setImages((prev) => [...prev.filter((_, i) => i !== idx)]);
  };

  const handleFileChange = (e) => {
    const files = e.target?.files || [];
    if (files.length === 0) return;
    if (files.length + images.length > 12) return;
    const newImgs = [];
    for (let file of files) {
      if (file.type.split("/")[0] !== "image") continue;
      newImgs.push({
        name: file.name,
        image: URL.createObjectURL(file),
        image_file: file,
      });
    }
    setImages((prev) => [...prev, ...newImgs]);
  };

  const handleSubmit = () => {
    const obj = {
      ad_title: isValid("Ad title", data.ad_title),
      ad_description: isValid("Ad description", data.ad_description),
      price: isValid("Price", data.price),
      category: isValid("Category", data.category?.toString()),
      sub_category: isValid("Sub Category", data.sub_category?.toString()),
      district: isValid("City", data.district),
      state: isValid("State", data.state),
      country: isValid("Country", data.country),
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
      dynamic_field: dynamicFields.map((df) => ({
        field_name: df?.field_name,
        field_type: df?.field_type,
        value: df?.value,
      })),
    };
    mutate(formData);
  };

  const handleSubmitImages = (ads_id) => {
    if (images.filter((e) => !e?.id).length === 0) {
      toast.success("Ad Post updated!");
      return navigate(`/ads/view/${ads_id}`);
    }
    Promise.all([
      ...images
        .filter((e) => !e?.id)
        .map((img) => {
          const formData = new FormData();
          formData.append("image", img?.image_file);
          formData.append("ads", ads_id);
          return uploadImage(formData);
        }),
      ...imagesToDelete.map((img) => deleteImage(img?.id)),
    ]).finally(() => {
      toast.success("Ad Post updated!");
      navigate(`/ads/view/${ads_id}`);
    });
  };

  return (
    <div id='post-new-ad'>
      <div className='pya-main'>
        <div className='h3 fw-bold'>Edit Ad</div>
        <div className='row'>
          <div className='col-md-6'>
            <div>
              <label className='form-label m-0' htmlFor='category'>
                Category :
              </label>
              <select
                type='text'
                className={`form-control form-control-sm${
                  errors?.category ? " is-invalid" : ""
                }`}
                id='category'
                value={data.category}
                onChange={handleChange}>
                <option value=''>--select--</option>
                {categories?.map((category) => (
                  <option value={category.id} key={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.category && errors?.category}
              </div>
            </div>
            <div>
              <label className='form-label m-0' htmlFor='sub_category'>
                Sub Category :
              </label>
              <select
                type='text'
                className={`form-control form-control-sm${
                  errors?.sub_category ? " is-invalid" : ""
                }`}
                id='sub_category'
                value={data.sub_category}
                onChange={handleChange}>
                <option value=''>--select--</option>
                {subcategories
                  ?.filter((e) => Number(e.category) === Number(data.category))
                  ?.map((subcategory) => (
                    <option value={subcategory.id} key={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.sub_category && errors?.sub_category}
              </div>
            </div>
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
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
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
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
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
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.price && errors?.price}
              </div>
            </div>
            <div>
              <label className='form-label m-0' htmlFor='country'>
                Country :
              </label>
              <select
                className={`form-control form-control-sm${
                  errors?.price ? " is-invalid" : ""
                }`}
                id='country'
                value={data.country}
                onChange={handleChange}>
                <option value=''>Select Country</option>
                {countries?.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.name}
                  </option>
                ))}
              </select>
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.country && errors?.country}
              </div>
            </div>
            <div>
              <label className='form-label m-0' htmlFor='state'>
                State :
              </label>
              <select
                className={`form-control form-control-sm${
                  errors?.state ? " is-invalid" : ""
                }`}
                id='state'
                value={data.state}
                onChange={handleChange}>
                <option value=''>Select State</option>
                {states
                  ?.filter((e) => Number(e.country) === Number(data.country))
                  ?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.state && errors?.state}
              </div>
            </div>
            <div>
              <label className='form-label m-0' htmlFor='district'>
                District :
              </label>
              <select
                className={`form-control form-control-sm${
                  errors?.district ? " is-invalid" : ""
                }`}
                id='district'
                value={data.district}
                onChange={handleChange}>
                <option value=''>Select City</option>
                {cities
                  ?.filter((e) => Number(e.state) === Number(data.state))
                  ?.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.name}
                    </option>
                  ))}
              </select>
              <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                {errors?.district && errors?.district}
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
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors[df?.field_name] && errors[df?.field_name]}
                </div>
              </div>
            ))}
          </div>
          <div className='col-md-6'>
            <div>
              <label className='form-label m-0'>Upload upto 12 images :</label>
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
                        <img
                          src={
                            images[i].image[0] === "/"
                              ? URI + "/" + images[i].image
                              : images[i].image
                          }
                          alt=''
                        />
                        <span onClick={() => handleDeleteImage(i)}>
                          &times;
                        </span>
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
          {/* <button
            className='btn btn-back text-white me-2'
            onClick={() => {
              setStage(1);
              setErrors({});
              window.scrollTo(0, 0);
            }}
            disabled={isLoading}>
            Back
          </button> */}
          <button
            className='btn btn-submit text-white'
            onClick={handleSubmit}
            disabled={isLoading || isUploadingImage}>
            {isLoading || isUploadingImage ? "Updating" : "Update Ad"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAd;
