import UserRegisterForm from "@/components/UserRegisterForm";
import { Toaster } from "@/components/ui/sonner";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen  flex-col text items-center justify-between px-12 py-6">
      <UserRegisterForm />
      <Toaster />
    </main>
  );
}
