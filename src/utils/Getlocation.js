import Geolocation from 'react-native-geolocation-service';
import useLocation from '../hooks/useLocation.js';
export const Getlocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const apiKey = 'AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70';
          const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position?.coords?.latitude},${position?.coords?.longitude}&location_type=APPROXIMATE&key=${apiKey}`;
          const res = await fetch(url, {method: 'GET'});
          const data = await res.json();
          if (data.status === 'OK') {
            resolve(data.results);
          }
        } catch (error) {
          console.log(error);
          reject(error);
        }
      },
      error => {
        reject(error);
        // See error code charts below.
        console.log(error.code, error.message);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};
