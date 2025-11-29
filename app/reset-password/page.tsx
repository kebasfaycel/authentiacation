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
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
function SignUp() {
  const token = useSearchParams().get("token");

  interface form {
    password: string;
    confirmPassword: string;
  }
  const [form, setForm] = useState<form>({ password: "", confirmPassword: "" });
  const [pending, setPending] = useState(false);
  const handleSubmit = async () => {
    const password = form.password;
    const confirmPassword = form.confirmPassword;
    const res = await fetch("/api/auth/reset", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, confirmPassword, token }),
    });
    const data = await res.json();
    setPending(true);
    if (res.ok) {
      toast.success(data.message);
      setPending(false);
    } else if (res.status === 400) {
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
            <CardTitle className="text-2xl"> Reset Password</CardTitle>
            <CardDescription>Enter a new password</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={handleSubmit} className="space-y-3">
              <Input
                type="password"
                placeholder="Password"
                required
                value={form.password}
                onChange={(e) => {
                  setForm({ ...form, password: e.target.value });
                }}
              />
              <Input
                type="password"
                placeholder="Confirm Password"
                required
                value={form.confirmPassword}
                onChange={(e) => {
                  setForm({ ...form, confirmPassword: e.target.value });
                }}
              />
              <Button className="w-full" disabled={pending}>
                {pending ? <Spinner /> : <p> Reset Password</p>}
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

export default SignUp;
