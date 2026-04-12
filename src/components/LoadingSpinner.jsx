export default function LoadingSpinner({ message = 'Searching for food nearby...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5 animate-fade-in-up">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-stone-200 dark:border-neutral-800 rounded-full" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
      </div>
      <p className="text-stone-500 dark:text-neutral-500 text-lg font-medium">{message}</p>
    </div>
  );
}
