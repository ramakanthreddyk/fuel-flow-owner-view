
import Sidebar from "@/components/Sidebar";

export default function UnifiedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />
      <main className="flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  );
}
