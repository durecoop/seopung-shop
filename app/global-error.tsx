'use client';

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="ko">
      <body className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <span className="text-8xl font-bold text-red-400">500</span>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">심각한 오류가 발생했습니다</h1>
        <p className="mt-3 text-gray-500">잠시 후 다시 시도해 주세요.</p>
        <button onClick={reset} className="mt-8 rounded-xl bg-blue-500 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-600">
          다시 시도
        </button>
      </body>
    </html>
  );
}
