
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function UnifiedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full px-4 py-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}
