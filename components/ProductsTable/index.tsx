"use client";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productTableColumnsDef } from "./products-table-config";
import {
  deleteManyProducts,
  deleteProduct,
} from "@/lib/APIFunctions/product-api";
import { ProductStruct } from "@/lib/APIFunctions/types-product-api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Cross2Icon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import { Skeleton } from "../ui/skeleton";
import useProductPageState from "@/app/products/products.store";
import { OpenProductDrawerButton } from "../ProductCreateForm";
import { useIsClient } from "@/hooks/useIsClient";
import { useState } from "react";
import weightFormat from "@/lib/weightFormat";

export function ProductsTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { setIsProductFormOpen, setToEditProduct } = useProductPageState();

  const { data, isLoading } = useQuery<ProductStruct[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await axios.get("http://127.0.0.1:8000/products");
      return data;
    },
  });
  const queryClient = useQueryClient();
  const { mutateAsync: deleteProductFn } = useMutation({
    mutationFn: deleteProduct,
    onSuccess(response) {
      const id = response.data._id?.$oid;
      queryClient.setQueryData(["products"], (data: ProductStruct[]) => {
        return data.filter((elem) => id !== elem._id?.$oid);
      });
      setToDelete(undefined);
    },
  });
  const { mutateAsync: deleteManyProductFn } = useMutation({
    mutationFn: deleteManyProducts,
    onSuccess(response, ids) {
      const id = response.data._id?.$oid;
      queryClient.setQueryData(["products"], (data: ProductStruct[]) => {
        return data.filter((elem) => !ids.includes(elem._id!.$oid));
      });
      table.toggleAllPageRowsSelected(false);
      setToDelete(undefined);
    },
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: data ?? [],
    columns: productTableColumnsDef,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [open, setOpen] = useState<boolean>(false);
  const [toDelete, setToDelete] = useState<ProductStruct | undefined>();
  const isDesktop = window.innerWidth > 768;
  return (
    <div className="w-full">
      {isDesktop ? (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="mb-2">
                Deseja remover {toDelete ? "esse produto" : "esses produtos"} ?
              </DialogTitle>
              <div>
                {toDelete ? (
                  <p>Nome: {toDelete?.name}</p>
                ) : (
                  <>
                    <p className="font-bold">
                      Você está prestes a apagar{" "}
                      {table.getSelectedRowModel().rows?.length} produtos.
                    </p>
                    <ul className="list-disc pl-4">
                      {table.getSelectedRowModel().rows?.map((row) => (
                        <li key={row.original._id?.$oid} className="">
                          {row.original.name}{" "}
                          {weightFormat(row.original.weight)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="mt-2 font-bold text-red-700">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </DialogHeader>
            <DialogFooter className="pt-2 flex items-end">
              <DialogClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    toDelete
                      ? deleteProductFn(toDelete._id?.$oid ?? "")
                      : deleteManyProductFn(
                          table
                            .getSelectedRowModel()
                            .rows?.map((row) => row.original._id?.$oid ?? "")
                        );
                  }}
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
              <DrawerTitle>
                Deseja remover {toDelete ? "esse produto" : "esses produtos"} ?
              </DrawerTitle>

              <div>
                {toDelete ? (
                  <p>Nome: {toDelete?.name}</p>
                ) : (
                  <>
                    <p className="font-bold">
                      Você está prestes a apagar{" "}
                      {table.getSelectedRowModel().rows?.length} produtos.
                    </p>
                    <ul className="list-disc pl-4">
                      {table.getSelectedRowModel().rows?.map((row) => (
                        <li key={row.original._id?.$oid} className="">
                          {row.original.name}{" "}
                          {weightFormat(row.original.weight)}
                        </li>
                      ))}
                    </ul>
                  </>
                )}

                <p className="mt-2 font-bold text-red-700">
                  Esta ação não pode ser desfeita.
                </p>
              </div>
            </DrawerHeader>
            <DrawerFooter className="pt-2 flex items-end">
              <DrawerClose asChild>
                <Button variant="outline">Cancelar</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button
                  variant="destructive"
                  onClick={() => {
                    toDelete
                      ? deleteProductFn(toDelete._id?.$oid ?? "")
                      : deleteManyProductFn(
                          table
                            .getSelectedRowModel()
                            .rows?.map((row) => row.original._id?.$oid ?? "")
                        );
                  }}
                >
                  Apagar para sempre
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
      {/* This component bellow is a custom menu with a search input and a
      dropdown menu to select which columns to show. And a button to open the
      drawer to create a new product. */}
      <div className="flex items-center justify-between py-4 gap-1">
        <Input
          placeholder="Filtre produtos..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-3">
          <OpenProductDrawerButton />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border p-1 hover:shadow-md duration-150 ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead> Options</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.original._id?.$oid}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <DotsHorizontalIcon className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setIsProductFormOpen(true);
                            setToEditProduct(row.original);
                          }}
                        >
                          Editar produto
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="dark:text-red-500 dark:hover:text-red-400
                          hover:text-red-500 text-red-600 "
                          onClick={() => {
                            setToDelete(row.original);
                            setOpen(true);
                          }}
                        >
                          Deletar produto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={productTableColumnsDef.length + 1}
                  className="h-16 text-center"
                >
                  Sem produtos
                </TableCell>
              </TableRow>
            )}
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={productTableColumnsDef.length + 1}
                    className="text-center"
                    key={index}
                  >
                    <Skeleton
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="w-full h-10 rounded-sm "
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <Button
          variant={"destructive"}
          disabled={table.getSelectedRowModel().rows?.length == 0}
          onClick={() => {
            setToDelete(undefined);
            setOpen(true);
          }}
        >
          Apagar produtos
        </Button>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

// This is a workaround to avoid rendering the table on the server
export default function Products() {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <ProductsTable />;
}
