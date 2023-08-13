import Geolocation from 'react-native-geolocation-service';
import useLocation from '../hooks/useLocation.js';
export const Getlocation = async () => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async position => {
        const apiKey = 'AIzaSyBTzu7NKnoo9HvEkqGh2ehrcOIcRp05Z70';
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${position?.coords?.latitude},${position?.coords?.longitude}&location_type=APPROXIMATE&key=${apiKey}`;
        const res = await fetch(url, {method: 'GET'});
        const data = await res.json();
        if (data.status === 'OK') {
          resolve(data.results);
        } else {
          reject(data);
        }
      },
      error => {
        console.log('sadasdasdaq2e312', error.code, error.message);
        reject(error);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  });
};
