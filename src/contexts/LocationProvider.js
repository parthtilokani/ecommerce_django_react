import {createContext, useState} from 'react';

const LocationContext = createContext({});

export const LocationProvider = ({children}) => {
  const [location, setLocation] = useState({
    name: 'Location',
    lat: '',
    long: '',
    place_id: '',
  });
  const [address, setAddress] = useState([]);

  return (
    <LocationContext.Provider
      value={{location, setLocation, address, setAddress}}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
