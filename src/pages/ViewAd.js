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
  const { data: ad } = useQuery({
    queryKey: ["single_ad", adId],
    queryFn: async () => {
      const { data } = await axiosPrivate.get(`/ads/ads/${adId}`);
      return data || [];
    },
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
          <div className='col-md-9 mb-2'>
            <div className='card'>
              <div className='card-body'>
                <div className='h4 fw-bold my-2'>{ad?.ad_title}</div>
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
                      <img
                        src='https://www.radiustheme.com/demo/wordpress/publicdemo/classima/wp-content/themes/classima/assets/img/noimage-listing-thumb.jpg'
                        alt='default'
                        className='carousel-image'
                      />
                    )}
                  </div>
                  <button className='carousel-button prev' onClick={prevSlide}>
                    &lt;
                  </button>
                  <button className='carousel-button next' onClick={nextSlide}>
                    &gt;
                  </button>
                </div>
                <div className='d-flex my-2'>
                  <div className='d-flex align-items-center me-3'>
                    <img src='/assets/svgs/time.svg' className='icon' alt='' />
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
                    <img
                      src='/assets/svgs/location.svg'
                      className='icon'
                      alt=''
                    />
                    <span>Denmark</span>
                  </div>
                </div>
                <div className='h4 fw-bold'>₹ {ad?.price}</div>

                <div className='row'>
                  <div className='col-lg-8 mb-2'>
                    <div className='py-1'>{ad?.ad_description}</div>
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
          <div className='col-md-3 mb-2'>
            <div className='card'>
              <div className='card-body'>
                <div className='h5 fw-bold'>Seller Information</div>
                <hr />
                <div className='h6 fw-bold'>User Name</div>
                <div className='h6 fw-bold'>User Location</div>
                <div className='h6 fw-bold'>User Contact Info</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAd;
