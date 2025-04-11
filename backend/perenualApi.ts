import axios from "axios";

export const perenualToken = "sk-RX4y67f93acb4795d9734"; 

const perenualApi = axios.create({
  baseURL: "https://perenual.com/api/v2",
});

export default perenualApi;
