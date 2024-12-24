import { cookies } from "next/headers";

export const getCookie = async (name: string) => {
  const secureCookie = cookies().get(`__Secure-${name}`);
  if (secureCookie?.value) return secureCookie.value;

  return cookies().get(name)?.value ?? "";
};
