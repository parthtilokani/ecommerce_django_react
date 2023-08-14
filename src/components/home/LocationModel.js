import React from "react";

const LocationModel = ({
  locationView,
  error,
  ourLocation,
  loading,
  searchLocation,
  setSearchLocation,
  handleLocationSearch,
  setLocation,
  setLocationView,
  addressList,
  setError,
  handleLocationSearchByClick,
}) => {
  return (
    <div
      className='location-model'
      style={locationView ? {} : { display: "none" }}>
      <div className='card'>
        <div className='h5 p-1 text-center mt-3'>Select Location</div>
        {error && <div className='text-center text-danger'>{error}</div>}
        {ourLocation?.name && (
          <div className='fw-bold px-4'>
            Selected Location : <span>{ourLocation?.name}</span>
          </div>
        )}
        <div className='row mx-3 my-1'>
          <div className='col-10 p-0 pe-1'>
            <input
              className='form-control form-control-sm'
              placeholder='Search Location'
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              id='location-search'
            />
          </div>
          <div className='col-2 p-0'>
            <div
              style={{
                margin: "auto",
                backgroundColor: "#43c6ac",
                width: "100%",
                height: 30,
                textAlign: "center",
                borderRadius: 5,
                cursor: "pointer",
              }}
              onClick={() => {
                if (loading) return;
                handleLocationSearchByClick();
              }}>
              <img
                src='/assets/svgs/search.svg'
                alt='search'
                style={{ height: 25 }}
              />
            </div>
          </div>
        </div>
        {addressList.length > 0 ? (
          <div className='px-3' style={{ maxHeight: 200, overflowY: "scroll" }}>
            <ul
              style={{
                listStyle: "none",
              }}>
              <hr className='m-1' />
              {addressList.map((address, index) => (
                <li
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setLocation((prev) => ({
                      ...prev,
                      name: address.formatted_address,
                      ...address?.geometry?.location,
                    }));
                    setLocationView(false);
                    setSearchLocation("");
                  }}>
                  <p
                    style={{ overflow: "hidden", whiteSpace: "nowrap" }}
                    className='mx-2'>
                    {address.formatted_address}
                  </p>
                  <hr className='m-1' />
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className='text-center'>No location found!</div>
        )}
        <img
          src='./assets/svgs/close.svg'
          className='close-btn'
          alt=''
          onClick={() => {
            setLocationView(false);
            setError("");
          }}
        />
      </div>
    </div>
  );
};

export default LocationModel;
