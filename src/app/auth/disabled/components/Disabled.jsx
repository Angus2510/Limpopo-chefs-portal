"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const Denied = ({ Reason }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const getEmailInfo = () => {
    if (Reason === 'Arrears Account') {
      return {
        heading: 'Portal Blocked',
        message: "Your portal is currently blocked because of outstanding fees. This means that you are currenty on-hold and can not attend classes. Please contact our finance department to settle your account.",
        email: 'finance@limpopochefs.co.za',
        whatsappMessage: 'Hello, I need assistance with my arrears account.'
      };
    }
    return {
      heading: 'Portal Disabled',
      message: `Your portal has been disabled due to: ${Reason}. Please contact support for more details.`,
      email: 'support@limpopochefs.co.za',
      whatsappMessage: `Hello, I need assistance with the following issue: ${Reason}.`
    };
  };

  const { heading, message, email, whatsappMessage } = getEmailInfo();

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
            {heading}
          </h4>
          <p className="mb-9 ml-1 text-base text-gray-600">
            {message}
          </p>
          <p className="mb-9 ml-1 text-base text-gray-600">
            Please contact <a href={`mailto:${email}`} className="text-blue-600 underline">{email}</a>.
          </p>
        </div>
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 w-full">
          <button
            onClick={() => window.location.href = `mailto:${email}`}
            className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white bg-gray-600 hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Email
          </button>
          <button
            onClick={() => window.location.href = `https://wa.me/27761912732?text=${encodeURIComponent(whatsappMessage)}`} 
            className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white bg-green-600 hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            WhatsApp
          </button>
          <button
            onClick={logout}
            className="flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold leading-6 text-white bg-red-600 hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
          >
            Sign Out
          </button>
        </div>
        <div className="mt-10">
          <Image
            src="/img/auth/sponsors.jpg"
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
