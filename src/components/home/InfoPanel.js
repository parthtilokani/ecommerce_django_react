import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../../utils/axios.js";

const InfoPanel = () => {
  const [fetchedQueries, setFetchedQueries] = useState(false);
  const { data: total } = useQuery({
    queryKey: ["total_ads"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/ads/total_count", {
        params: {
          page: 1,
          limit: 8,
        },
      });
      setFetchedQueries((prev) => true);
      return data;
    },
    enabled: !fetchedQueries,
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
  );
};

export default InfoPanel;
