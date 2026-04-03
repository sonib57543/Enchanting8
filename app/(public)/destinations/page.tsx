"use client";

import { useState, useMemo } from "react";
import { cities } from "@/data/mock";
import { DestinationCard } from "@/components/cards/DestinationCard";
import { ArrowLeft, MapPin, ChevronRight } from "lucide-react";
import { City } from "@/types";

// ── Derive unique states with metadata ─────────────────────────────────────────
const stateHeroImages: Record<string, string> = {
  "Arunachal Pradesh":
    "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop&q=80",
  Assam:
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&auto=format&fit=crop&q=80",
  Meghalaya:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop&q=80",
  Mizoram:
    "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&auto=format&fit=crop&q=80",
  Nagaland:
    "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=800&auto=format&fit=crop&q=80",
  Manipur:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80",
  Sikkim:
    "https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&auto=format&fit=crop&q=80",
  Tripura:
    "https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&auto=format&fit=crop&q=80",
};

const stateDescriptions: Record<string, string> = {
  "Arunachal Pradesh": "The Land of the Rising Sun – alpine valleys, tribes & monasteries.",
  Assam: "Gateway to the Northeast – wildlife, tea gardens & the Brahmaputra.",
  Meghalaya: "The Abode of Clouds – living root bridges, waterfalls & caves.",
  Mizoram: "The Land of the Highlanders – rolling hills, falls & Mizo culture.",
  Nagaland: "Land of Festivals – Hornbill festival, warrior tribes & misty peaks.",
  Manipur: "The Jewel of India – pristine lakes, classical dance & virgin forests.",
  Sikkim: "The Hidden Himalayan Kingdom – monasteries, snow peaks & high passes.",
  Tripura: "City of Palaces – ancient temples, royal heritage & lush forests.",
};

function buildStates() {
  const map: Record<string, City[]> = {};
  cities.forEach((c) => {
    if (!map[c.state]) map[c.state] = [];
    map[c.state].push(c);
  });
  return Object.entries(map).map(([state, citiesArr]) => ({
    state,
    cities: citiesArr,
    heroImage:
      stateHeroImages[state] || citiesArr[0].heroImage,
    description: stateDescriptions[state] || "",
  }));
}

const stateList = buildStates();

export default function DestinationsListing() {
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const filteredCities = useMemo(
    () => (selectedState ? cities.filter((c) => c.state === selectedState) : []),
    [selectedState]
  );

  const currentState = selectedState
    ? stateList.find((s) => s.state === selectedState)
    : null;

  return (
    <div className="min-h-screen bg-nature-50">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="bg-nature-900 text-white py-16 px-4 text-center">
        {selectedState ? (
          <>
            <p className="text-earth-300 text-sm uppercase tracking-widest mb-2 font-medium">
              Explore Destinations
            </p>
            <h1 className="text-4xl md:text-5xl font-serif mb-3">
              {selectedState}
            </h1>
            <p className="text-nature-300 max-w-xl mx-auto text-base">
              {currentState?.description}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-serif mb-4">
              Explore Destinations
            </h1>
            <p className="text-nature-300 max-w-2xl mx-auto text-lg">
              Choose a state to discover its hidden treasures across North East
              India.
            </p>
          </>
        )}
      </div>

      <div className="page-container py-12">
        {/* ── STATE CARDS VIEW ─────────────────────────────────────────── */}
        {!selectedState && (
          <>
            <p className="text-sm text-nature-500 mb-8 font-medium">
              {stateList.length} states · {cities.length} destinations
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {stateList.map(({ state, cities: stateCities, heroImage, description }) => (
                <button
                  key={state}
                  onClick={() => setSelectedState(state)}
                  className="group text-left block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-earth-500 rounded-2xl"
                >
                  <div className="relative overflow-hidden rounded-2xl shadow-sm border border-nature-100 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                    {/* State Hero Image */}
                    <div className="relative h-44 w-full overflow-hidden shrink-0">
                      <div
                        className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                        style={{ backgroundImage: `url('${heroImage}')` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-nature-900/70 via-black/20 to-transparent" />
                      {/* City count badge */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-nature-800 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
                        {stateCities.length}{" "}
                        {stateCities.length === 1 ? "City" : "Cities"}
                      </div>
                    </div>

                    {/* State Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h2 className="font-serif text-lg font-semibold text-nature-900 group-hover:text-nature-600 transition-colors leading-tight">
                          {state}
                        </h2>
                        <ChevronRight className="w-5 h-5 text-earth-500 shrink-0 group-hover:translate-x-1 transition-transform mt-0.5" />
                      </div>
                      <p className="text-xs text-nature-500 line-clamp-2 flex-1">
                        {description}
                      </p>
                      {/* City name pills */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {stateCities.slice(0, 3).map((c) => (
                          <span
                            key={c.id}
                            className="flex items-center gap-1 text-xs bg-earth-50 text-earth-700 border border-earth-200 px-2 py-0.5 rounded-full font-medium"
                          >
                            <MapPin className="w-2.5 h-2.5" />
                            {c.name}
                          </span>
                        ))}
                        {stateCities.length > 3 && (
                          <span className="text-xs bg-nature-100 text-nature-600 px-2 py-0.5 rounded-full font-medium">
                            +{stateCities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </>
        )}

        {/* ── CITY CARDS VIEW (after state selected) ─────────────────── */}
        {selectedState && (
          <>
            {/* Back button */}
            <button
              onClick={() => setSelectedState(null)}
              className="inline-flex items-center gap-2 text-nature-600 hover:text-earth-600 mb-8 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all States
            </button>

            <p className="text-sm text-nature-500 mb-8 font-medium">
              {filteredCities.length}{" "}
              {filteredCities.length === 1 ? "destination" : "destinations"} in{" "}
              <span className="text-nature-800 font-semibold">{selectedState}</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCities.map((city) => (
                <DestinationCard key={city.id} city={city} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
