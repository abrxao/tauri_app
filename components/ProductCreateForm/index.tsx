"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import ProductCreateForm from "@/components/ProductCreateForm/form";
import useProductPageState from "@/app/products/products.store";
import { Cross2Icon, PlusIcon } from "@radix-ui/react-icons";

export function OpenProductDrawerButton() {
  const { setIsProductFormOpen, setToEditProduct } = useProductPageState();
  return (
    <Button
      className="flex gap-1"
      onClick={() => {
        setToEditProduct(null);
        setIsProductFormOpen(true);
      }}
    >
      Adicionar produto <PlusIcon className="w-4 h-4 font-bold" />
    </Button>
  );
}
export function ProductDrawer() {
  const { isProductFormOpen, setIsProductFormOpen, toEditProduct } =
    useProductPageState();

  return (
    <Drawer open={isProductFormOpen} onOpenChange={setIsProductFormOpen}>
      <DrawerContent className="px-12 py-6 ">
        <div className="max-w-3xl m-auto">
          <DrawerHeader className="text-left flex justify-between items-start">
            <div>
              <DrawerTitle>
                {toEditProduct
                  ? `Editando ${toEditProduct.name}.`
                  : `Crie um produto`}
              </DrawerTitle>
              <DrawerDescription>
                {toEditProduct
                  ? `Atualize as informações do produto`
                  : `Preencha os dados do produto`}
              </DrawerDescription>
            </div>
            <DrawerClose>
              <Button
                variant="ghost"
                className="h-8 w-8 p-0 hover:text-red-500"
              >
                <span className="sr-only">
                  Fechar formulario de novo produto
                </span>
                <Cross2Icon className="h-6 w-6" />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          <div className="p-4">
            <ProductCreateForm />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
