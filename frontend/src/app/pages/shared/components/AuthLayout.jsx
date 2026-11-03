export function AuthLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#FFF5F7] flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
