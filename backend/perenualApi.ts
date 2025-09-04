// src/backend/perenualApi.ts
import axios from "axios";
import { PERENUAL_API_TOKEN } from "@env";

export const ApiToken = PERENUAL_API_TOKEN;

export const perenualApi = axios.create({
  baseURL: "https://perenual.com/api/v2",
});

export const perenualGuideApi = axios.create({
  baseURL: "https://perenual.com/api",
});
