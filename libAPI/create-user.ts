import { createUserData } from "@/components/CreateUserForm";
import axios from "axios";
export type createUserResponse = {
  insertedId: {
    $oid: string;
  };
};

export default async function createUser(userData: createUserData) {
  const response = await axios<createUserResponse>(
    "http://127.0.0.1:8000/user",
    {
      method: "post",
      data: userData,
      headers: { "content-type": "application/json" },
    }
  );
  return response;
}
