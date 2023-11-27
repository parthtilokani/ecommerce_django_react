import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { axiosOpen } from "../../utils/axios.js";

const InfoPanel = () => {
  const [fetchedQueries, setFetchedQueries] = useState([false, false]);
  const { data } = useQuery({
    queryKey: ["total_ads"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/ads/ads/total_count");
      setFetchedQueries((prev) => [true, prev[1]]);
      return {
        total_count: data?.total_count,
        distinct_states_count: data?.distinct_states_count,
      };
    },
    enabled: !fetchedQueries[0],
    staleTime: Infinity,
  });
  const { data: total_users } = useQuery({
    queryKey: ["total_users"],
    queryFn: async () => {
      const { data } = await axiosOpen.get("/user/user/get_users_count");
      setFetchedQueries((prev) => [prev[0], true]);
      return data?.registered_user || 100;
    },
    enabled: !fetchedQueries[1],
    staleTime: Infinity,
  });

  return (
    <div id="home-info-panel">
      <div className="info-panel-main">
        <div className="info-overlay">
          <div className="row mx-auto">
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <div className="info-panel-card">
                <div className="d-flex flex-fill">
                  <div className="ip-img-div">
                    <img src="/assets/svgs/ads.svg" alt="" />
                  </div>
                  <div className="mt-4">
                    <div className="h2 fw-bold text-white">
                      {data?.total_count || 100}+
                    </div>
                    <p className="h5 text-white">Published Ads</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <div className="info-panel-card">
                <div className="d-flex flex-fill">
                  <div className="ip-img-div">
                    <img src="/assets/svgs/users.svg" alt="" />
                  </div>
                  <div className="mt-4">
                    <div className="h2 fw-bold text-white">{total_users}+</div>
                    <p className="h5 text-white">Registered Users</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 d-flex justify-content-center align-items-center">
              <div className="info-panel-card">
                <div className="d-flex flex-fill">
                  <div className="ip-img-div">
                    <img src="/assets/svgs/verified.svg" alt="" />
                  </div>
                  <div className="mt-4">
                    <div className="h2 fw-bold text-white">
                      {data?.distinct_states_count || 100}+
                    </div>
                    <p className="h5 text-white">Locations</p>
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
