import Sidebar from '@/components/admin/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 font-[family-name:var(--font-pretendard)]">
      <Sidebar />
      <div className="pl-60">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/95 px-8 backdrop-blur-sm">
          <div />
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">관리자</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-xs font-semibold text-gray-600">A</div>
          </div>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
