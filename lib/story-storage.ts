import { TravelerStory } from "@/types";
import { testimonials } from "@/data/mock";

const STORAGE_KEY = "ne_tourism_traveler_stories";

// Initialize with mock testimonials if empty
export const initializeStories = (): TravelerStory[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  
  // Convert mock testimonials to TravelerStory format
  const initialStories: TravelerStory[] = testimonials.map(t => ({
    id: t.id,
    travelerName: t.name,
    travelerPhoto: t.photo,
    destination: t.destination,
    title: `Beautiful trip to ${t.destination.split(',')[0]}`,
    storyText: t.review,
    rating: t.rating,
    location: t.location,
    visitDate: t.date,
    isFeatured: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialStories));
  return initialStories;
};

export const getStoredStories = (): TravelerStory[] => {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : initializeStories();
};

export const saveStory = (story: Omit<TravelerStory, "id" | "createdAt" | "updatedAt">) => {
  if (typeof window === "undefined") return null;
  const existing = getStoredStories();
  const newStory: TravelerStory = {
    ...story,
    id: `ts-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify([newStory, ...existing]));
  return newStory;
};

export const updateStory = (id: string, updates: Partial<TravelerStory>) => {
  if (typeof window === "undefined") return null;
  const existing = getStoredStories();
  const index = existing.findIndex(s => s.id === id);
  if (index === -1) return null;
  
  const updatedStory = {
    ...existing[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  existing[index] = updatedStory;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  return updatedStory;
};

export const deleteStory = (id: string) => {
  if (typeof window === "undefined") return false;
  const existing = getStoredStories();
  const filtered = existing.filter(s => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};
