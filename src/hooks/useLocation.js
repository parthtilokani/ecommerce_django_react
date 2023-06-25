import {useContext} from 'react';
import LocationContext from '../contexts/LocationProvider.js';

const useLocation = () => {
  return useContext(LocationContext);
};

export default useLocation;
