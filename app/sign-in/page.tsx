"use client";
import { Button } from "@/components/ui/button";
import { FaGoogle } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { House } from "lucide-react";
import vector from "@/public/vector.svg";
import Image from "next/image";
import { motion } from "motion/react";
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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ModeToggle } from "@/components/ModeToggle";
function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [pending, setPending] = useState(false);
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (res?.ok) {
      router.push("/");
      toast.success("login successful");
      setPending(false);
    } else if (res?.error) {
      setPending(false);
      toast.error(res.error);
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full sm:w-2/3"
      >
        <Card className="flex-col justify-center m-3  w-full py-3">
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
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Sign In</CardTitle>
                <CardDescription>
                  Use email or service to sign in
                </CardDescription>
              </CardHeader>
              <CardContent className="">
                <form action={""} onSubmit={handleSubmit} className="space-y-3">
                  <div></div>
                  <Input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    disabled={pending}
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    disabled={pending}
                  />
                  <Button className="w-full" disabled={pending}>
                    Continue
                  </Button>
                  <Separator className="my-2" />
                  <div className="flex justify-center gap-1 *:w-1/2 *:text-primary *:border-primary">
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
                    Create new account
                    <Link
                      href={"/sign-up"}
                      className="text-primary font-medium underline"
                    >
                      Sign up
                    </Link>
                  </p>
                  <div className="flex justify-center items-center">
                    <Link
                      href="/forget-password"
                      className="text-sm mt-2 text-muted-foreground hover:text-foreground hover:underline transition-all"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </div>
            <div className="hidden md:flex md:flex-col justify-center items-center">
              <Image src={vector} alt="vector" className="w-[80%]" />
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default SignIn;
