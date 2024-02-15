import { createUserData } from "@/components/CreateUserForm";
import axios from "axios";
type createUserResponse = {
  insertedId: {
    $oid: string;
  };
};
type deleteUserResponse = {
  _id: {
    $oid: string;
  };
};

export async function createUser(userData: createUserData) {
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

export async function deleteUser(obj_id?: string) {
  const response = await axios<deleteUserResponse>(
    `http://127.0.0.1:8000/user/${obj_id}`,
    {
      method: "DELETE",
    }
  );
  return response;
}
