"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const Denied = () => {
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <Image
          src="/img/logo.png"
          width={250}
          height={250}
          alt="logo"
          className="mb-16 ml-auto mr-auto"
        />
        <div className="text-center mb-8">
          <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
            Access Denied
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            You are logged in but you don&apos;t have access to this page.
          </p>
        </div>
        <div className="space-y-6">
          <button
            onClick={goBack}
            className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Go Back
          </button>
        </div>
        <div className="mt-10">
          <Image
            src="/img/auth/sponsors.png"
            width={500}
            height={500}
            alt="Sponsors"
          />
        </div>
      </div>
    </div>
  );
};

export default Denied;
