import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../utils/axios.js";
import useOurLocation from "../hooks/useOurLocation.js";

// css
import "../styles/css/home.css";
import { URI } from "../utils/API.js";

const Home = () => {
  const { location: ourLocation, setLocation } = useOurLocation();
  const navigate = useNavigate();

  const [locationView, setLocationView] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [subCategoryView, setSubCategoryView] = useState(false);

  const locationQuery = useRef();
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedSubCategory, setSelectedSubCategory] = useState();

  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
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
    initialData: [],
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
    initialData: [],
  });

  useEffect(() => {
    (() => {
      if (!ourLocation) handleGetLocation();
    })();
  }, []);

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

          const apiKey = "AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70";
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&location_type=APPROXIMATE&key=${apiKey}`;

          const res = await fetch(url, { method: "GET" });

          const data = await res.json();
          if (data.status === "OK") {
            setLocation(data.results[0].formatted_address);
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

  const handleLocationSearch = async () => {
    try {
      if (locationQuery.current.value.trim() === "") return;
      setLoading(true);

      const apiKey = "AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70";
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${locationQuery.current.value}&key=${apiKey}`;

      const res = await fetch(url, { method: "GET" });

      const data = await res.json();
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
  };

  return (
    <div className='position-relative'>
      {/*HERO*/}
      <div id='home-hero'>
        <div className='overlay'>
          <div id='home-search'>
            <div className='row justify-content-center'>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setLocationView(true)}>
                  <div>
                    <img src='/assets/svgs/location.svg' alt='location' />
                  </div>
                  <div
                    className='p-hldr'
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
                    {ourLocation ? ourLocation : "Location"}
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setCategoryView(true)}>
                  <div>
                    <img src='/assets/svgs/category.svg' alt='category' />
                  </div>
                  <div className='p-hldr'>
                    {selectedCategory?.name
                      ? selectedCategory?.name
                      : "Category"}
                  </div>
                </div>
              </div>
              <div className='col-lg-6 col-xl-2 cols'>
                <div
                  className='input-wrapper'
                  onClick={() => setSubCategoryView(true)}>
                  <div>
                    <img
                      src='/assets/svgs/subcategory.svg'
                      alt='sub-category'
                    />
                  </div>
                  <div className='p-hldr'>
                    {selectedSubCategory?.name
                      ? selectedSubCategory?.name
                      : "Sub-Category"}
                  </div>
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
              <div
                className='col-lg-12 col-xl-2 cols'
                onClick={() => navigate("/search")}>
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
      {/*Models*/}
      <div
        className='location-model'
        style={locationView ? {} : { display: "none" }}>
        <div className='card'>
          <div className='h5 p-1 text-center mt-3'>Select Location</div>
          {error && <div className='text-center text-danger'>{error}</div>}
          {ourLocation && (
            <div className='fw-bold px-4'>
              Selected Location : <span>{ourLocation}</span>
            </div>
          )}
          {loading && <div className='text-center fw-bold'>Loading...</div>}
          <div className='row mx-3 my-1'>
            <div className='col-10 p-0 pe-1'>
              <input
                className='form-control form-control-sm'
                placeholder='Search Location'
                ref={locationQuery}
                id='location-search'
              />
            </div>
            <div className='col-2 p-0'>
              <div
                style={{
                  margin: "auto",
                  backgroundColor: "#43c6ac",
                  width: "100%",
                  height: 30,
                  textAlign: "center",
                  borderRadius: 5,
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (loading) return;
                  handleLocationSearch();
                }}>
                <img
                  src='/assets/svgs/search.svg'
                  alt='search'
                  style={{ height: 25 }}
                />
              </div>
            </div>
          </div>
          {addressList.length > 0 ? (
            <div
              className='px-3'
              style={{ maxHeight: 200, overflowY: "scroll" }}>
              <ul
                style={{
                  listStyle: "none",
                }}>
                <hr className='m-1' />
                {addressList.map((address, index) => (
                  <li
                    key={index}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setLocation(address.formatted_address);
                      setLocationView(false);
                      locationQuery.current.value = "";
                    }}>
                    <p
                      style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                      className='mx-2'>
                      {address.formatted_address}
                    </p>
                    <hr className='m-1' />
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className='text-center'>No location found!</div>
          )}
          <img
            src='./assets/svgs/close.svg'
            className='close-btn'
            alt=''
            onClick={() => {
              setLocationView(false);
              setError("");
            }}
          />
        </div>
      </div>
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
              {subcategories?.length > 0 &&
                subcategories
                  ?.filter((subc) =>
                    selectedCategory?.id
                      ? subc?.category === selectedCategory?.id
                      : true
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

      {/*POPULAR Categories*/}
      <div id='home-pp-categories'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Popular Categories</div>
        </div>
        <div className='categories-main row mx-auto'>
          {categories?.length > 0 &&
            categories?.slice(0, 8)?.map((category, i) => (
              <div key={i} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3'>
                <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                  <div className='img-wrapper'>
                    <img
                      // src={category?.icon || "/assets/svgs/subcategory.svg"}
                      src={
                        URI +
                        "/ads_category_icon" +
                        category?.icon?.split("ads_category_icon")[1]
                      }
                      alt=''
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/svgs/subcategory.svg";
                      }}
                    />
                  </div>
                  <div className='h5'>{category?.name}</div>
                  <div className='h6'>17 Ads</div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/*Featured Ads*/}
      <div id='home-featured-ads'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Featured Ads</div>
        </div>
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

      {/*Our Top Locations*/}
      <div id='home-top-locations'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Our Top Locations</div>
        </div>
        <div className='top-locations-main row mx-auto'>
          {new Array(4).fill(null).map((_, i) => (
            <div className='col-lg-6 p-3' key={i}>
              <div className='tl-card position-relative'>
                <img
                  src='https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/uploads/2019/09/New-Jersey.jpg'
                  alt=''
                />
                <div className='caption-overlay'>
                  <div className='cap-location d-flex justify-content-center align-items-center'>
                    <div className='h5'>Amsterdam</div>
                  </div>
                  <div className='h6'>17 Ads</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Info Panel*/}
      <div id='home-info-panel'>
        <div className='info-panel-main'>
          <div className='info-overlay'>
            <div className='row mx-auto'>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/ads.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>5000+</div>
                      <p className='h5 text-white'>Published Ads</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/users.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>3242+</div>
                      <p className='h5 text-white'>Registered Users</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className='col-md-4 d-flex justify-content-center align-items-center'>
                <div className='info-panel-card'>
                  <div className='d-flex flex-fill'>
                    <div className='ip-img-div'>
                      <img src='/assets/svgs/verified.svg' alt='' />
                    </div>
                    <div className='mt-4'>
                      <div className='h2 fw-bold text-white'>2000+</div>
                      <p className='h5 text-white'>Verified Users</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*Our Pricing and Packages*/}
      <div id='home-our-pricing'>
        <div className='text-center py-4 mx-1'>
          <div className='h2 fw-bold'>Our Pricing and Packages</div>
        </div>
        <div className='row mx-auto our-pricing-main'>
          {new Array(4).fill(null).map((_, i) => (
            <div className='col-xl-3 col-lg-4 col-md-6' key={i}>
              <div className='our-pricing-card mx-auto'>
                <div className='h4'>Free</div>
                <div className='h1 pricing'>
                  ₹ 0<span>/Per month</span>
                </div>
                <div className='op-features'>3 Regular Ads</div>
                <div className='op-features'>No Featured Ads</div>
                <div className='op-features'>No Top Ads</div>
                <div className='op-features'>No Ads will be bumped up</div>
                <div className='op-features'>Limited Support</div>
                <div>
                  <button>Register</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
