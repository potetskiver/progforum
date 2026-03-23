"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
    >
      Logout
    </button>
  );
}