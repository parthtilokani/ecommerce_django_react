import React from "react";

const AdCardSkeleton = () => {
  return (
    <div className='skeleton-ad-card'>
      <div className='img-wrapper skeleton'></div>
      <div className='body'>
        <div>
          <div className='skeleton skeleton-text h6'></div>
          <div className='d-flex align-items-center mt-1'>
            <img src='/assets/svgs/time.svg' alt='' />
            <span className='skeleton skeleton-text'></span>
          </div>
          <div className='d-flex align-items-center mt-1'>
            <img src='/assets/svgs/location.svg' alt='' />
            <span className='skeleton skeleton-text'></span>
          </div>
          <div className='skeleton skeleton-text h6 mt-1'></div>
        </div>
      </div>
    </div>
  );
};

export default AdCardSkeleton;
