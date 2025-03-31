import { loginUserData } from "@/components/UserLoginForm";
import axios from "axios";
import { createDocumentResponse } from "./types-product-api";
import { deleteUserResponse, loginResponse } from "./types-user-api";
import { axiosClient } from "../utils";

export async function registerUser(userData: loginUserData) {
  const response = await axiosClient<createDocumentResponse>(`/register_user`, {
    method: "post",
    data: userData,
  });
  return response;
}

export async function signIn(userData: loginUserData) {
  const response = await axiosClient<loginResponse>(`/login`, {
    method: "post",
    data: userData,
  });
  return response;
}

export async function deleteUser(obj_id?: string) {
  const response = await axiosClient<deleteUserResponse>(`/user/${obj_id}`, {
    method: "DELETE",
  });
  return response;
}
