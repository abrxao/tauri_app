import { ProductStruct, createDocumentResponse } from "./types-product-api";
import { createProductData } from "@/components/ProductCreateForm/product-form-schema";
import axios from "axios";

export async function createProduct(productData: createProductData) {
  const response = await axios<createDocumentResponse>(
    "http://127.0.0.1:8000/product",
    {
      method: "post",
      data: productData,
      headers: { "content-type": "application/json" },
    }
  );
  return response;
}
export async function updateProduct(productData: createProductData) {
  const response = await axios<ProductStruct>(
    `http://127.0.0.1:8000/product/${productData._id?.$oid}`,
    {
      method: "put",
      data: productData,
      headers: { "content-type": "application/json" },
    }
  );
  return response;
}
export async function deleteProduct(obj_id: string) {
  const response = await axios<ProductStruct>(
    `http://127.0.0.1:8000/product/${obj_id}`,
    {
      method: "DELETE",
    }
  );
  return response;
}
export async function deleteManyProducts(obj_ids: string[]) {
  const response = await axios<ProductStruct>(
    `http://127.0.0.1:8000/products`,
    {
      method: "DELETE",
      data: { ids: obj_ids },
    }
  );
  return response;
}
