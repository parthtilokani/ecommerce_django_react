import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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

const EditAd = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id: adId } = useParams();
  const [data, setData] = useState({
    ad_title: "",
    ad_description: "",
    category: "",
    sub_category: "",
    enabled: true,
  });
  const [errors, setErrors] = useState({});
  const [dynamicFields, setDynamicFields] = useState([]);
  const [noOfImages, setNoOfImages] = useState(12);
  const [images, setImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const imageRef = useRef();

  const [ourLocation, setLocation] = useState({});
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
    staleTime: Infinity,
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
    staleTime: Infinity,
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
        enabled: false,
      });

      setLocation((prev) => ({
        name: data?.location,
        lat: data?.latitude,
        lng: data?.longitude,
      }));

      //if sub category and dynamic_fields are present
      if (subcategories?.length > 0 && data?.dynamic_field?.length > 0) {
        const subcategory = subcategories?.find(
          (c) => Number(c.id) === Number(data?.sub_category)
        );
        setNoOfImages(subcategory?.no_of_images || 12);
        const dymFields = subcategory?.dynamic_field || [];
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
      setImages([...(data?.ads_image || [])]);

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

  const handleSubCategoryClick = (idx) => {
    const subcategory = subcategories?.find((c) => c.id === idx);
    setNoOfImages(subcategory?.no_of_images || 12);
    const dymFields = subcategory?.dynamic_field || [];
    setDynamicFields([...dymFields?.map((df) => ({ ...df, value: "" }))]);
  };

  const handleChange = (e) => {
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
    const newImgs = [];
    for (let file of files) {
      if (images.length + newImgs.length === noOfImages) break;
      if (file.type.split("/")[0] !== "image") continue;
      if (file.size > 1000 * 1000 * 4) {
        setErrors((prev) => ({
          ...prev,
          images: "Few images uploaded had file size greater than 4mb.",
        }));
        continue;
      }
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
      category: isValid("Category", data.category?.toString()),
      sub_category: isValid("Sub Category", data.sub_category?.toString()),
      location: isValid("Location", ourLocation?.name || ""),
    };
    if (!obj.ad_description && data?.ad_description.length < 25)
      obj.ad_description = "Ad description should be atleast 25 characters.";
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
      dynamic_field: dynamicFields.map((df) => ({
        field_name: df?.field_name,
        field_type: df?.field_type,
        value:
          df?.value &&
          (df?.field_type === "Price" || df?.field_type === "Number")
            ? Number(df?.value)
            : df?.value,
      })),
      location: ourLocation?.name,
      latitude: ourLocation?.lat,
      longitude: ourLocation?.lng,
      place_id: ourLocation?.place_id,
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
        .map(async (img) => {
          const formData = new FormData();
          formData.append("image", img?.image_file);
          formData.append("ads", ads_id);
          return await uploadImage(formData);
        }),
      ...imagesToDelete.map(async (img) => await deleteImage(img?.id)),
    ]).finally(() => {
      toast.success("Ad Post updated!");
      navigate(`/ads/view/${ads_id}`);
    });
  };

  return (
    <>
      <div id="post-new-ad">
        <div className="pya-main">
          <div className="h3 fw-bold">Edit Ad</div>
          <div className="row">
            <div className="col-md-6">
              <div>
                <label className="form-label m-0" htmlFor="category">
                  Category<span className="text-danger">*</span> :
                </label>
                <select
                  type="text"
                  className={`form-control form-control-sm${
                    errors?.category ? " is-invalid" : ""
                  }`}
                  id="category"
                  value={data.category}
                  onChange={handleChange}
                >
                  <option value="">--select--</option>
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
                <label className="form-label m-0" htmlFor="sub_category">
                  Sub Category<span className="text-danger">*</span> :
                </label>
                <select
                  type="text"
                  className={`form-control form-control-sm${
                    errors?.sub_category ? " is-invalid" : ""
                  }`}
                  id="sub_category"
                  value={data.sub_category}
                  onChange={handleChange}
                >
                  <option value="">--select--</option>
                  {subcategories
                    ?.filter(
                      (e) => Number(e.category) === Number(data.category)
                    )
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
                <label className="form-label m-0" htmlFor="ad_title">
                  Ad title<span className="text-danger">*</span> :
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm${
                    errors?.ad_title ? " is-invalid" : ""
                  }`}
                  id="ad_title"
                  value={data.ad_title}
                  onChange={handleChange}
                  maxLength="150"
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.ad_title && errors?.ad_title}
                </div>
              </div>
              <div>
                <label className="form-label m-0" htmlFor="ad_description">
                  Ad description<span className="text-danger">*</span> :
                </label>
                <textarea
                  className={`form-control form-control-sm${
                    errors?.ad_description ? " is-invalid" : ""
                  }`}
                  id="ad_description"
                  value={data.ad_description}
                  onChange={handleChange}
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.ad_description && errors?.ad_description}
                </div>
              </div>
              <div>
                <label className="form-label m-0" htmlFor="location">
                  Location<span className="text-danger">*</span> :
                </label>
                <input
                  type="text"
                  className={`form-control form-control-sm${
                    errors?.location ? " is-invalid" : ""
                  }`}
                  id="location"
                  value={ourLocation?.name}
                  onChange={() => {}}
                  onClick={() => setLocationView(true)}
                />
                <div style={{ fontSize: "10px", color: "red", minHeight: 10 }}>
                  {errors?.location && errors?.location}
                </div>
              </div>
              {dynamicFields?.map((df, i) => (
                <div className="mt-2" key={i}>
                  <label className="form-label m-0" htmlFor={df?.field_name}>
                    {df?.field_name}
                    {df?.is_required ? (
                      <span className="text-danger">*</span>
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
                    style={{ fontSize: "10px", color: "red", minHeight: 10 }}
                  >
                    {errors[df?.field_name] && errors[df?.field_name]}
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-6">
              <div>
                <label className="form-label m-0">
                  Upload upto 12 images :
                </label>
                <div style={{ color: "grey", fontSize: 12 }}>
                  (Upload images with size less than 4mb.)
                </div>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  ref={imageRef}
                  multiple={true}
                  onChange={handleFileChange}
                />
                <div className="mt-1 img-input">
                  {new Array(noOfImages).fill(null).map((_, i) => (
                    <div key={i} className="img-input-col">
                      {images[i] ? (
                        <div className="img-wrapper">
                          <img src={images[i].image} alt="" />
                          <span onClick={() => handleDeleteImage(i)}>
                            &times;
                          </span>
                        </div>
                      ) : (
                        <div
                          onClick={() => imageRef.current.click()}
                          className="img-placeholder"
                        >
                          <img src="/assets/svgs/img-ph.svg" alt="" />
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
                  }}
                >
                  {errors?.images && errors?.images}
                </div>
              </div>
            </div>
          </div>
          <div className="text-end">
            <button
              className="btn btn-submit text-white"
              onClick={handleSubmit}
              disabled={isLoading || isUploadingImage}
            >
              {isLoading || isUploadingImage ? "Updating" : "Update Ad"}
            </button>
          </div>
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

export default EditAd;
