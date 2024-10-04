"use client";

import React, { use, useEffect } from "react";
import { useSession } from "next-auth/react";

function ClientSession() {
  const { data: session, status, update } = useSession();

  console.log("===========CLIENT SESSION========");
  console.log(session);

  return <div></div>;
}

export default ClientSession;
