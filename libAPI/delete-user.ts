import { createUserData } from "@/components/CreateUserForm";
import axios from "axios";
type createUserResponse = {
  _id: {
    $oid: string;
  };
};

export default async function deleteUser(obj_id?: string) {
  const response = await axios<createUserResponse>(
    `http://127.0.0.1:8000/user/${obj_id}`,
    {
      method: "DELETE",
    }
  );
  return response;
}
