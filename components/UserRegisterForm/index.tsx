"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendNotification } from "@tauri-apps/api/notification";
import { registerUser } from "@/lib/APIFunctions/user-api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const registerUserSchema = z
  .object({
    username: z.string().min(1, "Nome de usuario é obrigatório"),
    password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine(
    (data) => {
      return data.password === data.confirmPassword;
    },
    { message: "As senhas estão diferentes", path: ["confirmPassword"] }
  );

export type registerUserData = z.infer<typeof registerUserSchema>;

export default function UserRegisterForm() {
  const form = useForm<registerUserData>({
    resolver: zodResolver(registerUserSchema),
  });
  const router = useRouter();
  async function registerUserRequest(userData: registerUserData) {
    try {
      const data = await registerUser(userData);
      if (data.status === 200) {
        toast.success("Usuario criado", {
          description: "Você será redirecionado para a página de login",
        });
        setTimeout(() => {
          router.push("/");
        }, 2250);
        form.reset();
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
        onSubmit={form.handleSubmit(registerUserRequest)}
        className="space-y-4 border rounded-lg px-4 py-6 w-full lg:min-w-80 max-w-80 hover:shadow-md duration-150"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuario *</FormLabel>
              <FormControl>
                <Input placeholder="Digite o nome de usuario" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha *</FormLabel>
              <FormControl>
                <Input placeholder="Digite a sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmação de senha *</FormLabel>
              <FormControl>
                <Input placeholder="Confirme a sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
