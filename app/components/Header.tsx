import Link from "next/link";
import { getUser } from "../lib/user-server";
import LogoutButton from "./LogoutButton";

export default async function Header() {
  const user = await getUser();

  return (
    <header className="bg-gray-800 text-white pl-4 pr-4 pt-1 flex items-center justify-between">
      <Link href="/" className="text-1xl font-bold">
        ProgForum
      </Link>

      {user ? (
        <div className="flex items-center mt-2">
          {user.admin && (
            <Link href="/admin" className="underline text-red-400">
              Admin
            </Link>
          )}
          <Link href="/changepassword" className="text-1xl">
            <span className="mr-2 ml-2 text-1xl">
              Hello, {user.name}!
            </span>
          </Link>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex gap-4 text-1xl">
          <Link className="underline" href="/login">
            Login
          </Link>
          <Link className="underline" href="/register">
            Register
          </Link>
        </div>
      )}
    </header>
  );
}