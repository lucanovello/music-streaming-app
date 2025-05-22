import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.AXIOS_BASE_URL}/api`,
});
