"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendNotification } from "@tauri-apps/api/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, updateProduct } from "@/lib/APIFunctions/product-api";
import { Textarea } from "../ui/textarea";
import { ProductSchema, createProductData } from "./product-form-schema";
import useProductPageState from "@/app/products/products.store";
import { ProductStruct } from "@/lib/APIFunctions/types-product-api";

export default function ProductCreateForm() {
  const { toEditProduct, setIsProductFormOpen, setToEditProduct } =
    useProductPageState();

  const defaultValues = toEditProduct
    ? {
        ...toEditProduct,
        created_at: new Date(
          parseInt(toEditProduct?.created_at?.$date.$numberLong ?? "0")
        ).toISOString(),
        updated_at: undefined,
      }
    : {
        categories: ["Proteina"],
        image: "",
        status: true,
      };

  const form = useForm<createProductData>({
    resolver: zodResolver(ProductSchema),
    defaultValues,
  });
  //////////////////////////////////////////
  const queryClient = useQueryClient();
  //Those is the mutation functions that will be called when the form is submitted and update local data state
  const { mutateAsync: createProductFn } = useMutation({
    mutationFn: createProduct,
    onSuccess(response, variables) {
      const id = response.data.insertedId.$oid;

      const newUser = {
        _id: { $oid: id },
        created_at: {
          $date: {
            $numberLong: new Date().getTime().toString(),
          },
        },
        ...variables,
      };
      queryClient.setQueryData(["products"], (data: ProductStruct[]) => [
        ...data,
        newUser,
      ]);
      sendNotification({
        title: `Produto ${variables.name} foi criado!`,
      });

      setIsProductFormOpen(false);
      setToEditProduct(null);
      form.reset();
    },
  });
  const { mutateAsync: updateProductFn } = useMutation({
    mutationFn: updateProduct,
    onSuccess(response, variables) {
      queryClient.setQueryData(["products"], (data: ProductStruct[]) =>
        data.map((elem) => {
          if (elem._id?.$oid == response.data._id?.$oid) {
            return response.data;
          } else {
            return elem;
          }
        })
      );
      sendNotification({ title: `Produto ${variables.name} foi editado!` });
      setIsProductFormOpen(false);
      setToEditProduct(null);
      form.reset();
    },
  });
  //////////////////////////////////////////
  async function createProductRequest(productData: createProductData) {
    try {
      if (toEditProduct != null) {
        await updateProductFn(productData);
      } else {
        await createProductFn(productData);
      }
    } catch (error: unknown) {
      if (typeof error === "string") {
        sendNotification(error);
      } else if (error instanceof Error) {
        sendNotification(error.message);
      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(createProductRequest)}
        className="space-y-6 border rounded-lg px-8 py-6 w-full lg:min-w-80 hover:shadow-lg dark:shadow-zinc-900 duration-150 m-auto"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nome *</FormLabel>
              <FormControl>
                <Input placeholder="Digite seu nome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-1">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel>Preço *</FormLabel>
                <FormControl>
                  <Input placeholder="Coloque o preço" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Preço em R$</FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel>Quantidade *</FormLabel>
                <FormControl>
                  <Input placeholder="Coloque o Quantidade" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Peso *</FormLabel>
                <FormControl>
                  <Input placeholder="Coloque o peso" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>Peso em Kilogramas</FormDescription>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Descrição *</FormLabel>
              <FormControl>
                <Textarea placeholder="Coloque uma descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => form.reset()}
          >
            Limpar campos
          </Button>
          <Button type="submit">
            {toEditProduct ? "Salvar edição" : "Criar produto "}
          </Button>
        </div>
      </form>
    </Form>
  );
}
