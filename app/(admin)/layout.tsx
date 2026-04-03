"use client";
import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-nature-50 font-sans">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 bg-nature-900 text-white z-50 flex items-center justify-between px-4 shadow-md">
        <div className="font-serif font-bold text-lg">Enchanting8 Admin</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 bg-nature-800 rounded-lg text-white hover:bg-nature-700">
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen pt-16 lg:pt-0">
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full max-w-[100vw]">{children}</main>
      </div>
    </div>
  );
}
