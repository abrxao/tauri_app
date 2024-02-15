import { z } from "zod";

export const ProductSchema = z.object({
  _id: z
    .object({
      $oid: z.string(),
    })
    .optional(),
  name: z.string().min(1, "Nome é obrigatório"),
  price: z.coerce.number().min(0.01, "Preço é obrigatório"),
  weight: z.coerce.number().min(0.001, "Preço é obrigatório"),
  categories: z.array(z.string()).min(0, "Categorias é obrigatório"),
  description: z.string().min(1, "Descrição é obrigatório"),
  quantity: z.coerce.number().min(0, "Preço é obrigatório"),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
  image: z.string(),
  status: z.boolean(),
});
export type createProductData = z.infer<typeof ProductSchema>;
