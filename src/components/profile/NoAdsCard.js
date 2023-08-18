import React from "react";
import { Link } from "react-router-dom";

const NoAdsCard = ({ profile }) => {
  return (
    <div className='no-ads-card col-12'>
      <div className='body'>
        {profile ? (
          <div className='h4'>
            <Link to='/post-new-ad'>Post your first Ad &#8594;</Link>
          </div>
        ) : (
          <div className='h4'>No Ads Found</div>
        )}
      </div>
    </div>
  );
};

export default NoAdsCard;
