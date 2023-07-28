import { createContext, useState } from "react";

const LocationContext = createContext({});

export default LocationContext;

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState();

  return (
    <LocationContext.Provider
      value={{ location: location, setLocation: setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
