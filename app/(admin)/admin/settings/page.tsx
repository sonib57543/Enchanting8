"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { User, Shield, Key } from "lucide-react";
import { changeAdminPassword } from "@/actions/passwordActions";

export default function AdminSettings() {
  const { data: session } = useSession();
  const user = session?.user;

  // Password State
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      setMessage({ text: "New passwords do not match.", type: "error" });
      return;
    }
    if (newPass.length < 8) {
      setMessage({ text: "New password must be at least 8 characters.", type: "error" });
      return;
    }
    if (!user?.email) {
      setMessage({ text: "Session error. Please re-login.", type: "error" });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: "", type: "" });

    const res = await changeAdminPassword(user.email, currentPass, newPass);
    if (res.success) {
      setMessage({ text: res.message || "Password successfully changed.", type: "success" });
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } else {
      setMessage({ text: res.error || "Password change failed.", type: "error" });
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-nature-900">Settings</h1>
        <p className="text-nature-500 text-sm mt-0.5">Manage your account and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl border border-nature-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-nature-50 bg-nature-50/50 flex items-center gap-2">
              <User className="w-4 h-4 text-earth-500" />
              <h2 className="font-bold text-nature-900">Profile Information</h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-nature-500 uppercase tracking-wider">Full Name</label>
                  <p className="text-sm font-medium text-nature-900">{user?.name}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-nature-500 uppercase tracking-wider">Email Address</label>
                  <p className="text-sm font-medium text-nature-900">{user?.email}</p>
                </div>
              </div>
              <button className="text-sm text-earth-600 font-bold hover:underline">Edit Profile</button>
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-white rounded-2xl border border-nature-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-nature-50 bg-nature-50/50 flex items-center gap-2">
              <Key className="w-4 h-4 text-earth-500" />
              <h2 className="font-bold text-nature-900">Change Password</h2>
            </div>
            <div className="p-6">
              <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
                <div>
                  <label className="text-xs font-bold text-nature-500 uppercase tracking-wider mb-1 block">Current Password</label>
                  <input 
                    type="password" 
                    required 
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-earth-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-nature-500 uppercase tracking-wider mb-1 block">New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-earth-500" 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-nature-500 uppercase tracking-wider mb-1 block">Confirm New Password</label>
                  <input 
                    type="password" 
                    required 
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="w-full bg-nature-50 border border-nature-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-earth-500" 
                  />
                </div>

                {message.text && (
                  <div className={`p-3 rounded-xl text-sm font-bold ${message.type === 'error' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                    {message.text}
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-nature-900 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-earth-50 rounded-2xl p-6 border border-earth-100">
            <h3 className="font-serif text-lg font-bold text-nature-900 mb-2">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                 <span className="text-nature-600">Frontend API</span>
                 <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                 <span className="text-nature-600">Admin Service</span>
                 <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-[10px] font-bold">ACTIVE</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
