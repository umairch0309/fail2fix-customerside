import { Suspense } from "react";
import VerifyEmailForm from "@/components/auth/verifyemailform";

const VerifyEmail = () => {
  return (
    <Suspense fallback={<div className="w-full max-w-md animate-pulse" />}>
      <VerifyEmailForm />
    </Suspense>
  );
};

export default VerifyEmail;
