"use client";
import Link from "next/link";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import { ToggleThemeButton } from "../ToggleThemeButton";

export default function Header() {
  const path = usePathname();
  return (
    <header className="flex items-center justify-between p-4 border-b hover:shadow-sm">
      <h1 className="text-2xl font-bold">
        {path.length == 1
          ? "Home"
          : path.charAt(1).toUpperCase() + path.slice(2)}
      </h1>
      <ul className="flex items-center gap-4">
        <li>
          <ToggleThemeButton />
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/">Home</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/products">Products</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/register">Register</Link>
          </Button>
        </li>
        <li>
          <Button asChild variant="link">
            <Link href="/login">Login</Link>
          </Button>
        </li>
      </ul>
    </header>
  );
}
