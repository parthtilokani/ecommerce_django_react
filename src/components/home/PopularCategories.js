import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../../utils/axios.js";
import { Link } from "react-router-dom";

const PopularCategories = () => {
  const [fetchedQueries, setFetchedQueries] = useState(false);
  const { data: categories } = useQuery({
    queryKey: ["popular_categories"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/ads/popular_category", {
        params: {
          page: 1,
          page_size: 8,
        },
      });
      setFetchedQueries((prev) => true);
      return data?.popular_category &&
        typeof data?.popular_category === "object"
        ? [...data?.popular_category]
        : [];
    },
    enabled: !fetchedQueries,
    initialData: [],
  });

  return (
    <div id='home-pp-categories'>
      <div className='text-center py-4 mx-1'>
        <div className='h2 fw-bold'>Popular Categories</div>
      </div>
      <div className='categories-main row mx-auto'>
        {categories?.length > 0 &&
          categories?.map((category, i) => (
            <div key={i} className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3'>
              <Link
                to='/search'
                state={{
                  category: category?.category,
                  subcategory: {},
                  search: "",
                }}>
                <div className='c-card d-flex flex-column justify-content-center align-items-center'>
                  <div className='img-wrapper'>
                    <img
                      src={category?.category?.icon}
                      alt=''
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/assets/svgs/subcategory.svg";
                      }}
                    />
                  </div>
                  <div className='h5'>{category?.category?.name}</div>
                  <div className='h6'>{category?.count} Ads</div>
                </div>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PopularCategories;
