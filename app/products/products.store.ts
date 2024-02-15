import { ProductStruct } from "@/lib/APIFunctions/product-api";
import { create } from "zustand";

type ProductsPage = {
  isProductFormOpen: boolean;
  setIsProductFormOpen: (update: boolean) => void;
  toEditProduct: ProductStruct | null;
  setToEditProduct: (update: ProductStruct | null) => void;
};

const useProductPageState = create<ProductsPage>((set) => ({
  isProductFormOpen: false,
  setIsProductFormOpen: (update: boolean) => {
    set((state) => ({ isProductFormOpen: update }));
  },
  toEditProduct: null,
  setToEditProduct: (update: ProductStruct | null) => {
    set((state) => ({ toEditProduct: update }));
  },
}));

export default useProductPageState;
