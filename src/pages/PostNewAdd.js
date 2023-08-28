import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import LocationModel from "../components/home/LocationModel.js";

import { axiosOpen } from "../utils/axios.js";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { getSystemDynamicField } from "../utils/DynamicFields.js";
import { isValid } from "../utils/support.js";

//css
import "../styles/css/postnewad.css";
import {
  handleGetCurrentLocation,
  handleLocationSearch,
} from "../utils/commonRequests.js";
import useOurLocation from "../hooks/useOurLocation.js";

const PostNewAdd = () => {
  const { location } = useOurLocation();

  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const subCategoryRef = useRef();
  const [stage, setStage] = useState(1);
  const [data, setData] = useState({
    ad_title: "",
    ad_description: "",
  });
  const [errors, setErrors] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [dynamicFields, setDynamicFields] = useState([]);
  const [noOfImages, setNoOfImages] = useState(12);
  const [images, setImages] = useState([]);
  const imageRef = useRef();

  const [ourLocation, setLocation] = useState(location);
  const [locationView, setLocationView] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [fetchedQueries, setFetchedQueries] = useState([
    false,
    false,
    false,
    false,
    false,
  ]);
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
    mutationFn: async (formData) =>
      await axiosPrivate.post(`/ads/ads`, formData),
    onSuccess: (res) => {
      if (res?.data?.id) handleSubmitImages(res?.data?.id);
    },
    onError: (err) => {
      console.log(err);
      toast.error(err?.response?.data?.detail || "Something went wrong! Retry");
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

  const handleGetLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          setLoading(true);
          const data = await handleGetCurrentLocation({
            latitude,
            longitude,
          });
          if (data.status === "OK") {
            setLocation((prev) => ({
              ...prev,
              name: data?.results[0].formatted_address,
              place_id: data?.results[0].place_id,
              ...data?.results[0]?.geometry?.location,
            }));
            setAddressList(data.results);
          } else {
            setError("Unable to fetch location data");
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          setError("Unable to retrieve your location");
          setLoading(false);
        }
      },
      () => {
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    );
  };

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        if (searchLocation.trim() === "") return setAddressList([]);
        const data = await handleLocationSearch(searchLocation);
        if (data.status === "OK") {
          setError("");
          setAddressList([...data.results]);
        } else if (data.status === "ZERO_RESULTS") {
          setError("");
          setAddressList([]);
        } else {
          setAddressList([]);
          setError("Unable to fetch location data");
        }
        setLoading(false);
      } catch (error) {
        setAddressList([]);
        console.log(error);
        setError("Unable to retrieve your location");
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchLocation]);

  const handleCategoryClick = (idx) => {
    setSelectedCategory(idx);
    setSelectedSubCategory("");
    setNoOfImages(12);
    if (window.innerWidth > 756) return;
    window.scrollTo(0, subCategoryRef.current.offsetTop - 50);
  };

  const handleSubCategoryClick = (idx) => {
    setSelectedSubCategory(idx);
    const subcategory = subcategories?.find((c) => c.id === idx);
    setNoOfImages(subcategory?.no_of_images || 12);
    const dymFields = subcategory?.dynamic_field || [];
    setDynamicFields([...dymFields?.map((df) => ({ ...df, value: "" }))]);
    setStage(2);
    window.scrollTo(0, 0);
  };

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

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
    if (files.length + images.length > noOfImages) return;
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
      location: isValid("Location", ourLocation?.name || ""),
    };
    if (!obj.ad_description && data?.ad_description.length < 150)
      obj.ad_description = "Ad description should be atleast 150 characters.";
    dynamicFields.forEach((df) =>
      df?.is_required
        ? (obj[df?.field_name] = isValid(df?.field_name, df?.value))
        : null
    );
    if (images.length === 0) obj.images = "Atleast upload one image!";
    if (Object.values(obj).filter((e) => e !== "").length > 0)
      return setErrors(obj);

    setErrors({});
    const formData = {
      ...data,
      category: selectedCategory,
      sub_category: selectedSubCategory,
      dynamic_field: dynamicFields
        .filter((df) => df?.value?.trim() !== "")
        .map((df) => ({
          field_name: df?.field_name,
          field_type: df?.field_type,
          value: df?.value,
        })),
      location: ourLocation?.name,
      latitude: ourLocation?.lat,
      longitude: ourLocation?.lng,
      place_id: ourLocation?.place_id,
    };

    mutate(formData);
  };

  const handleSubmitImages = (ads_id) => {
    Promise.all(
      images.map((img) => {
        const formData = new FormData();
        formData.append("image", img?.image);
        formData.append("ads", ads_id);
        return uploadImage(formData);
      })
    ).finally(() => {
      toast.success("Your Ad was posted!");
      navigate(`/ads/view/${ads_id}`);
    });
  };

  return (
    <>
      <div id='post-new-ad'>
        <div className='text-center h3 fw-bold'>POST YOUR AD</div>
        <div className='pya-main'>
          {stage === 1 ? (
            <>
              <div className='row'>
                <div className='col-md-6'>
                  <div className='h5 fw-bold'>
                    Choose category<span className='text-danger'>*</span> :
                  </div>
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
                  <div className='h5 fw-bold'>
                    Choose subcategory<span className='text-danger'>*</span> :
                  </div>
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
                      Ad title<span className='text-danger'>*</span> :
                    </label>
                    <input
                      type='text'
                      className={`form-control form-control-sm${
                        errors?.ad_title ? " is-invalid" : ""
                      }`}
                      id='ad_title'
                      value={data.ad_title}
                      onChange={handleChange}
                      maxLength='150'
                    />
                    <div
                      style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                      {errors?.ad_title && errors?.ad_title}
                    </div>
                  </div>
                  <div>
                    <label className='form-label m-0' htmlFor='ad_description'>
                      Ad description<span className='text-danger'>*</span> :
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
                    <label className='form-label m-0' htmlFor='location'>
                      Location<span className='text-danger'>*</span> :
                    </label>
                    <input
                      type='text'
                      className={`form-control form-control-sm${
                        errors?.location ? " is-invalid" : ""
                      }`}
                      id='location'
                      value={ourLocation?.name}
                      onChange={() => {}}
                      onClick={() => setLocationView(true)}
                    />
                    <div
                      style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                      {errors?.location && errors?.location}
                    </div>
                  </div>
                  {dynamicFields?.map((df, i) => (
                    <div className='mt-2' key={i}>
                      <label
                        className='form-label m-0'
                        htmlFor={df?.field_name}>
                        {df?.field_name}
                        {df?.is_required ? (
                          <span className='text-danger'>*</span>
                        ) : (
                          <span style={{ color: "grey", fontSize: 12 }}>
                            <sup>(optional)</sup>
                          </span>
                        )}{" "}
                        :
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
                        style={{
                          fontSize: "10px",
                          color: "red",
                          minHeight: 10,
                        }}>
                        {errors[df?.field_name] && errors[df?.field_name]}
                      </div>
                    </div>
                  ))}
                </div>
                <div className='col-md-6'>
                  <div>
                    <label className='form-label m-0'>
                      Upload upto {noOfImages} images :
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
                      {new Array(noOfImages).fill(null).map((_, i) => (
                        <div key={i} className='img-input-col'>
                          {images[i] ? (
                            <div className='img-wrapper'>
                              <img src={images[i].src} alt='' />
                              <span onClick={() => deleteImage(i)}>
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
      <LocationModel
        {...{
          locationView,
          error,
          ourLocation,
          loading,
          searchLocation,
          setSearchLocation,
          handleLocationSearch,
          setLocation,
          setLocationView,
          addressList,
          setError,
          handleGetLocation,
        }}
      />
    </>
  );
};

export default PostNewAdd;
