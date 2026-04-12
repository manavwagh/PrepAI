import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
      <SignUp />
    </div>
  );
}
