import axios from "axios";

import { API } from "./API.js";

export const axiosPrivate = axios.create({
  baseURL: API,
});
