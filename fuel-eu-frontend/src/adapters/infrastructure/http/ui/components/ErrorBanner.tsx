export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-2 rounded">
      {message}
    </div>
  );
}
