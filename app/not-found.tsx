"use client";

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r text-center">
      <div className="animate-spin-slow text-9xl mb-8">🚀</div>

      <div className="animate-fadeIn mb-4">
        <h1 className="text-6xl font-extrabold mb-2">Oops! Page Not Found!</h1>
      </div>

      <p className="animate-slideIn text-xl mb-6">
        Looks like you got lost in space.
        <br />
        The page you’re looking for doesn’t exist!
      </p>

      <Link href="/customers">
        <div className="animate-bounce-slow mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-full shadow-lg transition-transform transform hover:scale-110 cursor-pointer">
          Back to Safety
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

        @keyframes spinSlow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
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

        .animate-spin-slow {
          animation: spinSlow 4s linear infinite;
        }
      `}</style>
    </div>
  );
}
