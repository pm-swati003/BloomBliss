import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-8xl font-bold text-[#E91E8C] mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-[#1F2937] mb-2">
          Page not found
        </h2>
        <p className="text-[#6B7280] mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-[#E91E8C] text-white rounded-lg"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
