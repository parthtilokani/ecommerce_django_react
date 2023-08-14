import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useParams } from "react-router-dom";

import "../styles/css/viewad.css";
import useAxiosPrivate from "../hooks/useAxiosPrivate.js";
import { URI } from "../utils/API.js";

const ViewAd = () => {
  const axiosPrivate = useAxiosPrivate();
  const { id: adId } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [fetchedQueries, setFetchedQueries] = useState([false]);
  const { data: ad, isLoading } = useQuery({
    queryKey: ["single_ad", adId],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/ads/ads/${adId}`);
      setFetchedQueries((prev) => [true]);
      return data || [];
    },
    enabled: !fetchedQueries[0],
  });

  const nextSlide = () =>
    setCurrentImage((prevIndex) =>
      prevIndex === ad?.images?.length - 1 || ad?.images?.length === 0
        ? 0
        : prevIndex + 1
    );

  const prevSlide = () =>
    setCurrentImage((prevIndex) =>
      ad?.images?.length === 0
        ? 0
        : prevIndex === 0
        ? ad?.images.length - 1
        : prevIndex - 1
    );

  return (
    <div id='view_ad'>
      <div className='va-body'>
        <div className='row m-1'>
          <div className='col-lg-8 mb-2'>
            <div className='card'>
              <div className='card-body'>
                {isLoading ? (
                  <>
                    <div className='skeleton skeleton-text h4'></div>
                    <div className='skeleton skeleton-text h4'></div>
                  </>
                ) : (
                  <div className='h4 fw-bold my-2'>{ad?.ad_title}</div>
                )}
                <div className='carousel-container'>
                  <div
                    className='carousel-wrapper'
                    style={{
                      transform: `translateX(${-currentImage * 100}%)`,
                    }}>
                    {ad?.images?.length > 0 ? (
                      ad?.images?.map(({ image }, index) => (
                        <div key={index} className='image-wrapper'>
                          <img
                            src={URI + "/" + image}
                            alt={`${index + 1}`}
                            className='carousel-image'
                          />
                        </div>
                      ))
                    ) : (
                      <div className='image-wrapper'>
                        <div
                          className='carousel-image skeleton'
                          style={{ height: "300px" }}></div>
                      </div>
                    )}
                  </div>
                  <button className='carousel-button prev' onClick={prevSlide}>
                    &lt;
                  </button>
                  <button className='carousel-button next' onClick={nextSlide}>
                    &gt;
                  </button>
                </div>
                <div className='d-sm-flex my-2'>
                  <div className='d-flex align-items-center me-3 mb-1'>
                    <img src='/assets/svgs/time.svg' className='icon' alt='' />
                    {isLoading ? (
                      <div
                        className='skeleton skeleton-text h4'
                        style={{ width: "200px" }}></div>
                    ) : (
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
                    )}
                  </div>
                  <div className='d-flex align-items-center'>
                    <img
                      src='/assets/svgs/location.svg'
                      className='icon'
                      alt=''
                    />
                    {isLoading ? (
                      <div
                        className='skeleton skeleton-text h4'
                        style={{ width: "200px" }}></div>
                    ) : (
                      <span>{ad?.district_name || "No Location"}</span>
                    )}
                  </div>
                </div>
                <div className='h4 fw-bold'>
                  {isLoading ? (
                    <div
                      className='skeleton skeleton-text h4'
                      style={{ width: "200px" }}></div>
                  ) : (
                    `₹ ${ad?.price}`
                  )}
                </div>

                <div className='row'>
                  <div className='col-lg-8 mb-2'>
                    <div className='py-1'>
                      {isLoading ? (
                        <>
                          <div className='skeleton skeleton-text h4'></div>
                          <div className='skeleton skeleton-text h4'></div>
                          <div className='skeleton skeleton-text h4'></div>
                          <div className='skeleton skeleton-text h4'></div>
                        </>
                      ) : (
                        ad?.ad_description
                      )}
                    </div>
                    {ad?.dynamic_field
                      ?.filter((df) => df?.field_type === "Text")
                      ?.map((df, i) => (
                        <div className='fw-bold py-1' key={i}>
                          <span className='fw-bold'>{df?.field_name}</span> :{" "}
                          {df?.value}
                        </div>
                      ))}
                    {ad?.dynamic_field
                      ?.filter((df) => df?.field_type === "TextArea")
                      ?.map((df, i) => (
                        <div key={i} className='py-1'>
                          <span className='fw-bold'>{df?.field_name}</span> :{" "}
                          {df?.value}
                        </div>
                      ))}
                  </div>
                  <div className='col-lg-4'>
                    <div className='h5 fw-bold'>Overview</div>
                    <hr className='m-0' />
                    {ad?.dynamic_field
                      ?.filter((df) =>
                        [
                          "Date",
                          "Time",
                          "Select",
                          "PhoneNumber",
                          "Number",
                          "Price",
                        ].includes(df?.field_type)
                      )
                      ?.map((df, i) => (
                        <div key={i} className='py-1'>
                          <span className='fw-bold'>{df?.field_name}</span> :{" "}
                          {df?.value}
                        </div>
                      ))}
                    <div className='py-1'>0 views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='col-lg-4 mb-2'>
            <div className='card'>
              <div className='card-body'>
                <div className='h5 fw-bold'>Seller Information</div>
                <hr />
                <div className='h6 fw-bold'>Name : {ad?.create_user?.name}</div>
                <div className='h6 fw-bold'>
                  Contact Info : +{ad?.create_user?.area_code}-
                  {ad?.create_user?.phone_no}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAd;
