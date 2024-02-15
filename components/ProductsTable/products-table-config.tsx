import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { ProductStruct } from "@/lib/APIFunctions/types-product-api";
import { Button } from "../ui/button";
import { DollarSign } from "lucide-react";
import weightFormat from "@/lib/weightFormat";

export const productTableColumnsDef: ColumnDef<ProductStruct, any>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "weight",
    header: "Peso",
    cell: ({ row }) => {
      const weight = weightFormat(parseFloat(row.getValue("weight")));
      return <div>{weight}</div>;
    },
  },
  {
    accessorKey: "price",
    header: ({ column }) => {
      return (
        <div className="flex">
          <Button
            className="m-auto"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Preço
            <DollarSign className="ml-1 h-4 w-4" />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => (
      <div className="text-center">
        {parseFloat(row.getValue("price")).toLocaleString("en-US", {
          style: "currency",
          currency: "BRL",
          minimumFractionDigits: 2,
        })}
      </div>
    ),
  },
  {
    id: "quantity",
    accessorKey: "quantity",
    header: () => <div className="text-left">Quantidade</div>,
    cell: ({ row }) => {
      return (
        <div className="text-left font-medium">{row.getValue("quantity")}</div>
      );
    },
  },
];
