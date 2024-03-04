import { ProductDrawer } from "@/components/ProductCreateForm";
import ProductsTable from "@/components/ProductsTable";
import { getToken } from "../actions";
import { redirect } from "next/navigation";

export default async function Products() {
  const token = await getToken();
  if (token?.value !== "to_implement") {
    redirect("/login");
  }
  return (
    <main className="min-h-screen text items-center justify-between px-12 py-6">
      <div className="lg:flex gap-4">
        <ProductsTable />
        <ProductDrawer />
      </div>
    </main>
  );
}
