import { loginUserData } from "@/components/UserLoginForm";
import axios from "axios";
import { ObjectID, createDocumentResponse } from "./types-product-api";

export type Role = "user" | "admin";
export type loginResponse = {
  _id: ObjectID;
  username: string;
  role: Role;
};
export type deleteUserResponse = {
  _id: {
    $oid: string;
  };
};
