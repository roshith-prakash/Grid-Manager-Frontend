import axios from "axios";

export const devURL = "http://localhost:4000";
export const prodURL = "https://produrl.com";

// Creating an instance of axios to make API calls to server
export const axiosInstance = axios.create({
  baseURL: devURL,
});
