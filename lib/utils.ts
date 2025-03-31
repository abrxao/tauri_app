import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosClient = axios.create({
  baseURL: `${process.env.ROCKET_URL}`,
  headers: { "content-type": "application/json" },
});
