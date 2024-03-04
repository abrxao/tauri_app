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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "@/lib/APIFunctions/user-api";
import { setToken } from "@/app/actions";

const loginUserSchema = z.object({
  username: z.string().min(1, "Nome de usuario é obrigatório"),
  password: z.string().min(8, "A senha deve ter pelo menos 8 caracteres"),
});
export type loginUserData = z.infer<typeof loginUserSchema>;

export default function UserLoginForm() {
  const form = useForm<loginUserData>({
    resolver: zodResolver(loginUserSchema),
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function loginRequest(userData: loginUserData) {
    setIsLoading(true);
    try {
      const response = await signIn(userData);
      if (response?.status === 200) {
        await setToken("to_implement");
        router.push("/products");
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
        onSubmit={form.handleSubmit(loginRequest)}
        className="space-y-4 border rounded-lg px-4 py-6 w-full lg:min-w-80 max-w-80 hover:shadow-md duration-150"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome de usuario</FormLabel>
              <FormControl>
                <Input placeholder="Coloque seu nome de usuario" {...field} />
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input placeholder="Coloque sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading} className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}
