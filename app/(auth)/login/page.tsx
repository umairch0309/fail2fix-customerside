import { Suspense } from "react";
import Loginform from "@/components/auth/loginform";

const Login = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[200px]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F15D1E]" /></div>}>
      <Loginform />
    </Suspense>
  );
};

export default Login;
