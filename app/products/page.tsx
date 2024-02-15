import { ProductDrawer } from "@/components/ProductCreateForm";
import ProductsTable from "@/components/ProductsTable";

export default function Products() {
  return (
    <main className=" min-h-screen text items-center justify-between px-12 py-6">
      <div className="lg:flex gap-4">
        <ProductsTable />
        <ProductDrawer />
      </div>
    </main>
  );
}
