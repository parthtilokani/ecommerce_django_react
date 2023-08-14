import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// css
import "../styles/css/search.css";

import { Link, useLocation } from "react-router-dom";
import AdCardSkeleton from "../components/skeletons/AdCardSkeleton.js";
import useOurLocation from "../hooks/useOurLocation.js";

import LocationModel from "../components/home/LocationModel.js";
import CategoryModel from "../components/home/CategoryModel.js";
import SubCategoryModel from "../components/home/SubCategoryModel.js";
import { handleLocationSearch } from "../utils/commonRequests.js";
import { axiosOpen } from "../utils/axios.js";
import NoAdsCard from "../components/profile/NoAdsCard.js";

const Search = () => {
  const { category, subcategory, search: searchText } = useLocation().state;

  const [locationView, setLocationView] = useState(false);
  const [categoryView, setCategoryView] = useState(false);
  const [subCategoryView, setSubCategoryView] = useState(false);
  const [search, setSearch] = useState(searchText);

  const [searchLocation, setSearchLocation] = useState("");
  const [addressList, setAddressList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedSubCategory, setSelectedSubCategory] = useState(subcategory);

  const { location: ourLocation, setLocation } = useOurLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
  const [totalData, setTotalData] = useState(0);

  const [fetchedQueries, setFetchedQueries] = useState([false, false, false]);
  const {
    data: myAds,
    refetch,
    isLoading: isLoadingAds,
  } = useQuery({
    queryKey: ["search"],
    queryFn: async () => {
      const paramsObj = {
        page: currentPage,
        page_size: itemPerPage,
        lat: ourLocation?.lat,
        long: ourLocation?.lng,
      };

      if (search) paramsObj.search = search;
      if (selectedCategory?.id) paramsObj.category = selectedCategory?.id;
      if (selectedSubCategory?.id)
        paramsObj.subcategory = selectedSubCategory?.id;

      const { data } = await axiosOpen.get("/ads/ads", {
        params: paramsObj,
      });
      setTotalData(data?.count || 0);
      setFetchedQueries((prev) => {
        prev[0] = true;
        return [...prev];
      });
      return data?.results || [];
    },
    enabled: !fetchedQueries[0],
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/category");
      setFetchedQueries((prev) => {
        prev[1] = true;
        return [...prev];
      });
      return typeof data === "object" ? [...data] : [];
    },
    enabled: !fetchedQueries[1],
    initialData: [],
  });
  const { data: subcategories } = useQuery({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/subcategory");
      setFetchedQueries((prev) => {
        prev[2] = true;
        return [...prev];
      });
      return typeof data === "object" ? [...data] : [];
    },
    enabled: !fetchedQueries[2],
    initialData: [],
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      handleLocationSearch({
        searchLocation,
        setAddressList,
        setLoading,
        setError,
      });
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchLocation]);

  return (
    <div>
      <div id='search-hero'>
        <div className='overlay'>
          <div
            id='search-bar'
            className='position-absolute top-100 start-50 translate-middle'>
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
                <div
                  className='input-wrapper search-btn justify-content-center'
                  onClick={refetch}>
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

      <div id='search-results'>
        <div className='featured-ads-main row mx-auto'>
          {isLoadingAds ? (
            new Array(4).fill(null).map((_, i) => (
              <div key={i} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3'>
                <AdCardSkeleton />
              </div>
            ))
          ) : myAds?.length > 0 ? (
            myAds?.map((ad, i) => (
              <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3' key={i}>
                <Link to={`/ads/view/${ad?.id}`}>
                  <div className='fa-card'>
                    <div className='fa-img-main position-relative'>
                      <img
                        src={
                          ad?.ads_image?.length > 0 &&
                          ad?.ads_image[0] &&
                          ad?.ads_image[0]?.image
                            ? ad?.ads_image[0].image
                            : "https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/themes/classima/assets/img/noimage-listing-thumb.jpg"
                        }
                        alt=''
                      />
                      <div className='fa-img-overlay'></div>
                    </div>
                    <div className='fa-card-body'>
                      <div>
                        <div className='h6 fw-bold'>{ad?.ad_title}</div>
                        <div className='d-flex align-items-center'>
                          <img src='/assets/svgs/time.svg' alt='' />
                          <span>
                            {ad?.posted_on &&
                              new Date(ad?.posted_on).toLocaleString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "numeric",
                                hour12: true,
                              })}
                          </span>
                        </div>
                        <div className='d-flex align-items-center'>
                          <img src='/assets/svgs/profile.svg' alt='' />
                          <span>{ad?.create_user?.name || "Ananomous"}</span>
                        </div>
                        <div className='d-flex align-items-center'>
                          <img src='/assets/svgs/location.svg' alt='' />
                          <span>{ad?.district_name || "No Location"}</span>
                        </div>
                        <div className='h4 fw-bold'>₹ {ad?.price}</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <NoAdsCard />
          )}
        </div>

        <div className='row mt-20 m-1'>
          <div className='col-sm-12 col-md-6 mb-20'>
            <div
              className='dataTables_info'
              id='datatable_info'
              role='status'
              aria-live='polite'>
              Showing {currentPage * itemPerPage - itemPerPage + 1} to{" "}
              {Math.min(currentPage * itemPerPage, totalData)} of {totalData}{" "}
              entries
            </div>
          </div>

          <div className='col-sm-12 col-md-6'>
            <div className='d-flex'>
              <ul className='pagination ms-auto'>
                <li
                  className={
                    currentPage === 1
                      ? "paginate_button page-item previous disabled"
                      : "paginate_button page-item previous"
                  }>
                  <span
                    className='page-link text-dark'
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentPage((prev) => prev - 1)}>
                    Previous
                  </span>
                </li>

                {!(currentPage - 1 < 1) && (
                  <li className='paginate_button page-item'>
                    <span
                      className='page-link text-dark'
                      style={{ cursor: "pointer" }}
                      onClick={(e) => setCurrentPage((prev) => prev - 1)}>
                      {currentPage - 1}
                    </span>
                  </li>
                )}

                <li className='paginate_button page-item active'>
                  <span
                    className='page-link bg-secondary'
                    style={{ cursor: "pointer" }}>
                    {currentPage}
                  </span>
                </li>

                {!(
                  (currentPage + 1) * itemPerPage - itemPerPage >
                  totalData - 1
                ) && (
                  <li className='paginate_button page-item '>
                    <span
                      className='page-link text-dark'
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setCurrentPage((prev) => prev + 1);
                      }}>
                      {currentPage + 1}
                    </span>
                  </li>
                )}

                <li
                  className={
                    !(
                      (currentPage + 1) * itemPerPage - itemPerPage >
                      totalData - 1
                    )
                      ? "paginate_button page-item next"
                      : "paginate_button page-item next disabled"
                  }>
                  <span
                    className='page-link text-dark'
                    style={{ cursor: "pointer" }}
                    onClick={() => setCurrentPage((prev) => prev + 1)}>
                    Next
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
