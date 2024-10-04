import React from "react";
import { auth } from "@/auth";

async function ServerSession() {
  const session = await auth();
  console.log("===========SERVER SESSION========");
  console.log(session);

  return <div></div>;
}

export default ServerSession;
