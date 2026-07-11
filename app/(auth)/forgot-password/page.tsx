import { Suspense } from "react";
import Forgotpasswordform from "@/components/auth/forgotpasswordform";

const Forgotpasword = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F15D1E]" />
        </div>
      }
    >
      <Forgotpasswordform />
    </Suspense>
  );
};

export default Forgotpasword;
