import axios, { AxiosHeaders } from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.efub-seminar.o-r.kr",
  headers: {
    //콘텐츠 타입 넣기기
    'Content-Type': "application/json",
  },
});

export default axiosInstance;
