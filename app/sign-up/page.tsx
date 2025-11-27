"use client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import vector from "@/public/vector.svg";
import { House } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/ModeToggle";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { signIn } from "next-auth/react";
import { Spinner } from "@/components/ui/spinner";
function SignUp() {
  const handleProvider = (
    event: React.MouseEvent<HTMLButtonElement>,
    value: "github" | "google"
  ) => {
    event.preventDefault();
    toast.loading(
      `Redirecting you to ${value.charAt(0).toUpperCase() + value.slice(1)}…`
    );
    signIn(value, { callbackUrl: "/" });
  };
  const [form, setform] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setPending(false);
      toast.success(data.message);
      const email = form.email;
      const password = form.password;
      await signIn("credentials", {
        redirect: true,
        email,
        password,
        callbackUrl: "/",
      });
    } else if (res.status === 400) {
      setError(data.message);
      setPending(false);
      toast.error(data.message);
    } else if (res.status === 500) {
      setError(data.message);
      setPending(false);
      toast.error(data.message);
    }
  };
  const [pending, setPending] = useState(false);
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className=" justify-center m-3  w-full sm:w-2/3 py-5">
        <div className=" flex justify-between items-center px-5">
          <Link href={"/"}>
            {" "}
            <Button variant={"outline"}>
              <House size={"20px"} />
            </Button>
          </Link>
          <ModeToggle />
        </div>
        <div className="flex *:md:w-1/2 ">
          <div className=" flex flex-col justify-center">
            <CardHeader className="text-center py-2">
              <CardTitle className="text-2xl">Sign Up</CardTitle>
              <CardDescription>
                Use email or service to create account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={""} onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Full Name"
                  required
                  value={form.name}
                  onChange={(e) => {
                    setform({ ...form, name: e.target.value });
                  }}
                  disabled={pending}
                />
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={(e) => {
                    setform({ ...form, email: e.target.value });
                  }}
                  disabled={pending}
                />
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  value={form.password}
                  onChange={(e) => {
                    setform({ ...form, password: e.target.value });
                  }}
                  disabled={pending}
                />
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  value={form.confirmPassword}
                  onChange={(e) => {
                    setform({ ...form, confirmPassword: e.target.value });
                  }}
                  disabled={pending}
                />
                <Button className="w-full" disabled={pending}>
                  {pending ? <Spinner /> : <p>Continue</p>}
                </Button>
              </form>
              <Separator className="my-2" />
              <div className="flex justify-center gap-1 *:w-1/2 *:text-primary  *:border-[1px] *:border-primary">
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    handleProvider(e, "google");
                  }}
                >
                  <FaGoogle />
                </Button>
                <Button
                  variant={"outline"}
                  onClick={(e) => {
                    handleProvider(e, "github");
                  }}
                >
                  <FaGithub />
                </Button>
              </div>
              <p className="text-sm flex justify-between mt-2 text-muted-foreground">
                Already have an account?
                <Link
                  href={"/sign-in"}
                  className=" underline text-primary font-medium"
                >
                  Sign in
                </Link>
              </p>
            </CardContent>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <Image src={vector} alt="vector" className="w-[80%]" />
          </div>
        </div>
      </Card>
    </div>
  );
}

export default SignUp;
