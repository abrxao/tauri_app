import UserLoginForm from "@/components/UserLoginForm";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="flex min-h-screen  flex-col text items-center justify-between px-12 py-6">
      <div className="lg:flex gap-4">
        <UserLoginForm />
      </div>
      <Toaster />
    </main>
  );
}
