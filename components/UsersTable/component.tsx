"use client";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { createUserData } from "../CreateUserForm";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import deleteUser from "@/libAPI/delete-user";
import { Skeleton } from "../ui/skeleton";
export interface UserStruct extends createUserData {
  _id: { $oid: string };
}

export default function UsersTable_() {
  const { data: users, isLoading } = useQuery<UserStruct[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/users");
      return data;
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: deleteUserFn } = useMutation({
    mutationFn: deleteUser,
    onSuccess(response) {
      const id = response.data._id.$oid;
      const usersCached = queryClient.getQueryData(["users"]);
      queryClient.setQueryData(["users"], (data: UserStruct[]) => {
        return data.filter((elem) => id !== elem._id.$oid);
      });
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<UserStruct | undefined>();

  return (
    <>
      {true ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Deseja remover esse documento?</DialogTitle>
              <DialogDescription>
                <p>Nome: {toDelete?.name}</p>
                <p> Location: {toDelete?.location}</p>
                <p> Titulo: {toDelete?.title}</p>
                <p className="mt-2 font-bold text-red-700">
                  Esta ação não pode ser desfeita.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="pt-2 flex items-end">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => toDelete && deleteUserFn(toDelete?._id.$oid)}
                >
                  Apagar para sempre?
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Deseja remover esse documento?</DrawerTitle>

              <DrawerDescription className="text-zinc-950">
                <p>Nome: {toDelete?.name}</p>
                <p> Location: {toDelete?.location}</p>
                <p> Titulo: {toDelete?.title}</p>
                <p className="mt-2 font-bold text-red-700">
                  Esta ação não pode ser desfeita.
                </p>
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-2 flex items-end">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => toDelete && deleteUserFn(toDelete?._id.$oid)}
                >
                  Apagar para sempre
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      <div className="border rounded-xl p-0.5 hover:shadow-md duration-200">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Remove</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users &&
              users.map((user) => (
                <TableRow key={user._id.$oid}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.title}</TableCell>
                  <TableCell>{user.location}</TableCell>
                  <TableCell>
                    <Button
                      variant={"destructive"}
                      size={"sm"}
                      className="flex gap-1"
                      aria-label="delete this user"
                      onClick={() => {
                        setToDelete(user);
                        setOpen(true);
                      }}
                    >
                      delete <Cross2Icon height={20} width={20} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={4} className="text-center" key={index}>
                    <Skeleton className="w-full h-10 rounded-sm" />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
