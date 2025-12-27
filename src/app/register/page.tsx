import { Metadata } from "next";
import { Suspense } from "react";
import Loading from "../loading";
import { RegisterForm } from "./_RegisterForm/RegisterForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register Page",
};

export default function Register() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <Suspense
          fallback={
            <div>
              <Loading></Loading>
            </div>
          }
        >
          <RegisterForm className="max-w-3xl w-full" />
        </Suspense>
      </div>
    </div>
  );
}
