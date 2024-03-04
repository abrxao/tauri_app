interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export type createDocumentResponse = {
  insertedId: {
    $oid: string;
  };
};
export type ObjectID = {
  $oid: string;
};
export type DateTimeMongo = {
  $date: {
    $numberLong: string;
  };
};
export type ProductStruct = {
  _id?: {
    $oid: string;
  };
  name: string;
  price: number;
  weight: number;
  categories: string[];
  description: string;
  quantity: number;
  image?: string;
  created_at?: null | DateTimeMongo;
  updated_at?: null | DateTimeMongo;
  deleted_at?: null | DateTimeMongo;
  status: boolean;
};
interface Product {
  id: number;
  name: string;
  price: number;
}
