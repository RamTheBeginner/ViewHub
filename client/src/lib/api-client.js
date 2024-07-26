import axios from "axios";
import { HOST } from "@/utils/constants.js";

export const apiClient = axios.create({
    baseURL: HOST,
    withCredentials: true, // Important for sending cookies with requests
    headers: {
        'Content-Type': 'application/json',
      },
});
