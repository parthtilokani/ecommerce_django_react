import { createContext, useState, useEffect } from "react";

const LocationContext = createContext({});

export default LocationContext;

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(
    { ...JSON.parse(localStorage.getItem("location")) } || {
      name: "",
      lat: "",
      lng: "",
    }
  );

  useEffect(() => {
    (() => localStorage.setItem("location", JSON.stringify(location)))();
  }, [location]);

  return (
    <LocationContext.Provider
      value={{ location: location, setLocation: setLocation }}>
      {children}
    </LocationContext.Provider>
  );
};
