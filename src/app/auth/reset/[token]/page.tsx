"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRequestPasswordResetMutation } from "@/lib/features/auth/resetPasswordApiSlice";
import Image from "next/image";

interface ResetPasswordPageProps {
  params: {
    token: string;
  };
}

const ResetPasswordPage: React.FC<ResetPasswordPageProps> = ({
  params,
}: {
  params: { token: string };
}) => {
  const token = params.token;
  console.log(token);
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [confirmPasswordReset] = useRequestPasswordResetMutation();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      token: token,
      password: password,
    };

    try {
      await confirmPasswordReset({ data: payload });
      alert("Password reset successful");
      router.push("/auth/signin");
    } catch (err) {
      console.error("Failed to reset password:", err);
      alert("Error resetting password.");
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
            Reset Password
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Enter your new password.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              New Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="off"
                required
                className="block w-full rounded-md border-0 px-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Confirm New Password
            </label>
            <div className="mt-2">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
