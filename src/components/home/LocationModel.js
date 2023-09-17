import React from "react";

const LocationModel = ({
  locationView,
  error,
  ourLocation,
  loading,
  searchLocation,
  setSearchLocation,
  setLocation,
  setLocationView,
  addressList,
  setError,
  handleGetLocation,
}) => {
  const handleClose = () => {
    if (!ourLocation?.name) return setError("Select location to continue.");
    setLocationView(false);
    setError("");
  };

  return (
    <div
      className='location-model'
      style={locationView ? {} : { display: "none" }}
      onClick={handleClose}>
      <div className='card' onClick={(e) => e.stopPropagation()}>
        <div className='h5 p-1 text-center mt-1 mb-0'>Select Location</div>
        {error && (
          <div
            className='px-3 text-start text-danger'
            style={{ fontSize: "12px" }}>
            {error}
          </div>
        )}
        {ourLocation?.name && (
          <div className='fw-bold px-3 mb-2'>
            Selected : <span>{ourLocation?.name}</span>
          </div>
        )}
        <div className='px-3'>
          <button className='get-location' onClick={handleGetLocation}>
            Get current location
          </button>
          <p className='text-center'>or</p>
          <input
            className='form-control form-control-sm'
            placeholder='Search Location'
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            id='location-search'
          />
        </div>
        {addressList.length > 0 ? (
          <div className='px-3'>
            <ul
              style={{
                listStyle: "none",
              }}>
              <hr className='m-1' />
              {addressList.slice(0, 6).map((address, index) => (
                <li
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setLocation((prev) => ({
                      ...prev,
                      name: address?.description || address?.formatted_address,
                      ...(address?.geometry?.location || {}),
                      place_id: address?.place_id,
                    }));
                    setLocationView(false);
                    setSearchLocation("");
                  }}>
                  <p
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                    className='mx-2'>
                    {address?.description || address?.formatted_address}
                  </p>
                  <hr className='m-1' />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          searchLocation && (
            <div className='text-center'>No location found!</div>
          )
        )}
        <img
          src='/assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={handleClose}
        />
      </div>
    </div>
  );
};

export default LocationModel;
