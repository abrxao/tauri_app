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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { sendNotification } from "@tauri-apps/api/notification";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import createUser from "@/libAPI/create-user";
import { UserStruct } from "../UsersTable/component";

const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  title: z.string().min(1, "Title is required"),
});
export type createUserData = z.infer<typeof createUserSchema>;

export default function CreateUserForm() {
  const form = useForm<createUserData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      location: "",
      title: "",
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: createUserFn } = useMutation({
    mutationFn: createUser,
    onSuccess(response, variables) {
      const id = response.data.insertedId.$oid;

      sendNotification(`Usuario ${variables.name} foi criado!`);
      const newUser = { _id: { $oid: id }, ...variables };
      queryClient.setQueryData(["users"], (data: UserStruct[]) => [
        ...data,
        newUser,
      ]);
      form.reset();
    },
  });

  async function createUserRequest(userData: createUserData) {
    try {
      await createUserFn(userData);
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
        onSubmit={form.handleSubmit(createUserRequest)}
        className="space-y-8 border border-zinc-300 rounded-lg px-4 py-6 w-full lg:min-w-80 max-w-80 hover:shadow-md duration-200"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Input a name" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Campo obrigatório.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Input a title" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Campo obrigatório.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Input a location" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Campo obrigatório.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {" "}
          Submit
        </Button>
      </form>
    </Form>
  );
}
