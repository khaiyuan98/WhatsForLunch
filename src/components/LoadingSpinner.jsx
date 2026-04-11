export default function LoadingSpinner({ message = 'Searching for food nearby...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
      <p className="text-gray-500 text-lg">{message}</p>
    </div>
  );
}
