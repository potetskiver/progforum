import Link from "next/link";
import { getUser } from "../lib/user";
import LogoutButton from "./LogoutButton";
import { useRouter } from "next/navigation";

export default async function Header() {
  const user = await getUser();

  const router = useRouter();

  const changePassword = () => {
    router.push("/changepassword");
  }

  return (
    <header className="bg-gray-800 text-white pl-4 pr-4 pt-1 flex items-center justify-between">
      <Link href="/" className="text-1xl font-bold">
        ProgForum
      </Link>

      {user ? (
        <div className="flex items-center">
          <span className="mr-4 text-1xl" onClick={changePassword}>
            Hello, {user.name}!
          </span>
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