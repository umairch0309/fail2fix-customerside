import { Suspense } from "react";
import Signupform from "@/components/auth/signupform";

const Signup = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F15D1E]" />
        </div>
      }
    >
      <Signupform />
    </Suspense>
  );
};

export default Signup;
