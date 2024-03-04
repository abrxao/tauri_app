import { loginUserData } from "@/components/UserLoginForm";
import axios from "axios";
import { createDocumentResponse } from "./types-product-api";
import { deleteUserResponse, loginResponse } from "./types-user-api";

export async function registerUser(userData: loginUserData) {
  const response = await axios<createDocumentResponse>(
    `${process.env.ROCKET_URL}/register_user`,
    {
      method: "post",
      data: userData,
      headers: { "content-type": "application/json" },
    }
  );
  axios.post("http://localhost:3000/", { token: "token" });
  return response;
}

export async function signIn(userData: loginUserData) {
  const response = await axios<loginResponse>(
    `${process.env.ROCKET_URL}/login`,
    {
      method: "post",
      data: userData,
      headers: { "content-type": "application/json" },
    }
  );
  return response;
}

export async function deleteUser(obj_id?: string) {
  const response = await axios<deleteUserResponse>(
    `http://127.0.0.1:8000/user/${obj_id}`,
    {
      method: "DELETE",
    }
  );
  return response;
}
