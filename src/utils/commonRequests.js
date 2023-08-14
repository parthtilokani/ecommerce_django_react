import { axiosOpen } from "./axios.js";

export const handleLocationSearch = async ({
  searchLocation,
  setAddressList,
  setLoading,
  setError,
}) => {
  try {
    if (searchLocation.trim() === "") return;
    setLoading(true);

    // const apiKey = "";
    // const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${searchLocation}&key=${apiKey}`;

    // const res = await fetch(url, { method: "GET" });
    const res = await axiosOpen.get("/ads/ads/get_lat_lng_from_address", {
      params: { address: searchLocation },
    });

    const data = await res.data;
    console.log(data);
    if (data.status === "OK") {
      setError("");
      setAddressList([...data.results]);
    } else if (data.status === "ZERO_RESULTS") {
      setError("");
      setAddressList([]);
    } else {
      setAddressList([]);
      setError("Unable to fetch location data");
    }
    setLoading(false);
  } catch (error) {
    setAddressList([]);
    console.log(error);
    setError("Unable to retrieve your location");
    setLoading(false);
  }
};
