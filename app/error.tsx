'use client';

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <span className="text-8xl font-bold text-red-400">500</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">오류가 발생했습니다</h1>
      <p className="mt-3 text-gray-500">일시적인 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.</p>
      <button onClick={reset} className="mt-8 rounded-xl bg-ocean-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-ocean-600">
        다시 시도
      </button>
    </div>
  );
}
