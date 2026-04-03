"use client";

import { useState, useEffect } from "react";
import { getEnquiries, updateEnquiryStatus, deleteEnquiry } from "@/actions/enquiryActions";
import { Search, Mail, Phone, MapPin, SearchX, CheckCircle, Clock, MoreVertical, Trash2 } from "lucide-react";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const loadEnquiries = async () => {
    setLoading(true);
    const data = await getEnquiries();
    setEnquiries(data);
    setLoading(false);
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    await updateEnquiryStatus(id, status);
    loadEnquiries();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      await deleteEnquiry(id);
      loadEnquiries();
    }
  };

  const filtered = enquiries.filter(e => {
    const matchStatus = filter === "ALL" || e.status === filter;
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || 
                        e.email.toLowerCase().includes(search.toLowerCase()) ||
                        e.message.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-nature-900">Enquiries & Contact</h1>
          <p className="text-nature-500 text-sm mt-0.5">Manage customer questions, support tickets, and leads.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-nature-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tickets..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-nature-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earth-500 w-full sm:w-64"
            />
          </div>
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-nature-200 rounded-xl px-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-earth-500 font-medium text-nature-700"
          >
            <option value="ALL">All Status</option>
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-nature-500 space-y-4">
          <div className="w-8 h-8 rounded-full border-4 border-earth-200 border-t-earth-600 animate-spin"></div>
          <p className="font-bold animate-pulse">Loading tickets...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-nature-200 p-16 flex flex-col items-center justify-center text-center">
          <SearchX className="w-12 h-12 text-nature-300 mb-4" />
          <h3 className="text-xl font-serif font-bold text-nature-900 mb-2">No Enquiries Found</h3>
          <p className="text-nature-500">There are no contact form submissions matching this filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((enquiry) => (
            <div key={enquiry.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row">
              {/* Ticket Left Status Bar */}
              <div className={`w-1.5 shrink-0 ${
                enquiry.status === "NEW" ? "bg-amber-400" :
                enquiry.status === "IN_PROGRESS" ? "bg-blue-400" :
                "bg-green-400"
              }`} />
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-nature-900 text-lg">{enquiry.name}</h3>
                      <div className="flex flex-wrap gap-4 text-xs text-nature-500 mt-2">
                        <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {enquiry.email}</span>
                        {enquiry.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {enquiry.phone}</span>}
                        <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Subject: {enquiry.destination}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {new Date(enquiry.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      enquiry.status === "NEW" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                      enquiry.status === "IN_PROGRESS" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                      "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {enquiry.status}
                    </span>
                  </div>
                  
                  <div className="bg-nature-50/50 rounded-xl p-4 border border-nature-100 mb-4">
                    <p className="text-nature-700 text-sm whitespace-pre-wrap">{enquiry.message}</p>
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="bg-nature-50/30 border-t lg:border-t-0 lg:border-l border-gray-100 p-6 flex flex-row lg:flex-col justify-end lg:justify-center gap-3 shrink-0 lg:w-48">
                {enquiry.status === "NEW" && (
                  <button onClick={() => handleStatusChange(enquiry.id, "IN_PROGRESS")} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                    Mark In Progress
                  </button>
                )}
                {(enquiry.status === "NEW" || enquiry.status === "IN_PROGRESS") && (
                  <button onClick={() => handleStatusChange(enquiry.id, "RESOLVED")} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" /> Resolve
                  </button>
                )}
                {enquiry.status === "RESOLVED" && (
                   <button onClick={() => handleStatusChange(enquiry.id, "IN_PROGRESS")} className="flex-1 bg-white hover:bg-nature-100 text-nature-700 border border-nature-200 text-xs font-bold py-2.5 rounded-xl transition-colors">
                    Reopen Ticket
                 </button>
                )}
                <button onClick={() => handleDelete(enquiry.id)} className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 py-2.5 rounded-xl transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
