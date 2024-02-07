import CreateUserForm from "@/components/CreateUserForm";
import UsersTable from "@/components/UsersTable";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col text items-center justify-between p-24 bg-zinc-50">
      <div className="lg:flex gap-4">
        <CreateUserForm />
        <UsersTable />
      </div>
    </main>
  );
}
