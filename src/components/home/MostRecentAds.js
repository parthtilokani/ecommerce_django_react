import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../../utils/axios.js";
import { URI } from "../../utils/API.js";
import { Link } from "react-router-dom";

const MostRecentAds = () => {
  const [fetchedQueries, setFetchedQueries] = useState(false);
  const { data: ads } = useQuery({
    queryKey: ["most_recent_ads"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/ads/most_recent", {
        params: {
          page: 1,
          limit: 8,
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
    <div id='home-featured-ads'>
      <div className='text-center py-4 mx-1'>
        <div className='h2 fw-bold'>Most Recent Ads</div>
      </div>
      <div className='featured-ads-main row mx-auto'>
        {ads?.map((ad, i) => (
          <div className='col-xl-3 col-lg-4 col-md-6 col-sm-6 p-3' key={i}>
            <Link to={`/ads/view/${ad?.id}`}>
              <div className='fa-card'>
                <div className='fa-img-main position-relative'>
                  <img
                    src={
                      ad?.ads_image?.length > 0 &&
                      ad?.ads_image[0] &&
                      ad?.ads_image[0]?.image
                        ? URI + "/" + ad?.ads_image[0].image
                        : "https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/themes/classima/assets/img/noimage-listing-thumb.jpg"
                    }
                    alt=''
                  />
                  <div className='fa-img-overlay'></div>
                </div>
                <div className='fa-card-body'>
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
                    <span>{ad?.create_user?.name}</span>
                  </div>
                  <div className='d-flex align-items-center'>
                    <img src='/assets/svgs/location.svg' alt='' />
                    <span>{ad?.city_name || "No Location"}</span>
                  </div>
                  <div className='h4 fw-bold'>₹ {ad?.price}</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostRecentAds;
