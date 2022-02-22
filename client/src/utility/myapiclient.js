import axios from 'axios';

 const baseUrl = (process.env.NODE_ENV === "production"
    ? "https://tipstickers.herokuapp.com"
    : "http://localhost:3000");

 const axiosClient = axios.create({ baseURL: baseUrl });

 export default {baseUrl,axiosClient};
