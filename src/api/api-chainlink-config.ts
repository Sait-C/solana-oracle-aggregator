import axios from "axios";

const debug = process.env.NODE_ENV !== "production";

const baseURL = debug
  ? "https://min-api.cryptocompare.com/"
  : "https://min-api.cryptocompare.com/"; // production/deployed api url

const api = axios.create({ baseURL });

export default api;
