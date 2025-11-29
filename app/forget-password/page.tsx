"use client";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
function Forget() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const handleSubmit = async () => {
    setPending(true);
    const res = await fetch("/api/auth/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email }),
    });
    const data = await res.json();
    if (res.ok) {
      toast.success(data.message);
      setPending(false);
      router.push("/sign-in")
    } else if (res.status === 404) {
      toast.error(data.message);
      setPending(false);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className=" justify-center m-3 py-5 w-full sm:w-1/2  lg:w-1/3">
        <div className=" flex justify-between items-center px-5">
          <Link href={"/"}>
            {" "}
            <Button variant={"outline"}>
              <House size={"20px"} />
            </Button>
          </Link>
          <ModeToggle />
        </div>
        <div className=" flex flex-col justify-center">
          <CardHeader className="text-center py-2">
            <CardTitle className="text-2xl">Forget password</CardTitle>
            <CardDescription>
              Enter your email and we’ll send you a link to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-3">
              <Input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />

              <Button className="w-full cursor-pointer" disabled={pending}>
                {pending ? <Spinner /> : <p>Continue</p>}
              </Button>
            </form>
          </CardContent>
          <div className="flex justify-center items-center">
            <Link
              href="/sign-in"
              className="text-sm mt-2 text-muted-foreground hover:text-foreground hover:underline transition-all"
            >
              Back to sign-in
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default Forget;
