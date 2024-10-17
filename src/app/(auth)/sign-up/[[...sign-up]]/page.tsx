import { SignUp } from "@clerk/nextjs";

export default function Page() {
  console.log("at sign-up page");

  return (
    <div className="min-h-screen  flex justify-center items-center h-16  text-white">
      <div className="">
        <SignUp />
      </div>
    </div>
  );
}
