"use client";

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r text-center">
      <div className="animate-bounce text-9xl mb-8">🚫</div>

      <div className="animate-fadeIn mb-4">
        <h1 className="text-6xl font-extrabold mb-2">
          Oops! You&apos;re Not Allowed Here!
        </h1>
      </div>

      <p className="animate-slideIn text-xl mb-6">
        You don&apos;t have the proper clearance to enter this area.
        <br />
        It&apos;s like trying to access Area 51 with a library card.
      </p>

      <Link href="/customers">
        <div className="animate-bounce-slow mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer">
          Take Me Home!
        </div>
      </Link>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceSlow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1.5s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 1.5s ease-in-out;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2.5s infinite;
        }
      `}</style>
    </div>
  );
}
