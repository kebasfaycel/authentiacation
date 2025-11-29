import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Spinner } from "./ui/spinner";
import { LogOut } from "lucide-react";
function User() {
  const handleSignOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/");
  };
  const { data: session, status } = useSession();
  const router = useRouter();
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <Spinner />
      </div>
    );
  }
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
  return (
    <div className="flex justify-center items-center h-screen p-4">
      {session ? (
        <div className="w-full h-screen flex flex-col justify-end items-start">
          <div className="border-2 w-full h-screen">

          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="flex justify-between gap-2  items-center m-2">
              <Avatar className="size-10 bg-accent">
                <AvatarImage src={session.user?.image || undefined} />
                <AvatarFallback>{avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1 items-start text-sm">
                <span>{session.user?.name}</span>
                <span>{session.user?.email}</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top">
              <DropdownMenuItem className="h-8" onClick={handleSignOut}>
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link href={"/sign-up"}>
            <Button>Sign up</Button>
          </Link>
          <Link href={"/sign-in"}>
            <Button variant={"outline"}>Sign In</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default User;
