import React from 'react';
import Link from 'next/link';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black text-orange-500 flex flex-col items-center justify-center p-6">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl mb-2 text-orange-300">Page Not Found</h2>
      <p className="text-white mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <span className="inline-block text-white font-semibold px-6 py-2 rounded cursor-pointer transition hover:underline">
          Go Home
        </span>
      </Link>
    </div>
  );
};

export default NotFound;
