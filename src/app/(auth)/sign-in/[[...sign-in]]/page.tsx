import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="min-h-screen  flex justify-center items-center h-16  text-white">
      <SignIn />
    </div>
  );
}
