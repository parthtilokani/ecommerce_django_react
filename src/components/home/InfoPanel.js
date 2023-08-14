import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../../utils/axios.js";

const InfoPanel = () => {
  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
  const { data: total_ads } = useQuery({
    queryKey: ["total_ads"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/ads/total_count");
      setFetchedQueries((prev) => [true, prev[1]]);
      return data?.total_count;
    },
    enabled: !fetchedQueries[0],
  });
  const { data: total_locations } = useQuery({
    queryKey: ["total_locations"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/district", {
        page: 1,
        page_size: 1000,
      });
      setFetchedQueries((prev) => [prev[0], true]);
      return data?.count || 100;
    },
    enabled: !fetchedQueries[1],
  });

  return (
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
                    <div className='h2 fw-bold text-white'>
                      {total_ads || 100}+
                    </div>
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
                    <div className='h2 fw-bold text-white'>
                      {total_locations || 100}+
                    </div>
                    <p className='h5 text-white'>Locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel;
