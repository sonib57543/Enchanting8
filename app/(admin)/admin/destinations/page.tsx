"use client";

import { MapPin, Lock, Info } from "lucide-react";
import { cities } from "@/data/mock";
import Link from "next/link";

// ── Static master city list derived from mock data ────────────────────────────
// No DB queries needed — cities are fixed and never change.
const stateGroups = cities.reduce<Record<string, typeof cities>>((acc, city) => {
  if (!acc[city.state]) acc[city.state] = [];
  acc[city.state].push(city);
  return acc;
}, {});

export default function DestinationsManager() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-bold text-nature-900">Destinations Directory</h1>
        <p className="text-nature-500 text-sm mt-0.5">
          The platform operates on <strong>{cities.length} fixed cities</strong> across North East India.
          These are used across Vendors, Blogs, and Packages.
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="font-bold text-blue-900 mb-1">Fixed City System — Read Only</h2>
          <p className="text-sm text-blue-700 leading-relaxed">
            Destination data is managed as static master data. Adding or removing cities is done only by
            the development team. This keeps content consistent and prevents accidental data loss.
          </p>
          <p className="text-sm text-blue-600 mt-2 font-medium">
            To add a new destination, contact the technical team.
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-earth-600">{cities.length}</p>
          <p className="text-xs text-nature-500 font-medium uppercase tracking-wider mt-1">Total Cities</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-earth-600">{Object.keys(stateGroups).length}</p>
          <p className="text-xs text-nature-500 font-medium uppercase tracking-wider mt-1">States</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-earth-600">{cities.filter(c => c.featured).length}</p>
          <p className="text-xs text-nature-500 font-medium uppercase tracking-wider mt-1">Featured</p>
        </div>
        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-earth-600">{cities.filter(c => c.permitRequired).length}</p>
          <p className="text-xs text-nature-500 font-medium uppercase tracking-wider mt-1">Permit Required</p>
        </div>
      </div>

      {/* City Directory grouped by State */}
      {Object.entries(stateGroups).map(([state, stateCities]) => (
        <div key={state} className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-nature-50/50 flex items-center gap-3">
            <MapPin className="w-5 h-5 text-earth-500" />
            <h2 className="font-bold text-nature-900">{state}</h2>
            <span className="ml-auto text-xs text-nature-500 font-medium">{stateCities.length} {stateCities.length === 1 ? "city" : "cities"}</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">City</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider hidden sm:table-cell">Slug</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">Tags</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-nature-500 uppercase tracking-wider">View Page</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stateCities.map((city) => (
                <tr key={city.id} className="hover:bg-nature-50/50">
                  <td className="px-6 py-4">
                    <p className="font-bold text-nature-900">{city.name}</p>
                    <p className="text-xs text-nature-500 mt-0.5 line-clamp-1">{city.shortDescription}</p>
                  </td>
                  <td className="px-6 py-4 text-nature-500 font-mono text-xs hidden sm:table-cell">/destinations/{city.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {city.featured && (
                        <span className="bg-earth-100 text-earth-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Featured</span>
                      )}
                      {city.permitRequired && (
                        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">ILP Required</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/destinations/${city.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-earth-600 hover:text-earth-800 transition-colors hover:underline"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Helpful Info */}
      <div className="bg-nature-50 border border-nature-200 rounded-2xl p-5 flex items-start gap-4">
        <Info className="w-5 h-5 text-nature-500 shrink-0 mt-0.5" />
        <div className="text-sm text-nature-600">
          <strong className="text-nature-800">Using cities in other modules:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>When creating a <strong>Blog</strong>, select a city to attach it to that destination page</li>
            <li>When registering a <strong>Vendor</strong>, they select their operating city during onboarding</li>
            <li>When creating a <strong>Package</strong>, the primary city determines the destination page listing</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
