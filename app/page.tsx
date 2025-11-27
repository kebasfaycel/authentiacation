"use client";
import { SessionProvider } from "next-auth/react";
import User from "@/components/User";

function page() {
  return (
    <div>
      <SessionProvider>
        {" "}
        <User />
      </SessionProvider>
    </div>
  );
}

export default page;
