import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../utils/axios.js";
import useOurLocation from "../hooks/useOurLocation.js";

import PackageAndPricing from "../components/home/PackageAndPricing.js";
import PopularCategories from "../components/home/PopularCategories.js";
import InfoPanel from "../components/home/InfoPanel.js";

// css
import "../styles/css/home.css";
import MostRecentAds from "../components/home/MostRecentAds.js";
import LocationModel from "../components/home/LocationModel.js";
import CategoryModel from "../components/home/CategoryModel.js";
import SubCategoryModel from "../components/home/SubCategoryModel.js";
import {
  handleLocationSearch,
  handleGetCurrentLocation,
} from "../utils/commonRequests.js";

const Home = () => {
  const { location: ourLocation, setLocation } = useOurLocation();
  const location = useLocation();

  const [locationView, setLocationView] = useState(true);
  const [categoryView, setCategoryView] = useState(false);
  const [subCategoryView, setSubCategoryView] = useState(false);
  const [search, setSearch] = useState("");

  const [searchLocation, setSearchLocation] = useState("");
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
      if (!ourLocation?.name) handleGetLocation();
      else setLocationView(false);
    })();
  }, []);

  useEffect(() => {
    (() => {
      if (location.hash === "#our-pricing-and-packages") {
        document.getElementById("our-pricing-and-packages").scrollIntoView();
      }
    })();
  }, [location]);

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
          setError("");
          const data = await handleGetCurrentLocation({ latitude, longitude });
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
                  <div className='p-hldr' style={{ overflow: "hidden" }}>
                    {ourLocation?.name ? ourLocation?.name : "Location"}
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
                  <input
                    placeholder='Search Keywords'
                    id='search'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className='col-lg-12 col-xl-2 cols'>
                <Link
                  to={ourLocation?.name ? "/search" : ""}
                  onClick={() => {
                    if (!ourLocation?.name) setLocationView(true);
                  }}
                  state={{
                    category: selectedCategory,
                    subcategory: selectedSubCategory,
                    search: search,
                  }}>
                  <div className='input-wrapper search-btn justify-content-center'>
                    <div>
                      <img src='/assets/svgs/search.svg' alt='search' />
                    </div>
                    <div className='p-hldr'>Search</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Models*/}
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
      <CategoryModel
        {...{
          categoryView,
          categories,
          setCategoryView,
          selectedCategory,
          setSelectedCategory,
          setSelectedSubCategory,
        }}
      />
      <SubCategoryModel
        {...{
          subCategoryView,
          subcategories,
          selectedCategory,
          selectedSubCategory,
          setSelectedSubCategory,
          setSubCategoryView,
        }}
      />

      {/*POPULAR Categories*/}
      <PopularCategories />

      {/*Featured Ads*/}
      <MostRecentAds />

      {/*Our Top Locations*/}
      {/* <div id='home-top-locations'>
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
      </div> */}

      {/*Info Panel*/}
      <InfoPanel />

      {/*Our Pricing and Packages*/}
      <PackageAndPricing />
    </div>
  );
};

export default Home;
