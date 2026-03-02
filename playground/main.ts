import axios from "axios";
import { createAxiosRefresh } from "@ajaykm/axios-refresh-core";

const api = axios.create();

// added new use case
createAxiosRefresh({
  axiosInstance: api,
  refreshTokenFn: async () => "demo-token",
  devtools: { enabled: true }
});

document.querySelector("button")?.addEventListener("click", () => {
  api.get("/secure");
});