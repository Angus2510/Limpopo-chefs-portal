"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRequestPasswordResetMutation } from "@/lib/features/auth/resetPasswordApiSlice";

export default function ResetPage() {
  const [email, setEmail] = useState<string>(""); // Changed to "email"
  const [requestPasswordReset] = useRequestPasswordResetMutation();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value); // Updated
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await requestPasswordReset({ email }).unwrap(); // Passes "email" instead of "identifier"
      alert("Password reset link sent!");
    } catch (err) {
      console.error("Failed to send reset link:", err);
      alert("Error sending reset link.");
    }
  };

  return (
    <div className="mt-3 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <Image
          src="/img/logo.png"
          width={200}
          height={200}
          alt="Sponsors"
          className="mb-10 ml-auto mr-auto"
        />
        <div className="text-center">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Student Portal
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your email to reset your password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email" // Changed to "email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                id="email" // Changed to "email"
                name="email"
                type="text"
                value={email} // Updated
                onChange={handleChange}
                autoComplete="off"
                required
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Send link to email
            </button>
          </div>
          <div>
            <Image
              src="/img/auth/sponsors.png"
              width={500}
              height={500}
              alt="Sponsors"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
