export default function ErrorBox({ message, onRetry }) {
  return (
    <div className="rounded-lg border border-red-900 bg-red-950/50 p-5 text-center">
      <p className="text-red-300">⚠️ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium hover:bg-red-500"
        >
          Try again
        </button>
      )}
    </div>
  );
}
