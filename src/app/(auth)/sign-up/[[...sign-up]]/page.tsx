import { SignUp } from "@clerk/nextjs";

export default function Page() {
  console.log("at sign-up page");

  return <SignUp />;
}
