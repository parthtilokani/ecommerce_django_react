import { axiosOpen } from "./axios.js";

export const handleGetCurrentLocation = async ({ latitude, longitude }) => {
  const res = await axiosOpen.get("/ads/ads/get_current_address", {
    params: { lat: latitude, lng: longitude },
  });
  const data = await res.data;
  return data;
};

export const handleLocationSearch = async (searchLocation) => {
  // const res = await axiosOpen.get("/ads/ads/get_lat_lng_from_address", {
  //   params: { address: searchLocation },
  // });
  const res = await axiosOpen.get("/ads/ads/get_place_id_from_address", {
    params: { address: searchLocation },
  });
  const data = await res.data;
  return data;
};
