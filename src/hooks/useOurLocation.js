import { useContext } from "react";
import LocationProvider from "../contexts/LocationProvider.js";

const useOurLocation = () => {
  return useContext(LocationProvider);
};

export default useOurLocation;
