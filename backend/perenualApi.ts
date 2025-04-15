// src/backend/perenualApi.ts
import axios from "axios";

export const ApiToken = "sk-RX4y67f93acb4795d9734"; // main token
// export const ApiToken = ""; 
// export const ApiToken = "sk-2EvB67fd3996bb0819785";
// export const ApiToken = "sk-njwe67fd37a9ded179784";

export const perenualApi = axios.create({
  baseURL: "https://perenual.com/api/v2",
});

export const perenualGuideApi = axios.create({
  baseURL: "https://perenual.com/api",
});
