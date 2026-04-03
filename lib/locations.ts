export const NORTHEAST_CITIES = [
  { city: "Ziro", state: "Arunachal Pradesh" },
  { city: "Tawang", state: "Arunachal Pradesh" },
  { city: "Itanagar", state: "Arunachal Pradesh" },
  { city: "Serchhip", state: "Mizoram" },
  { city: "Aizawl", state: "Mizoram" },
  { city: "Tamenglong", state: "Manipur" },
  { city: "Imphal", state: "Manipur" },
  { city: "Kohima", state: "Nagaland" },
  { city: "Dimapur", state: "Nagaland" },
  { city: "Shillong", state: "Meghalaya" },
  { city: "Cherrapunji", state: "Meghalaya" },
  { city: "Gangtok", state: "Sikkim" },
  { city: "Pelling", state: "Sikkim" },
  { city: "Guwahati", state: "Assam" },
] as const;

export type CityName = typeof NORTHEAST_CITIES[number]["city"];
export type StateName = typeof NORTHEAST_CITIES[number]["state"];
