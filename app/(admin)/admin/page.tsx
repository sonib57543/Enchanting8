"use client";

import { useState, useEffect } from "react";
import { getDashboardOverview } from "@/actions/adminActions";
import Link from "next/link";
import { MapPin, Package, Users, BookOpen, Eye, ArrowUpRight, Clock, MessageSquare, AlertCircle } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview().then((res) => {
      if (res.success) {
        setStats(res.data);
      } else {
        console.error(res.message);
      }
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-nature-500 space-y-4">
        <div className="w-8 h-8 rounded-full border-4 border-earth-200 border-t-earth-600 animate-spin"></div>
        <p className="font-bold animate-pulse">Aggregating Platform Analytics...</p>
      </div>
    );
  }

  const overviewCards = [
    { label: "Total Destinations", value: stats.cities, icon: MapPin, color: "bg-blue-50 text-blue-600", change: "Cities Monitored", positive: true },
    { label: "Tour Packages", value: stats.packages, icon: Package, color: "bg-earth-50 text-earth-600", change: "Uploaded", positive: true },
    { label: "Pending Vendors", value: stats.vendors.pending, icon: Users, color: "bg-amber-50 text-amber-600", change: "Needs review", positive: false },
    { label: "Blog Articles", value: stats.blogs, icon: BookOpen, color: "bg-purple-50 text-purple-600", change: "Published", positive: true },
    { label: "Total Enquiries", value: stats.enquiries.total, icon: MessageSquare, color: "bg-green-50 text-green-600", change: `${stats.enquiries.new} New Tickets`, positive: stats.enquiries.new === 0 },
  ];

  const quickActions = [
    { label: "Add Destination", href: "/admin/destinations", color: "bg-blue-600 hover:bg-blue-700" },
    { label: "Add Package", href: "/admin/packages", color: "bg-earth-500 hover:bg-earth-600" },
    { label: "Review Vendors", href: "/admin/vendors", color: "bg-amber-500 hover:bg-amber-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-nature-900">Dashboard</h1>
          <p className="text-nature-500 text-sm mt-0.5">Welcome back! Here&apos;s what&apos;s happening with Enchanting8.</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-nature-500 bg-white border border-nature-200 rounded-xl px-4 py-2 shadow-sm">
          <Clock className="w-4 h-4 text-earth-500" />
          <span>Last updated: Today, 10:38 AM</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {overviewCards.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-serif text-lg font-semibold text-nature-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          {quickActions.map(({ label, href, color }) => (
            <Link key={label} href={href} className={`${color} text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors`}>
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* Vendor & Infrastructure Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Vendor Distribution Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-xl font-bold text-nature-900 border-b-2 border-earth-500 pb-1">Vendor Network Health</h2>
            <Link href="/admin/vendors" className="text-sm font-bold text-earth-600 hover:text-earth-800 transition-colors">Manage →</Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-nature-50 rounded-2xl p-6 border border-nature-100 shadow-inner flex flex-col justify-center items-center">
              <span className="text-4xl font-black text-nature-900 mb-2">{stats.vendors.total}</span>
              <span className="text-sm font-bold text-nature-500 uppercase tracking-wider">Total Vendors</span>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="bg-green-50 rounded-2xl p-4 border border-green-100 flex items-center justify-between">
                <span className="text-xs font-bold text-green-700 uppercase">Approved</span>
                <span className="text-xl font-black text-green-800">{stats.vendors.approved}</span>
              </div>
              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 uppercase">Pending Review</span>
                <span className="text-xl font-black text-amber-800">{stats.vendors.pending}</span>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100 flex items-center justify-between">
                <span className="text-xs font-bold text-red-700 uppercase">Rejected</span>
                <span className="text-xl font-black text-red-800">{stats.vendors.rejected}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Modules Overview */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-xl font-bold text-nature-900 border-b-2 border-earth-500 pb-1">Platform Content</h2>
            <Link href="/admin/destinations" className="text-sm font-bold text-earth-600 hover:text-earth-800 transition-colors">Expand CMS →</Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-nature-900 leading-tight">City Destinations</h4>
                  <p className="text-xs text-nature-500 mt-1">Hierarchical Regional Mapping</p>
                </div>
              </div>
              <span className="text-2xl font-black text-blue-900">{stats.cities}</span>
            </div>

            <div className="flex items-center justify-between p-5 bg-purple-50/50 rounded-2xl border border-purple-100/50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-nature-900 leading-tight">Journal Entries (Blogs)</h4>
                  <p className="text-xs text-nature-500 mt-1">Stories and Ecosystem Guides</p>
                </div>
              </div>
              <span className="text-2xl font-black text-purple-900">{stats.blogs}</span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-earth-500 shrink-0 mt-0.5" />
              <p className="text-sm text-nature-600">
                You have <strong className="text-earth-700">{stats.enquiries.new} unresolved support tickets</strong> waiting in the Enquiries queue. Manage them promptly to maintain high user satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
