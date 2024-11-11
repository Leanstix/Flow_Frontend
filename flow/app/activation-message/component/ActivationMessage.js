"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ActivationMessage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect the user after some time (e.g., 10 seconds) to the home page or login page
    const timer = setTimeout(() => {
      router.push('/login');  // Redirect to login page (you can adjust this)
    }, 10000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="w-96 p-6 shadow-2xl bg-white rounded-[30px]">
        <h1 className="text-3xl block text-center font-semibold">Account Activation</h1>
        <hr className="mt-3" />
        <p className="text-center text-lg mt-5">
          Thank you for signing up! Please check your email for the activation link to activate your account.
        </p>
        <p className="text-center text-sm mt-3 text-gray-500">
          You will be automatically redirected to the login page in a few seconds.
        </p>
      </div>
    </div>
  );
};

export default ActivationMessage;
