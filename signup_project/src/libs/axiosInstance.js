import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.efub-seminar.o-r.kr",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

export default axiosInstance;
